
import Taro, { clearStorageSync, getStorageSync } from '@tarojs/taro';
import { isNumber } from '@tarojs/shared';
import ENV_MAP from '@/helper/env';

enum NetworkStatusCode {
  /** @name 无访问权限 */
  NoAuthCode = 403,
  /** @name 自定义业务异常 */
  BizErrorCode = 555,
  /** @name 服务器异常 */
  ServerErrorCode = 500,
  /** @name 成功 */
  SuccessCode = 200,
}

type NetworkException555 = {
  statusCode: NetworkStatusCode.BizErrorCode;
  data: {
    code: number;
    message: string;
  };
};

type NetworkException401 = {
  statusCode: NetworkStatusCode.NoAuthCode;
};

type NetworkException500 = {
  statusCode: NetworkStatusCode.ServerErrorCode;
  data: {
    code: 500;
    message: string;
  };
};

type NetworkException = {
  statusCode: number;
  [key: string]: any;
};

function parseParams(data: any) {
  try {
    var tempArr = [];
    for (var i in data) {
      var key = encodeURIComponent(i);
      var value = encodeURIComponent(data[i]);
      tempArr.push(key + '=' + value);
    }
    var urlParamsStr = tempArr.join('&');
    return urlParamsStr;
  } catch (err) {
    return '';
  }
}

/** @name 请求重试次数 */
const RETRY_COUNT = 3;

export enum NetworkMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

/**
 * @description 请求方法
 *
 * 请求success，返回resolve(data);
 * 请求fail，返回reject({statusCode: number, ...})
 *
 * @param method
 * @param url
 * @param params
 * @param data
 * @param header
 * @returns
 */
function request<T>(method: NetworkMethod, url: string, params = {}, data = {}, header = {}) {
  /** @name 请求baseUrl */
  let env: string = process.env.NODE_ENV === 'development' ? 'TEST' : 'PROD'
  const API_ENDPOINT = ENV_MAP[env].base_url;
  /** 合并url和params */
  if (params && Object.keys(params).length !== 0) {
    url += '?' + parseParams(params);
  }
  if (!url.includes('http')) {
    url = API_ENDPOINT + url;
  }

  let count = 0;

  async function send(): Promise<any> {
    if (++count > RETRY_COUNT) {
      // ShowNotice('No Authorization');
      return Promise.reject<NetworkException401>({ statusCode: NetworkStatusCode.NoAuthCode });
    }
    let token = getStorageSync("token")
    const option = {
      method,
      url,
      data: data,
      dataType: 'json',
      header: {
        'Content-type': 'application/json',
        Authorization: token,
        ...header,
      },
    };
    return Taro.request<T>(option)
      .then((res: Taro.request.SuccessCallbackResult) => {
        console.log('req url', url);
        console.log('req header', header);
        console.log('req params', params);
        console.log('req data', data);
        console.log('res', res);
        if (res.statusCode === NetworkStatusCode.SuccessCode) {
          return Promise.resolve(res.data);
        } else if (res.statusCode === NetworkStatusCode.NoAuthCode) {
          clearStorageSync()
          // return TokenInstance.Refresh().then(() => {
          return send();
          // });
        } else if (res.statusCode === NetworkStatusCode.BizErrorCode) {
          return Promise.reject<NetworkException555>({ statusCode: NetworkStatusCode.BizErrorCode, data: { code: res.data.code, message: res.data.message } });
        } else if (res.statusCode === NetworkStatusCode.ServerErrorCode) {
          return Promise.reject<NetworkException500>({ statusCode: NetworkStatusCode.ServerErrorCode, data: { code: 500, message: res.data.message } });
        } else {
          return Promise.reject<NetworkException>({ statusCode: res.statusCode, data: { code: res.data.code, message: res.data.message } });
        }
      })
      .catch((res: any) => {
        if (isNumber(res?.statusCode)) {
          return Promise.reject<NetworkException>(res);
        }
        return Promise.reject<NetworkException>({ statusCode: 0, res });
      });
  }

  return send();
}

const network = {
  get<T>(url: string, params?: Record<string, any>, data?: Record<string, any>, header?: Record<string, any>) {
    return request<T>(NetworkMethod.GET, url, params, data, header);
  },
  post<T>(url: string, params?: Record<string, any>, data?: Record<string, any>, header?: Record<string, any>) {
    return request<T>(NetworkMethod.POST, url, params, data, header);
  },
  put<T>(url: string, params?: Record<string, any>, data?: Record<string, any>, header?: Record<string, any>) {
    return request<T>(NetworkMethod.PUT, url, params, data, header);
  },
  delete<T>(url: string, params?: Record<string, any>, data?: Record<string, any>, header?: Record<string, any>) {
    return request<T>(NetworkMethod.DELETE, url, params, data, header);
  },
};

export default network;

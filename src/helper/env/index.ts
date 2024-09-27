import { EnvEnum } from "../const";


/**
 * @description 项目环境相关信息
 */
const ENV_MAP = {
  [EnvEnum.DEV]: {
    base_url: 'https://mall.baixianyoupin.cn/',
  },
  [EnvEnum.TEST]: {
    base_url: 'https://mall.baixianyoupin.cn',
  },
  [EnvEnum.BETA]: {
    base_url: 'https://mall.baixianyoupin.cn',
  },
  [EnvEnum.PROD]: {
    base_url: 'https://mall.baixianyoupin.cn',
  },
};

export default ENV_MAP;

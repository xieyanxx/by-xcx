declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.styl';
declare const LOCAL_DEBUG: boolean;
declare const DEBUG_ENV: 'TEST' | 'DEV' | 'BETA';
declare const isH5: boolean;
declare module 'file-saver'

// declare const process: {
//   env: {
//     TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt' | 'quickapp' | 'qq';
//     [key: string]: any;
//   }

// }

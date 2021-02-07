import axios from 'axios';
import { randomId } from '@/utils/helpers';
import APIS from '@/constants/apis';
import codes from '@/constants/codes';
import routePaths from '@/constants/routePaths';
import { getToken } from '@/utils/auth';

const { VUE_APP_API_DEV: apiDev, VUE_APP_API_PROD: apiProd, NODE_ENV: mode } = process.env;

const API_URL = mode === 'development' ? apiDev : apiProd;

const DP_TOKEN = getToken();

const axiosInstance = axios.create({
  baseURL: API_URL,
  method: 'post',
  timeout: 300000,
});

// 添加请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    const { headers, url, data, page } = config;
    config.url = APIS[url];
    config.headers = {
      ...headers,
      token: DP_TOKEN || getToken(),
    };
    const rId = randomId();
    config.data = {
      body: data || {},
      chlid: 'MNG',
      chlterminaltype: '20',
      funcCode: '',
      logId: rId, // 32位随机
      receiver: 'MNG-SERVER',
      sender: 'MNG-WEB',
      senttime: Math.round(Date.now() / 1000).toString(),
      txnId: rId,
      version: '1.0.0',
      ...(page || {}), // 分页信息放在body同级
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    const res = response.data;
    // 对于需要分页的数据，分页信息和body同级，对于不需要分页的数据，数据都在body内部
    const { code } = res;
    if (code === codes.requestSuccess) {
      // 将有效数据转为同层级，如 {body: {list: []}, page: 1} => {list: [], page: 1}
      const ret = Object.keys(res).reduce((acc, key) => {
        if (key !== 'code' && key !== 'message') {
          if (key === 'body') {
            Object.assign(acc, res.body);
          } else {
            acc[key] = res[key];
          }
        }
        return acc;
      }, {});
      return ret;
    } else {
      if (window.location.pathname !== routePaths.login) {
        // 重新登录的处理
        // if ([].indexOf(resultcode) !== -1) {
        //   console.log('需要重新登录');
        // }
      }
      // 抛错在 catch 中进行处理
      return Promise.reject(res);
    }
  },
  (error) => {
    // http 401 等错误在这里处理
    if (error.response) {
      switch (error.response.status) {
        case 401:
          break;
        case 403:
          break;
        case 404:
          break;
        default:
          break;
      }
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

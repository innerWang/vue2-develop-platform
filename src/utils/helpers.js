import dayjs from 'dayjs';
import { clearDB } from '@/utils/auth';
import routePaths from '@/constants/routePaths';
import { isObject } from '@/utils/validate';
export const randomId = (len = 32) => {
  if (typeof len !== 'number' || len < 1) {
    len = 32;
  }
  // 去掉了易混淆的字符
  const dic = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  let str = '';
  for (let i = 0; i < len; i++) {
    str += dic.charAt(Math.floor(Math.random() * dic.length));
  }
  return str;
};

export const delay = (t = 0) => new Promise((resolve) => setTimeout(resolve, t));

export const redirectToLogin = (t = 500) => {
  delay(t).then(() => {
    clearDB();
    window.location.href = routePaths.login;
  });
};

// 将数组字典对应的map转化为数组形式，便于渲染，如 {0: 'ok'} => [{key: '0', value: 'ok'}]
export const formatDicToArray = (obj) => {
  if (!isObject(obj)) {
    return [];
  }

  return Object.keys(obj).reduce((acc, k) => {
    acc.push({ key: k, value: obj[k] });
    return acc;
  }, []);
};

/**
 * 时间戳格式化
 * @param {*} t  传入的时间戳，为字符串或数字
 * @param {*} style 格式化的样式，默认值为 'YYYY-MM-DD HH:mm:ss'
 * @param {*} unit 时间戳的单位，默认为秒级，否则为毫秒级
 */
export const formatTime = (t, style = 'YYYY-MM-DD HH:mm:ss', unit = 's') => {
  const nt = parseInt(t); // 基数会自动判断，并非默认为10
  if (isNaN(nt)) {
    return '-';
  }
  const rt = unit === 's' ? nt * 1000 : nt;
  return dayjs(rt).format(style);
};

export const formatStrWithEllipsis = (str, head = 6, tail = 6) => {
  if (str.length < head + tail) {
    return str;
  }
  return str.slice(0, head) + '...' + str.slice(-tail);
};

/**
 * 移除一个对象中的某些属性，返回对应的浅拷贝
 * @param {*} obj
 * @param {*} fields
 */
export const omit = (obj, fields) => {
  const shallowCopy = Object.assign({}, obj);
  for (let i = 0; i < fields.length; i++) {
    delete shallowCopy[fields[i]];
  }
  return shallowCopy;
};

/**
 * 判断是否有子节点
 * @param {*} obj 传入的对象
 * @param {*} childrenField children 对应的字段名，默认为 'children'
 */
export const hasChildren = (obj, childrenField = 'children') => {
  return Array.isArray(obj[childrenField]) && obj[childrenField].length > 0;
};

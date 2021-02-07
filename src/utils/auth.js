const TokenKey = 'DP_TOKEN';

const db = window.localStorage;

export const getToken = () => {
  return db.getItem(TokenKey);
};

export const setToken = (val) => {
  db.setItem(TokenKey, val);
};

export const clearDB = () => {
  db.removeItem(TokenKey);
};

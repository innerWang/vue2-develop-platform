import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const modulesFiles = require.context('./modules', true, /\.js$/);

const modules = modulesFiles.keys().reduce((modules, path) => {
  const k = path.replace(/^\.\/(.*)\.\w+$/, '$1');
  const moduleConfig = modulesFiles(path);
  modules[k] = moduleConfig.default || moduleConfig;
  return modules;
}, {});

// 不要使用 createLogger 插件，keep-alive 时引发递归深拷贝，使用 vue-devtools 进行时间旅行
export default new Vuex.Store({
  modules,
});

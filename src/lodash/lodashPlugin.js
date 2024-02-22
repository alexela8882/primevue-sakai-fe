// lodashPlugin.js
import { filter, find, includes } from 'lodash';

const lodashPlugin = {
  install(Vue) {
    Vue.prototype.$_ = { filter, find, includes };
  },
};

export default lodashPlugin;

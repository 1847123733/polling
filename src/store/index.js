// 使用 vuex 创建数据仓库，并导出           固定规则
import Vue from 'vue';
import Vuex from 'vuex';                // 导入

import session from './session.js';
import publics from './public.js';
Vue.use(Vuex);

let store = new Vuex.Store({
    // 使用 modules 来配置整合所有的子仓库
    modules:{ session,publics },
    // state 中主要存放要放在 vuex 仓库中的数据
    state:{  },
    // getters
    getters:{  },
    // mutations 中存放很多方法，只有 mutations 中的方法里面的代码才有资格修改 state 中的数据
    // mutations 只能包含同步代码，不能包含任何耗时的异步代码
    mutations:{ },
    // actions 中也存放很多方法，且 actionss 中的方法无法修改 state 中的值，
    // actions 中的方法，可以包含异步的耗时的操作。
    actions:{  }
});


export default store;                           // 导出

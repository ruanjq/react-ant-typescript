
import {createStore,compose,applyMiddleware} from "redux";

// redux 中间件异步请求方案插件
import thunk from "redux-thunk";

import rootReducer from "../reducers";


// redux中三个重要部分, reducer,action,state(store)
// 创建store,通过combineReducers把多个reducer合并
const store = createStore(
    rootReducer,
    compose(
        applyMiddleware(...[thunk]), // 需要使用的中间件数组

        // 开启redux devtools chrome 调试工具
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    ),
);

export default store;


import {combineReducers} from "redux";

import {counterReducer} from "./counter_reduce";
import {appReducer} from "./app_reducer";


const rootReducer = combineReducers({
    counter:counterReducer,
    app:appReducer
});

export default rootReducer;
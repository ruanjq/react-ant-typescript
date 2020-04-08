
// 创建reduce
// 如果需要改变reducer的值，需要使用dispatch派发一个action
// action 需要2个参数
//   type: 通过type区分是对state做什么操作
//   payload 传递的数据
export const counterReducer = (state = {count:1},action:any) => {
    switch(action.type){
        case "COUNT_ADD":
            return {
                ...state,count:state.count+1
            }
        case "COUNT_REDUCE":
            return {
                ...state,count:state.count-1
            }    
        default:
            return state    
    }
}
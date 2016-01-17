// Tutorial 08 - dispatch-async-action-2.js
// 教程 08 - dispatch-async-action-2.js

// Let's try to run the first async action creator that we wrote in dispatch-async-action-1.js.
// 让我们试着运行一下我们所写的第一个异步的action creator的文件dispatch-async-action-1.js。

import { createStore, combineReducers } from 'redux'

var reducer = combineReducers({
    speaker: function (state = {}, action) {
        console.log('speaker was called with state', state, 'and action', action)

        switch (action.type) {
            case 'SAY':
                return {
                    ...state,
                    message: action.message
                }
            default:
                return state;
        }
    }
})
var store_0 = createStore(reducer)

var asyncSayActionCreator_1 = function (message) {
    return function (dispatch) {
        setTimeout(function () {
            dispatch({
                type: 'SAY',
                message
            })
        }, 2000)
    }
}

console.log("\n", 'Running our async action creator:', "\n")
store_0.dispatch(asyncSayActionCreator_1('Hi'))

// 输出:
//     ...
//     /Users/classtar/Codes/redux-tutorial/node_modules/redux/node_modules/invariant/invariant.js:51
//         throw error;
//               ^
//     Error: Invariant Violation: Actions must be plain objects. Use custom middleware for async actions.
//     ...

// It seems that our function didn't even reach our reducers. But Redux has been kind enough to give us a
// tip: "Use custom middleware for async actions.". It looks like we're on the right path but what is this
// "middleware" thing?
// 视乎我们的function没有到达我们的reducers。但是Redux十分友好的给我们一个提示:"Use custom middleware for async actions."。
// 好像我们已经走到了正确的道路上来了，但是"middleware"是什么东西？

// Just to reassure you, our action creator asyncSayActionCreator_1 is well-written and will work as expected
// as soon as we've figured out what middleware is and how to use it.
// 我们的action creator asyncSayActionCreator_1写的是对的
// 如果我们知道middleware是什么、怎么用它，代码就会在我们的期望下运行

// Go to next tutorial: 09_middleware.js
// 下一个教程: 09_middleware.js

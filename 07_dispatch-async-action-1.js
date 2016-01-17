// Tutorial 07 - dispatch-async-action-1.js

// We previously saw how we can dispatch actions and how those actions will modify
// the state of our application thanks to reducers.
// 我们之前看到了怎么样去dispatch actions 以及
// 这些actions是怎样通过reducers去修改我们应用的state

// But so far we've only considered synchronous actions or, more exactly, action creators
// that produce an action synchronously: when called an action is returned immediately.
// 但是，目前为止我们只是使用了同步的actions，更确切的说，action creators 只是提供了同步模式
// 当我们触发了一个action，它会立即返回

// Let's now imagine a simple asynchronous use-case:
// 1) user clicks on button "Say Hi in 2 seconds"
// 2) When button "A" is clicked, we'd like to show message "Hi" after 2 seconds have elapsed
// 3) 2 seconds later, our view is updated with the message "Hi"
// 让我们想象一下一个简单的异步情景
// 1) 用户点击一个按钮 "Say Hi in 2 seconds"
// 2) 当"A"按钮被点击了，我们期望显示message"Hi"在两秒之后
// 3) 2s之后，我们会更新message"Hi"在页面上


// Of course this message is part of our application state so we have to save it
// in Redux store. But what we want is to have our store save the message
// only 2 seconds after the action creator is called (because if we were to update our state
// immediately, any subscriber to state's modifications - like our view -  would be notified right away
// and would then react to this update 2 seconds too soon).
// 当然，这个是我们应用的state的一部分，所以我们必须保存起来在Redux store中去
// 但是我们想要的是在action creator被触发的2s后储存这个message（因为如果我们立即更新state，
// 任何的subscriber会通知state已经修改了 - 例如我们的view - 会被立即通知，并且立马改变view，
// 这个更新对于2s而言是在太快）

// If we were to call an action creator like we did until now...
// 如果我们触发一个action creator像我们已经写过的一样

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

var sayActionCreator = function (message) {
    return {
        type: 'SAY',
        message
    }
}

console.log("\n", 'Running our normal action creator:', "\n")

console.log(new Date());
store_0.dispatch(sayActionCreator('Hi'))

console.log(new Date());
console.log('store_0 state after action SAY:', store_0.getState())
// 输出 (跳过初始化的输出):
//     Sun Aug 02 2015 01:03:05 GMT+0200 (CEST)
//     speaker was called with state {} and action { type: 'SAY', message: 'Hi' }
//     Sun Aug 02 2015 01:03:05 GMT+0200 (CEST)
//     store_0 state after action SAY: { speaker: { message: 'Hi' } }


// ... then we see that our store is updated immediately.
// ... 然后我们看到了sotre立即更新了

// What we'd like instead is an action creator that looks a bit like this:
// 我们改变action creator像这样

var asyncSayActionCreator_0 = function (message) {
    setTimeout(function () {
        return {
            type: 'SAY',
            message
        }
    }, 2000)
}

// But then our action creator would not return an action, it would return "undefined". So this is not
// quite the solution we're looking for.
// 但是我们的action creator不会返回一个action，它只会返回"undefined"。所以这不是我们想要的解决方案

// Here's the trick: instead of returning an action, we'll return a function. And this function will be the
// one to dispatch the action when it seems appropriate to do so. But if we want our function to be able to
// dispatch the action it should be given the dispatch function. Then, this should look like this:
// 这个有一个小技巧：不返回一个action，我们return 一个 function。然后这个function会dispatch action 在适当的时候。但是，
// 如果我们想让我们的function可以去dispatch action，它应该被认定为一个dispatch function。然后，我们应该这么做

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

// Again you'll notice that our action creator is not returning an action, it is returning a function.
// So there is a high chance that our reducers won't know what to do with it. But you never know, so let's
// try it out and find out what happens...
// 我们注意到action creator没有return 一个 action，它 return一个function。
// 所以极有可能我们的reducers不知道怎么处理它(这个函数)。但是，我们永远不知道,所以我们可以试着看看发生了什么

// Go to next tutorial: 08_dispatch-async-action-2.js
// 进入下一个教程: 08_dispatch-async-action-2.js

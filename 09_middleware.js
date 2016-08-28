// Tutorial 09 - middleware.js
// 教程 09 - middleware.js

// We left dispatch-async-action-2.js with a new concept: "middleware". Somehow middleware should help us
// to solve async action handling. So what exactly is middleware?
// 我们在dispatch-async-action-2.js中遗留下"middleware"这个概念。在某种程度上来说middleware会帮助我们
// 解决处理异步action的问题。所以,到底什么是middleware?

// Generally speaking middleware is something that goes between parts A and B of an application to
// transform what A sends before passing it to B. So instead of having:
// A -----> B
// we end up having
// A ---> middleware 1 ---> middleware 2 ---> middleware 3 --> ... ---> B
// 简单的来说middleware，它穿梭在一个应用的A部分和B部分中，去改变A发送的内容给B。看下图
// A -----> B
// 最终会变成这样
// A ---> middleware 1 ---> middleware 2 ---> middleware 3 --> ... ---> B

// How could middleware help us in the Redux context? Well it seems that the function that we are
// returning from our async action creator cannot be handled natively by Redux but if we had a
// middleware between our action creator and our reducers, we could transform this function into something
// that suits Redux:
// 在Redux的上下文中middleware是如何帮助我们？我们从异步action creator中返回的函数是不能直接被
// Redux处理，但是如果我们有一个middleware在action creator和我们的reducers之间的话，就可以
// 改变这个函数，它就可以被Redux处理。

// action ---> dispatcher ---> middleware 1 ---> middleware 2 ---> reducers

// Our middleware will be called each time an action (or whatever else, like a function in our
// async action creator case) is dispatched and it should be able to help our action creator
// dispatch the real action when it wants to (or do nothing - this is a totally valid and
// sometimes desired behavior).
// 我们的middleware每次都会被触发，当一个action（或者说，像我们的异步action creator情况下产生的那个函数）被dispatched的时候
// 它可以帮助我们的action creator在需要的时候dispatch一个真实的action（或者不做任何事情 - 这个是完全有效的
// 有些时候这个是我们所期望）

// In Redux, middleware are functions that must conform to a very specific signature and follow
// a strict structure:
// 在Redux中，middleware是一个必须是一个特殊写法和指定结构的一个函数
/*
    var anyMiddleware = function ({ dispatch, getState }) {
        return function(next) {
            return function (action) {
                // your middleware-specific code goes here
                // 你的 middleware-specific 代码写在这里
            }
        }
    }
*/

// As you can see above, a middleware is made of 3 nested functions (that will get called sequentially):
// 1) The first level provide the dispatch function and a getState function (if your
//     middleware or your action creator needs to read data from state) to the 2 other levels
// 2) The second level provide the next function that will allow you to explicitly hand over
//     your transformed input to the next middleware or to Redux (so that Redux can finally call all reducers).
// 3) the third level provides the action received from the previous middleware or from your dispatch
//     and can either trigger the next middleware (to let the action continue to flow) or process
//     the action in any appropriate way.
// 如你在上面看到的，一个middleware是被3个嵌套的functions(它们会被按次序触发)组成。
// 1) 第1层提供给了一个dispatch函数和一个getState函数(如果你的middleware或者你的action creator需要
// 读取在state上的数据的)给第2层函数
// 2) 第2层函数提供了下一个函数，可以允许你去显示的处理你改变的输入去下一个middleware，或者直接丢给Redux(一遍redux
// 可以最终触发所有的reducers)
// 3)第3层提供从之前的middleware或者从你的dispatch获取到的action，既可以触发下一个middleware（让你的action继续flow）
// 也可以在适当的时候操作你的action

// Those of you who are trained to functional programming may have recognized above an opportunity
// to apply a functional pattern: currying (if you aren't, don't worry, skipping the next 10 lines
// won't affect your redux understanding). Using currying, you could simplify the above function like that:
// 如果你们了解函数式编程可能会发现这里是一个函数式的模式:currying(如果你不了解，别担心，跳过以下10行,不会印象你对redux的理解)
// 使用currying，你会简化上面的函数像这样
/*
    // "curry" may come any functional programming library (lodash, ramda, etc.)
    // "curry" 可以来自任何函数式编程的库
    var thunkMiddleware = curry(
        ({dispatch, getState}, next, action) => (
            // your middleware-specific code goes here
        )
    );
*/

// The middleware we have to build for our async action creator is called a thunk middleware and
// its code is provided here: https://github.com/gaearon/redux-thunk.
// Here is what it looks like (with function body translated to es5 for readability):
// 我们必须为异步action creator建立的middleware,
// 被叫做thunk middleware，它的代码地址：https://github.com/gaearon/redux-thunk.
// 在这里可以看到它到底是什么 (函数被转化成了es5，方便阅读):

var thunkMiddleware = function ({ dispatch, getState }) {
    // console.log('Enter thunkMiddleware');
    return function(next) {
        // console.log('Function "next" provided:', next);
        return function (action) {
            // console.log('Handling action:', action);
            return typeof action === 'function' ?
                action(dispatch, getState) :
                next(action)
        }
    }
}

// To tell Redux that we have one or more middlewares, we must use one of Redux's
// helper functions: applyMiddleware.
// 为了告诉Redux，我们有一个或者更多的middlewares，我们必须使用Redux的帮助函数applyMiddleware

// "applyMiddleware" takes all your middlewares as parameters and returns a function to be called
// with Redux createStore. When this last function is invoked, it will produce "a higher-order
// store that applies middleware to a store's dispatch".
// (from https://github.com/rackt/redux/blob/v1.0.0-rc/src/utils/applyMiddleware.js)
// "applyMiddleware" 将我们所有的middlewares作为参数，然后返回一个function去被Redux createStore调用
// 当最后一个function被调用了，它会产生"一个高阶的store，应用在middleware去给store's dispatch"
// (from https://github.com/rackt/redux/blob/v1.0.0-rc/src/utils/applyMiddleware.js)

// Here is how you would integrate a middleware to your Redux store:
// 下面将告诉你，你将怎样为你的Redux store集成一个middleware

import { createStore, combineReducers, applyMiddleware } from 'redux'

const finalCreateStore = applyMiddleware(thunkMiddleware)(createStore)
// For multiple middlewares, write: applyMiddleware(middleware1, middleware2, ...)(createStore)
// 对于多个的middlewares, 这样写: applyMiddleware(middleware1, middleware2, ...)(createStore)

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
                return state
        }
    }
})

const store_0 = finalCreateStore(reducer)
// Output:
//     speaker was called with state {} and action { type: '@@redux/INIT' }
//     speaker was called with state {} and action { type: '@@redux/PROBE_UNKNOWN_ACTION_s.b.4.z.a.x.a.j.o.r' }
//     speaker was called with state {} and action { type: '@@redux/INIT' }

// Now that we have our middleware-ready store instance, let's try again to dispatch our async action:
// 现在，我们有了我们自己middleware-ready store的实例,让我们再试一下dispatch异步的action

var asyncSayActionCreator_1 = function (message) {
    return function (dispatch) {
        setTimeout(function () {
            console.log(new Date(), 'Dispatch action now:')
            dispatch({
                type: 'SAY',
                message
            })
        }, 2000)
    }
}

console.log("\n", new Date(), 'Running our async action creator:', "\n")

store_0.dispatch(asyncSayActionCreator_1('Hi'))
// Output:
//     Mon Aug 03 2015 00:01:20 GMT+0200 (CEST) Running our async action creator:
//     Mon Aug 03 2015 00:01:22 GMT+0200 (CEST) 'Dispatch action now:'
//     speaker was called with state {} and action { type: 'SAY', message: 'Hi' }

// Our action is correctly dispatched 2 seconds after our call the async action creator!
// 在我们触发了异步的action creator,2s之后我们的action正确的dispatch了。

// Just for your curiosity, here is how a middleware to log all actions that are dispatched, would
// look like:
// 为了满足你的好奇心，这里可以看到middleware是怎样去记录所有的actions被触发的

function logMiddleware ({ dispatch, getState }) {
    return function(next) {
        return function (action) {
            console.log('logMiddleware action received:', action)
            return next(action)
        }
    }
}

// Same below for a middleware to discard all actions that goes through (not very useful as is
// but with a bit of more logic it could selectively discard a few actions while passing others
// to next middleware or Redux):
// 以下是一个middleware去丢弃多有的actions的过程(不是很有用，但是多一些逻辑，他可以选择性的丢弃一些actions，
// 当它通过下一个middleware或者Redux)
function discardMiddleware ({ dispatch, getState }) {
    return function(next) {
        return function (action) {
            console.log('discardMiddleware action received:', action)
        }
    }
}

// Try to modify finalCreateStore call above by using the logMiddleware and / or the discardMiddleware
// and see what happens...
// For example, using:
//     const finalCreateStore = applyMiddleware(discardMiddleware, thunkMiddleware)(createStore)
// should make your actions never reach your thunkMiddleware and even less your reducers.
// 试着改变finalCreateStore通过使用logMiddleware and / or the discardMiddleware,看看发生了什么
// 举个例子，使用
//     const finalCreateStore = applyMiddleware(discardMiddleware, thunkMiddleware)(createStore)
// 应该使你的actions不会到达你的thunkMiddleware,甚至减少你的reducers

// See http://rackt.org/redux/docs/introduction/Ecosystem.html, section Middlewares, to
// see other middleware examples.
// 看 http://rackt.org/redux/docs/introduction/Ecosystem.html, Middlewaresd的部分,
// 看看其他middleware的例子.

// Let's sum up what we've learned so far:
// 1) We know how to write actions and action creators
// 2) We know how to dispatch our actions
// 3) We know how to handle custom actions like asynchronous actions thanks to middlewares
// 让我们总结一下我们目前学了些什么东西:
// 1) 我们知道怎么写actions和action creators
// 2) 我们知道怎么去dispatch我们的actions
// 3) 我们知道怎么样去处理自定义的actions(异步actions)，多亏有了middlewares

// The only missing piece to close the loop of Flux application is to be notified about
// state updates to be able to react to them (by re-rendering our components for example).
// 唯一缺失的一块内容是Flux应用的state更新的循环通知(通过重复渲染我们的组件)

// So how do we subscribe to our Redux store updates?
// 如何才能subscribe我们的Redux store更新？

// Go to next tutorial: 10_state-subscriber.js
// 下一个教程: 10_state-subscriber.js

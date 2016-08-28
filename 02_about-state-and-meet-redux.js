// Tutorial 02 - about-state-and-meet-redux.js
// 教程 02 - about-state-and-meet-redux.js

// Sometimes the actions that we'll handle in our application will not only inform us
// that something happened but also tell us that data needs to be updated.
// 我们在应用中处理actions的时候，它会告诉我们发生了什么事情、以及什么数据将要被更新了。

// This is actually quite a big challenge in any app.
// Where do I keep all the data regarding my application along its lifetime?
// How do I handle modification of such data?
// How do I propagate modifications to all parts of my application?
// 在任何的应用中，这都是一个很大的挑战
// 我怎么样才能在应用的生命周期中，把所有的数据绑定在一起？
// 我怎么才能处理这些数据的更改？
// 我怎样才能传递信息到应用中的各个部分？

// Here comes Redux.
// Redux可以帮助你

// Redux (https://github.com/rackt/redux) is a "predictable state container for JavaScript apps"
// Redux (https://github.com/rackt/redux) is a "predictable state container for JavaScript apps"（这尼玛怎么翻译？）

// Let's review the above questions and reply to them with
// Redux vocabulary (flux vocabulary too for some of them):
// 让我们回顾下我们刚才所提到的问题，然后用Redux的相关名词来回答一下(flux的名词也在其中)

// Where do I keep all the data regarding my application along its lifetime?
//     You keep it the way you want (JS object, array, Immutable structure, ...).
//     Data of your application will be called state. This makes sense since we're talking about
//     all the application's data that will evolve over time, it's really the application's state.
//     But you hand it over to Redux (Redux is a "state container", remember?).
// How do I handle data modifications?
//     Using reducers (called "stores" in traditional flux).
//     A reducer is a subscriber to actions.
//     A reducer is just a function that receives the current state of your application, the action,
//     and returns a new state modified (or reduced as they call it)
// How do I propagate modifications to all parts of my application?
//     Using subscribers to state's modifications.

// Redux ties all this together for you.
// To sum up, Redux will provide you:
//     1) a place to put your application state
//     2) a mechanism to dispatch actions to modifiers of your application state, AKA reducers
//     3) a mechanism to subscribe to state updates

// The Redux instance is called a store and can be created like this:
/*
    import { createStore } from 'redux'
    var store = createStore()
*/

// But if you run the code above, you'll notice that it throws an error:
//     Error: Invariant Violation: Expected the reducer to be a function.

// That's because createStore expects a function that will allow it to reduce your state.

// Let's try again

import { createStore } from 'redux'

var store = createStore(() => {})

// Seems good for now...

// Go to next tutorial: 03_simple-reducer.js

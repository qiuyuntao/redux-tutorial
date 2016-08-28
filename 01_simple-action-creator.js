// Tutorial 1 - simple-action-creator.js
// 教程 1 - simple-action-creator.js

// We started to talk a little about actions in the introduction but what exactly are those "action creators"
// and how are they linked to "actions"?
// 我们已经开始谈论actions，你一定想知道到底什么是"action creators"以及它怎么样和"actions"连接在一起。

// It's actually so simple that a few lines of code can explain it all!
// 其实他们可以直接用一行代码就可以解释清楚。

// The action creator is just a function...
// action creator就是一个函数
var actionCreator = function() {
    // ...that creates an action (yeah, the name action creator is pretty obvious now) and returns it
    // ...这样就创建了一个action了(哈哈，这个函数名已经告诉我们他就是action creator了) 然后直接return
    return {
        type: 'AN_ACTION'
    }
}

// So is that all? yes.
// 难道就这么好了？哈哈，是这样的。

// However, one thing to note is the format of the action. This is kind of a convention in flux
// that the action is an object that contains a "type" property. This type allows for further
// handling of the action. Of course, the action can also contain other properties to
// pass any data you want.
// 需要注意的一点是action的格式。在flux中,默认约定action是一个拥有"type"属性的一个对象。type属性用于在接下来的过程中处理action。
// action同样可以包含其他的任意属性。

// We'll also see later that the action creator can actually return something other than an action,
// like a function. This will be extremely useful for async action handling (more on that
// in dispatch-async-action.js).
// 只有我们会看到action creator不仅仅可以return一个action，它同时也可以返回一个function。
// 在处理异步操作的时候，action creator返回一个函数是非常有用的(我们会在dispatch-async-action.js中详细解释)

// We can call this action creator and get an action as expected:
// 我们触发action creator，会得到一个action
console.log(actionCreator())
// Output: { type: 'AN_ACTION' }

// Ok, this works but it does not go anywhere...
// What we need is to have this action be sent somewhere so that
// anyone interested could know that something happened and could act accordingly.
// We call this process "Dispatching an action".
// 但是，这样是没什么卵用的...
// 我们需要的是在发送action到任意的地方，关心这个action的人可以知道发生了什么并且可以采取相应的措施
// 我们称这个过程为"Dispatching an action"。

// To dispatch an action we need... a dispatch function ("Captain obvious").
// And to let anyone interested know that an action happened, we need a mechanism to register
// "handlers". Such "handlers" to actions in traditional flux application are called stores and
// we'll see in the next section how they are called in redux.
// 为了dispatch一个action，我们需要一个dispatch函数。
//And to let anyone interested know that an action happened, we need a mechanism to register
// "handlers". Such "handlers" to actions in traditional flux application are called stores and
// 我们会在下一个章节学到在redux如何触发他们。

// So far here is the flow of our application:
// ActionCreator -> Action
// 这就是我们应用中的数据流动：
// ActionCreator -> Action

// Read more about actions and action creators here:
// 想了解更多actions和action creators可以看这里
// http://rackt.org/redux/docs/recipes/ReducingBoilerplate.html

// Go to next tutorial: 02_about-state-and-meet-redux.js
// 马上看第二个教程: 02_about-state-and-meet-redux.js

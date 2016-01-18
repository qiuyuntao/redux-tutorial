// Tutorial 0 - introduction.js
// 教程 0 - introduction.js

// Why this tutorial?
// While trying to learn Redux, I realized that I had accumulated incorrect knowledge about flux through
// articles I read and personal experience. I don't mean that articles about flux are not well written
// but I just didn't grasp concepts correctly. In the end, I was just applying documentation of different
// flux frameworks (Reflux, Flummox, FB Flux) and trying to make them match with the theoretical concept I read
// about (actions / actions creators, store, dispatcher, etc).
// Only when I started using Redux did I realize that flux is more simple than I thought. This is all
// thanks to Redux being very well designed and having removed a lot of "anti-boilerplate features" introduced
// by other frameworks I tried before. I now feel that Redux is a much better way to learn about flux
// than many other frameworks. That's why I want now to share with everyone, using my own words,
// flux concepts that I am starting to grasp, focusing on the use of Redux.
// 为什么写这个教程？
// 在学习Redux的过程中，我发现我通过别人的文章和个人的经验，我积累了很多关于flux的错误知识。
// 我的意思不是说这些关于flux的文章写的不够好，但我就是很难理解这些概念。
// 最后我只能通过各种flux的框架 (Reflux, Flummox, FB Flux)去试着把这些理论知识串联起来(actions / actions creators, store, dispatcher, etc)。
// 直到我开始使用Redux的时候，我才意识到flux比我想象的要简单。多亏Redux的良好设计，我可以不用学其他框架一直在介绍的"anti-boilerplate features"
// 我现在发现学习flux的相关知识，一个很好的方式就是去学习Redux。这就是为什么我想把Redux介绍给大家的原因。
// 专注的使用Redux，就会开始掌握flux的概念了

// You may have seen this diagram representing the famous unidirectional data flow of a flux application:
// 你应该已经见过下面这个介绍应用中的单向数据流的图表了吧

/*
                 _________               ____________               ___________
                |         |             |            |             |           |
                | Action  |------------▶| Dispatcher |------------▶| callbacks |
                |_________|             |____________|             |___________|
                     ▲                                                   |
                     |                                                   |
                     |                                                   |
 _________       ____|_____                                          ____▼____
|         |◀----|  Action  |                                        |         |
| Web API |     | Creators |                                        |  Store  |
|_________|----▶|__________|                                        |_________|
                     ▲                                                   |
                     |                                                   |
                 ____|________           ____________                ____▼____
                |   User       |         |   React   |              | Change  |
                | interactions |◀--------|   Views   |◀-------------| events  |
                |______________|         |___________|              |_________|

*/

// In this tutorial we'll gradually introduce you to concepts of the diagram above. But instead of trying
// to explain this complete diagram and the overall flow it describes, we'll take each piece separately and try to
// understand why it exists and what role it plays. In the end you'll see that this diagram makes perfect sense
// once we understand each of its parts.
// 在本教程中，我们会慢慢的给你介绍上面图表里所介绍的概念。
// 但是，现在我们不完整的介绍上面的图表内容和整个单向数据流的具体流程，我们会分别的介绍，并且试着去理解
// 它为什么存在，已经它在整个流程中起的作用。
// 一旦你理解了每一部分讲的是什么，你就会发现这个图表非常有意义。

// But before we start, let's talk a little bit about why flux exists and why we need it...
// Let's pretend we're building a web application. What are all web applications made of?
// 1) Templates / html = View
// 2) Data that will populate our views = Models
// 3) Logic to retrieve data, glue all views together and to react accordingly to user events,
//    data modifications, etc. = Controller
// 在我们开始之前，我们来聊聊为什么flux会存在，以及我们为什么需要它
// 让我们试着开发一个web应用。web应用由什么组成呢？
// 1) Templates / html = View
// 2) 用来填充页面的数据 = Models
// 3) 处理逻辑、串联所有的页面以及反映用户的操作，数据的修改等等 = Controller

// This is the very classic MVC that we all know about. But it actually looks like concepts of flux,
// just expressed in a slightly different way:
// - Models look like stores
// - user events, data modifications and their handlers look like
//   "action creators" -> action -> dispatcher -> callback
// - Views look like React views (or anything else as far as flux is concerned)
// 这是经典的MVC。但它实际上看起来是flux的概念，只是表达起来换一种方式。
// - Models 看起来是 stores
// - 用户的操作, 数据的修改以及他们的处理函数看起来就是 "action creators" -> action -> dispatcher -> callback
// - Views 就是React views(或者任何flux的关心的内容)

// So is flux just a matter of new vocabulary? Not exactly. But vocabulary DOES matter, because by introducing
// these new terms we are now able to express more precisely things that were regrouped under
// various terminologies... For example, isn't a data fetch an action? Just like a click is also an action?
// And a change in an input is an action too... Then we're all already used to issuing actions from our
// applications, we were just calling them differently. And instead of having handlers for those
// actions directly modify Models or Views, flux ensures all actions go first through something called
// a dispatcher, then through our stores, and finally all watchers of stores are notified.
// flux是一种新的术语？并不完全是。但是术语还是很重要的，因为通过介绍这些新的内容，我们可以更好的区分一下这么多的专业术语。
// 例如，是一个data触发了action？就是一个点击的操作也是一个action？input框中内容的改变也是一个action...
// 我们已经习惯这样在我们的应用中触发actions，只是叫法不同而已。现在我们不直接通过action去改变Models 或者 Views，
// fulx确保所有的的actions都经过dispatcher，再经过我们的stores，最终所有的监听我们stores的都会收到通过store修改的通知。

// To get more clarity how MVC and flux differ, we'll
// take a classic use-case in an MVC application:
// In a classic MVC application you could easily end up with:
// 1) User clicks on button "A"
// 2) A click handler on button "A" triggers a change on Model "A"
// 3) A change handler on Model "A" triggers a change on Model "B"
// 4) A change handler on Model "B" triggers a change on View "B" that re-renders itself
// 我们来更加清晰的阐述一下MVC和flux的不同。我们来看下经典的MVC应用的操作场景
// 在一个经典的MVC应用中，到最后应该会是这样
// 1) 用户点击了按钮 "A"
// 2) 处理点击按钮"A"的函数会去改变Model "A"
// 3) 当Model "A"改变后，触发一个函数去改变Model "B"
// 4) Model "B"改变后，会触发VIew "B"的改变，然后重新渲染


// Finding the source of a bug in such an environment when something goes wrong can become quite challenging
// very quickly. This is because every View can watch every Model, and every Model can watch other Models, so
// basically data can arrive from a lot of places and be changed by a lot of sources (any views or any models).
// 当出了问题的时候，想在这么复杂的源码环境中找到问题所在，想想都非常困难。
// 这是因为每个View可以监听每个Model，每个Model也会监听其他的Models。
// 所以基本的数据的来源会很多、并且会被很多代码改变(任何views或者任何models)

// Whereas when using flux and its unidirectional data flow, the example above could become:
// 1) user clicks on button "A"
// 2) a handler on button "A" triggers an action that is dispatched and produces a change on Store "A"
// 3) since all other stores are also notified about the action, Store B can react to the same action too
// 4) View "B" gets notified by the change in Stores A and B, and re-renders
// 当我们使用flux和它的单向数据流的时候，上诉的例子会变成这样
// 1) 用户点击按钮"A"
// 2) 点击按钮后促发一个action，这个action被dispatch，然后会改变Store "A"
// 3) 由于所有的stores都会被action通知到，store B也会对一个action做出反应
// 4) 当store A和B改变的时候，会通知到view "B",然后它会自己重新渲染

// See how we avoid directly linking Store A to Store B? Each store can only be
// modified by an action and nothing else. And once all stores have replied to an action,
// views can finally update. So in the end, data always flows in one way:
//     action -> store -> view -> action -> store -> view -> action -> ...
// 有没有看到我们是怎么防止storeA和B的直接联系？每一个store只能被一个action或者其他action所改变。
// 一旦所有的stores被action改变，views最后也会被更新。所以，到最后，数据的流动始终是一这个方式流动
//     action -> store -> view -> action -> store -> view -> action -> ...

// Just as we started our use case above from an action, let's start our tutorial with
// actions and action creators.
// 刚才是用例是从action讲起，那我们就开始讲讲actions和action creators把

// Go to next tutorial: 01_simple-action-creator.js
// 下一个教程: 01_simple-action-creator.js

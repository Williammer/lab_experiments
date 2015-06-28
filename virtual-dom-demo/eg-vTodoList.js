var h = require("virtual-dom/h")
var render = require("virtual-dom/render")
var raf = require("raf").polyfill
var Observ = require("observ")
var ObservArray = require("observ-array")
var computed = require("observ/computed")
var Delegator = require("dom-delegator")
var diff = require("virtual-dom-diff")
var patch require("virtual-dom-patch")
var batch = require("virtual-dom-batch")

// logic that takes state and renders your view.
function TodoList(items) {
    return h("ul", items.map(function(text) {
        return h("li", text)
    }))
}

function TodoApp(state) {
    return h("div", [
        h("h3", "TODO"), {
            render: TodoList,
            data: state.items
        },
        h("div", {
            "data-submit": "addTodo"
        }, [
            h("input", {
                value: state.text,
                name: "text"
            }),
            h("button", "Add # " + state.items.length + 1)
        ])
    ])
}

// model the state of your app
var state = {
    text: Observ(""),
    items: ObservArray([])
}

// react to inputs and change state
var delegator = Delegator(document.body)
delegator.on("addTodo", function(ev) {
    state.items.push(ev.currentValue.text)
    state.text.set("")
})

// render initial state
var currTree = TodoApp({
    text: state.text(),
    items: state.items().value
})
var elem = render(currTree)

document.body.appendChild(elem)

// when state changes diff the state
var diffQueue = []
var applyUpdate = false
computed([state.text, state.items], function() {
    // only call `update()` in next tick.
    // this allows for multiple synchronous changes to the state
    // in the current tick without re-rendering the virtual DOM
    if (applyUpdate === false) {
        applyUpdate = true
        setImmediate(function() {
            update()
            applyUpdate = false
        })
    }
})

function update() {
    var newTree = TodoApp({
        text: state.text(),
        items: state.items().value
    })

    // calculate the diff from currTree to newTree
    var patches = diff(currTree, newTree)
    diffQueue = diffQueue.concat(patches)
    currTree = newTree
}

// at 60 fps, batch all the patches and then apply them
raf(function renderDOM() {
    var patches = batch(diffQueue)
    patch(elem, patches)

    raf(renderDOM)
})

// Demo 1
// Looks like the idea of singleton. In essence, it's a special process of vnode.

// Only the first instance of this Thunk will be shown. 
// Once its been rendered, any other instances of ConstantlyThunk that
// diff with it will return a reference to the cached value that is automatically
// assigned to the "vnode" property
var ConstantlyThunk = function(greeting) {
    this.greeting = greeting
}
ConstantlyThunk.prototype.type = "Thunk"
ConstantlyThunk.prototype.render = function(previous) {// lib handles previous args.
    if (previous && previous.vnode) {
        return previous.vnode// return obj cache
    } else {
        return h('div', ["Constantly " + this.greeting])
    }
}

Thunk1 = new ConstantlyThunk("Thunk!")
Thunk2 = new ConstantlyThunk("I won't be rendered!")
thunkElem = createElement(Thunk1)
document.body.appendChild(thunkElem)
    // No new patches are generated
patches = diff(Thunk1, Thunk2)
    // Nothing will happen
patch(thunkElem, patches)


// Demo 2
var diff = require("virtual-dom").diff
var patch = require("virtual-dom").patch
var h = require("virtual-dom").h
var createElement = require("virtual-dom").create
    // Our GenericThunk will take 3 arguments
    // renderFn is the function that will generate the VNode
    // cmpFn is the function that will be used to compare state to see if an update is necessary.
    // returns true if the update should re-render, and false if it should use the previous render
    // state is a value that holds the information cmpFn will use to decide whether we should
    // update the Thunk or not
var GenericThunk = function(renderFn, cmpFn, state) {
    this.renderFn = renderFn
    this.cmpFn = cmpFn
    this.state = state
}

GenericThunk.prototype.type = "Thunk"

GenericThunk.prototype.render = function(previous) {
    // The first time the Thunk renders, there will be no previous state
    var previousState = previous ? previous.state : null
        // We run the comparison function to see if the state has changed enough
        // for us to re-render. If it returns truthy, then we call the render
        // function to give us a new VNode
    if ((!previousState || !this.state) || this.cmpFn(previousState, this.state)) {
        return this.renderFn(previous, this)
    } else {
        // vnode will be set automatically when a thunk has been created
        // it contains the VNode, VText, Thunk, or Widget generated by
        // our render function.
        return previous.vnode
    }
}

// The function we'll pass to GenericThunk to see if the color has changed
// We return a true value if the colors are different
var titleCompare = function(previousState, currentState) {
        return previousState.color !== currentState.color
    }
    // The function that builds our title when we detect that
    // the color has changed
var titleRender = function(previousThunk, currentThunk) {
    var currentColor = currentThunk.state.color
    return h("h1", {
        style: {
            color: currentColor
        }
    }, ["Hello, I'm a title colored " + currentColor])
}

var GreenColoredThunk = new GenericThunk(titleRender, titleCompare, {
    color: "green"
})
var BlueColoredThunk = new GenericThunk(titleRender, titleCompare, {
    color: "blue"
})

var currentNode = GreenColoredThunk
var rootNode = createElement(currentNode)

// A simple function to diff your thunks, and patch the dom
var update = function(nextNode) {
    var patches = diff(currentNode, nextNode)
    rootNode = patch(rootNode, patches)
    currentNode = nextNode
}

document.body.appendChild(rootNode)
    // We schedule a couple updates
    // Our first update will see that our color hasn't changed, and will stop comparing at that point,
    // instead returning a reference to GreenColoredThunk.vnode
setTimeout(function() {
        update(new GenericThunk(titleRender, titleCompare, {
            color: "green"
        }))
    },
    1000)

// In our second update, BlueColoredThunk will see that state.color has changed,
// and will return a new VNode, generating a patch
setTimeout(function() {
        update(BlueColoredThunk)
    },
    2000)

// Demo more
// https://github.com/Raynos/vdom-thunk
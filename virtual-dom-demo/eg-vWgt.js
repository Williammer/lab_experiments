/*
    Widgets are used to take control of the patching process, 
    allowing the user to create stateful components, control sub-tree rendering, 
    and hook into element removal.
*/
var diff = require("virtual-dom").diff
var patch = require("virtual-dom").patch
var h = require("virtual-dom").h
var createElement = require("virtual-dom").create

var OddCounterWidget = function() {}

OddCounterWidget.prototype.type = "Widget"
OddCounterWidget.prototype.count = 1
OddCounterWidget.prototype.init = function() {
    // With widgets, you can use any method you would like to generate the DOM Elements.
    // We could get the same result using:
    // return createElement(h("div", "Count is: " + this.count))
    var divElem = document.createElement("div")
        divElem.id = "counter-widget"
    var textElem = document.createTextNode("Count is: " + this.count)
    divElem.appendChild(textElem)
    return divElem
}

OddCounterWidget.prototype.update = function(previous, domNode) {
    this.count = previous.count + 1
        // Only re-render if the current count is odd
    if (this.count % 2) {
        // Returning a new element from widget#update
        // will replace the previous node
        return this.init()
    }
    return null
}

OddCounterWidget.prototype.destroy = function(domNode) {
    // While you can do any cleanup you would like here,
    // we don't really have to do anything in this case.
    // Instead, we'll log the current count
    console.log(this.count)
}

var myCounter = new OddCounterWidget()
var currentNode = myCounter
var rootNode = createElement(currentNode)

// A simple function to diff your widgets, and patch the dom
var update = function(nextNode) {
    var patches = diff(currentNode, nextNode)
    rootNode = patch(rootNode, patches)
    currentNode = nextNode
}

document.body.appendChild(rootNode)
setInterval(function() {
    update(new OddCounterWidget())
}, 1000)

/*
    Hooks are functions that execute after turning a VNode into an Element. 
    They are set by passing a VNode any property key with an object that has a function 
    called hook that has not been directly assigned. 
    The simplest way to ensure that a function 
    isn't directly assigned is for it to be a prototype on an object.
*/
var h = require('virtual-dom/h');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var createElement = require('virtual-dom/create-element');

// Demo 1
var Hook = function(){}
Hook.prototype.hook = function(node, propertyName, previousValue) { 
  console.log("Hello, World")
}
createElement(h('div', { "my-hook": new Hook() }))


// Demo 2
var Hook = function(){}
Hook.prototype.hook = function(node, propertyName, previousValue) {
  console.log("type: ", node.constructor.name)
}
createElement(h('div', { "my-hook": new Hook() }))
// logs "type: HTMLDivElement"

var Hook = function(){}
Hook.prototype.hook = function(node, propertyName, previousValue) { 
  console.log("name: " + propertyName)
}
createElement(h('div', { "my-hook": new Hook() }))
// logs "name: my-hook"


/*
    virtual-hyperscript uses hooks for several things, 
    including setting up events and returning focus to input elements after a render. 
    You can view these hooks in: 

    https://github.com/Matt-Esch/virtual-dom/tree/master/virtual-hyperscript/hooks
*/
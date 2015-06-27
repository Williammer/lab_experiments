var VNode = require("virtual-dom").VNode
var createElement = require("virtual-dom").create

var Hook = function() {}
Hook.prototype.hook = function(elem, key, previousValue) {
    console.log("Hello from " + elem.id + "!\nMy key was: " + key)
}

var tagName = "div"
var style = "width: 100px; height: 100px; background-color: #FF0000;"
var attributes = {
    "class": "red box",
    style: style
}
var key = "my-unique-red-box"
var namespace = "http://www.w3.org/1999/xhtml"
var properties = {
    attributes: attributes,
    id: "my-red-box",
    "a hook can have any property key": new Hook()
}
var childNode = new VNode("div", {
    id: "red-box-child"
})

RedBoxNode = new VNode(tagName, properties, [childNode], key, namespace)
RedBoxElem = createElement(RedBoxNode)
document.body.appendChild(RedBoxElem)

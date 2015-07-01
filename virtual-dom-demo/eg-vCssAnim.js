var mercury = require("mercury")
var h = mercury.h
var nextTick = require('next-tick')
var rnd_str = require('random-string')

var events = {
  addItem: mercury.input()
};

var state = mercury.struct({
  events: events,
  items: mercury.array([Item(rnd_str({length: 10}))])
});

events.addItem(function() {
  state.items.push(Item(rnd_str({length: 10})));
});

function Item(desc) {
  var state = mercury.struct({
    desc: mercury.value(desc)
  });

  return state;
}

Item.render = function(state) {
  var removing = false;
  
  return h('li', {
    'class' : new ItemInsertHook('item tr'),
  }, [
    h('div.desc', state.desc),
  ]);
}
    
function ItemInsertHook(value) {
  this.value = value;
}
    
ItemInsertHook.prototype.hook = function(elem, propName) {
  if (!elem.childNodes.length) {
    elem.setAttribute(propName, this.value + ' opaque');

    nextTick(function () {
      elem.setAttribute(propName, this.value + '');
    }.bind(this))
  }
}

function renderItemsList(state) {  
  return h('ul#item-list', [
    state.items.map(function(item) {return Item.render(item);})
  ]);
}

function render(state) {
  
  return h('#main', [
    h('button', {
      'ev-click' : mercury.event(state.events.addItem)
    }, 'Add item'),
    renderItemsList(state)
  ]);
}

mercury.app(document.body, state, render);

var insertCSS = require('insert-css')

var css = 'label {display: block}\n';
css += 'ul {list-style-type: none;}\n';
css += 'li.item {max-width: 300px; height: 30px;' 
    + 'border-radius: 2px;'
    + 'box-shadow: 0 1px 1px #ccc;'
    + 'padding: 0.7em; margin: 0 0 5px}\n';
css += 'li.item.opaque {opacity : 0.01; transform: translateZ(0);}\n';
css += 'li.item.tr {transition: opacity 0.75s ease-in-out;}\n';
css += 'li.item {opacity : 0.99; transform: translateZ(0);}\n';
insertCSS(css);

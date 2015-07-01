/*
  http://requirebin.com/?gist=250e6e59aa40d5ff0fcc
*/

Item.render = function(state) {
  return h('li', {
    'class' : new ItemInsertHook('item'),
  }, [
    h('div.text', state.text), 
    h('button', {
      'ev-click' : mercury.event(...)
    }, 'Remove or something...'),
  ]);
}

function ItemInsertHook(value) {
  this.value = value;
}

ItemInsertHook.prototype.hook = function(elem, propName) {
  
  // Here we want to see if this is a newly created dom element
  // or an element that was inserted before and is revisited.
  // The way to check for that in this case is see if the element is 
  // attached to the dom.
  // Newly created element will not be attached to the dom when hook is executed.
  
  if (!document.body.contains(elem)) {
    elem.setAttribute(propName, this.value + ' inserting');

    nextTick(function () {
      elem.setAttribute(propName, this.value + '');
    }.bind(this))
  }
}

//Elswhere at the top level of application:
function renderItemsList(state) {
  return h('ul#item-list', [
    state.items.map(function(item) {return Item.render(item);})
  ]);
}

/*
  li.item.inserting { opacity : 0.01; }
  li.item { transition: opacity 0.2s ease-in-out; }
  li.item { opacity : 0.99; }
*/
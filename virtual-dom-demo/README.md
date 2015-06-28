# Some valuable concepts upon virtual-dom.

## virtual-dom design
type Component<T> := {
    render: (data: T) => VirtualDOMNode,
    compare?: (left: T, right: T) => Boolean,
    data?: T
}
 
type VirtualDOMNode := {
    properties: Object,
    tagName: String,
    childNodes: Array<VirtualDOMNode | Component>
}
 
type VirtualDOMTree := VirtualDOMNode | Component
 
type DOMAttributeString := String
type DOMAttributeValue := Any
 
type DOMPatch := {
    path: Array<Number>,
    operation: 'attribute' | 'insert' | 'remove' 
    key?: DOMAttributeString,
    value: VirtualDOMTree | DOMAttributeValue | null
}
 
virtual-dom/h := (
    tagName: String,
    attrs?: Object,
    children?: Array<VirtualDOMTree>
) => VirtualDOMTree
 
virtual-dom/render := (tree: VirtualDOMTree) => DOMElement
 
virtual-dom-diff := (left: VirtualDOMTree, right: VirtualDOMTree)
    => Array<DOMPatch>
 
virtual-dom-batch := (patches: Array<DOMPatch>) => Array<DOMPatch>
 
virtual-dom-patch := (elem: DOMElement, patches: Array<DOMPatch>) => void

## react.evtDelegation 
clickCaptureListeners['a'](event);
clickCaptureListeners['a.b'](event);
clickCaptureListeners['a.b.c'](event);
clickBubbleListeners['a.b.c'](event);
clickBubbleListeners['a.b'](event);
clickBubbleListeners['a'](event);


## License
	The MIT License (MIT)

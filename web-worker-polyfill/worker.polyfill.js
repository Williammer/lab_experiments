(function WorkerPolyfill() {
    // helper functions.

    function DualEvent() {
        var cycle, scheduling_queue, useArrQueue = false;
            timer = (typeof setImmediate !== "undefined") ?
            function timer(fn) {
                return setImmediate(fn); } :
            setTimeout;

        // Note: using a queue instead of array for efficiency
        function Queue(arrQueue) {
            if (arrQueue) {
                // Array impl
                var queue = [],
                    item = {};
            } else {
                // LList impl
                var first, last, item;

                function Item(fn) {
                    this.fn = fn;
                    this.next = void 0;
                }
            }

            return {
                add: function add(fn) {
                    if (arrQueue) {
                        // Array impl
                        item.fn = fn;
                        queue.push(item);

                    } else {
                        // LList impl
                        item = new Item(fn);
                        if (last) {
                            last.next = item;
                        } else {
                            first = item;
                        }
                        last = item;
                        item = void 0;
                    }
                },
                flush: function flush() {
                    if (arrQueue) {
                        // Array impl
                        while(queue.length > 0){
                            item = queue.shift();
                            item.fn && item.fn();
                        }
                    } else {
                        // LList impl
                        var f = first;
                        first = last = cycle = null;

                        while (f) {
                            f.fn();
                            f = f.next;
                        }
                    }
                }
            };
        }

        // useArrQueue = true;
        console.log("[config] useArrQueue: "+useArrQueue);
        scheduling_queue = Queue(useArrQueue);

        function schedule(fn) {
            scheduling_queue.add(fn);
            if (!cycle) {
                cycle = timer(scheduling_queue.flush);
            }
        }

        function Event(handlers) {
            function addEventListener(evtname, handler) {
                if (handlers.local) {
                    handlers.local[evtname] = handlers.local[evtname] || [];
                    handlers.local[evtname].push(handler);
                }
            }

            function notifyRemote(evtname, data) {
                if (evtname != "error") {
                    data = { data: data };
                }
                if (typeof handlers.remoteEvent["on" + evtname] == "function") {
                    handlers.remoteEvent["on" + evtname](data);
                }

                handlers.remote[evtname].forEach(function foreach(h) {
                    h(data);
                });
            }

            function postMessage(data) {
                if (buffer) {
                    buffer.push(data);
                    return;
                }

                schedule(function scheduler() {
                    notifyRemote("message", data);
                });
            }

            function emitBuffer() {
                if (buffer && buffer.length > 0) {
                    buffer.forEach(function foreach(item) {
                        notifyRemote("message", item);
                    });
                }
                buffer = null;
            }

            var buffer = [];

            this.onmessage = null;
            this.onerror = null;
            this.addEventListener = addEventListener;
            this.postMessage = postMessage;
            this.emitBuffer = emitBuffer;
            this.notifyRemote = notifyRemote;
        }

        var e1, e2,
            h1 = {
                local: { message: [], error: [] }
            },
            h2 = {
                local: { message: [], error: [] }
            };

        // wire the duals' handlers together
        h1.remote = h2.local;
        h2.remote = h1.local;

        // create the dual Events
        e1 = new Event(h1);
        e2 = new Event(h2);

        h1.remoteEvent = e2;
        h2.remoteEvent = e1;

        return [e1, e2];
    }

    function importScripts() {
        throw "importScripts() not supported by this polyfill.";
    }

    function publicEventAPI(e) {
        this.onmessage = e.onmessage;
        this.onerror = e.onerror;
        this.addEventListener = e.addEventListener;
        this.postMessage = e.postMessage;
    }


    // Construct webworker
    if (!window.Worker$) {
        window.Worker$ = function window$Worker(url) {
            var Events = DualEvent(),
                e1 = Events[0],
                e2 = Events[1],
                worker, xhr,
                emitBufferE1 = e1.emitBuffer,
                emitBufferE2 = e2.emitBuffer,
                notifyE2 = e1.notifyRemote,
                notifyE1 = e2.notifyRemote,
                globalPropNames = [],
                globalProps;

            // clean up public APIs
            publicEventAPI.call(this, e1); // allocate the main ctx to e1.
            e2 = new publicEventAPI(e2);

            // setup fake `self` global properties
            e2.importScripts = importScripts;
            e2.self = e2;
            e2.navigator = window.navigator;
            e2.location = { href: url };
            e2.XMLHttpRequest = window.XMLHttpRequest;
            // e2.WebSocket = window.WebSocket;

            // prepare for worker fake Function
            globalPropNames = Object.getOwnPropertyNames(e2);
            globalProps = globalPropNames.map(function map(name) {
                return e2[name];
            });

            // inside Event doesn't need to be buffered
            emitBufferE2();

            // load the worker file
            xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function onready() {
                if (xhr.readyState == 4) {
                    worker = Function.apply(
                        null,
                        globalPropNames.concat([xhr.responseText])
                    );
                    // fake the remote Worker context with Function apply
                    try {
                        // run remote worker operations first
                        worker.apply(e2, globalProps);

                        // emitBuffer outside Event now
                        emitBufferE1();
                    } catch (err) {
                        notifyE1("error", err);
                    }
                }
            };
            xhr.open("GET", url);
            xhr.send();
        };
    }
})();

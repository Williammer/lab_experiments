
// this is in another thread, in which time-consuming process can be executed here.
self.onmessage = function(event){

	console.dir("2. gget the Nic from outside. ...:");
	console.dir(event);
	self.postMessage("Hello, " + event.data + "!"); 
};


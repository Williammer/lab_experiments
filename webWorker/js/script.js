self.onmessage = function(event){

	console.dir("2. gget the Nic from outside. ...:");
	console.dir(event.data);
	self.postMessage("Hello, " + event.data + "!"); 
};

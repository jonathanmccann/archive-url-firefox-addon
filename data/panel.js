// Access the elements in panel.html
var saveWaybackMachineButton = document.getElementById("saveWaybackMachine");
var saveArchiveIsButton = document.getElementById("saveArchiveIs");

// Listen for button clicks and emit for index.js to run associated functions
saveWaybackMachineButton.addEventListener('click', function() {
	self.port.emit("saveWaybackMachine");
});

saveArchiveIsButton.addEventListener('click', function() {
	self.port.emit("saveArchiveIs");
});
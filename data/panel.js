// Access the elements in panel.html
var saveWaybackMachineButton = document.getElementById("saveWaybackMachine");
var saveArchiveIsButton = document.getElementById("saveArchiveIs");
var urlTextInput = document.getElementById("modifiedURL");

// Listen for button clicks and emit for index.js to run associated functions
saveWaybackMachineButton.addEventListener('click', function() {
	self.port.emit("saveWaybackMachine", urlTextInput.value);
});

saveArchiveIsButton.addEventListener('click', function() {
	self.port.emit("saveArchiveIs", urlTextInput.value);
});

// Populate the text box with the current URL when displaying the panel
self.port.on("show", function onShow(url) {
	urlTextInput.value = url;
});
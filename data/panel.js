// Set up defaultArchiver to allow for enter press in url text input
var defaultArchiver = "waybackMachine";

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
self.port.on("show", function onShow(archiver, url) {
	defaultArchiver = archiver;
	urlTextInput.value = url;
});

// Add a listener to the URL text box for the 'enter' key and submit the URL to the default archiver
urlTextInput.addEventListener('keyup', function onkeyup(event) {
	if (event.keyCode == 13) {
		if (defaultArchiver == "archiveIs") {
			self.port.emit("saveArchiveIs", urlTextInput.value);
		}
		else {
			self.port.emit("saveWaybackMachine", urlTextInput.value);
		}
	}
}, false);
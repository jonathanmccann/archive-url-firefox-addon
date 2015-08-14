var saveWaybackMachineButton = document.getElementById("saveWaybackMachine");
var saveArchiveIsButton = document.getElementById("saveArchiveIs");
var urlTextInput = document.getElementById("modifiedURL");

saveWaybackMachineButton.addEventListener('click', function() {
	self.port.emit("saveWaybackMachine", urlTextInput.value);
});

saveArchiveIsButton.addEventListener('click', function() {
	self.port.emit("saveArchiveIs", urlTextInput.value);
});

self.port.on("show", function onShow(url) {
	urlTextInput.value = url;
});
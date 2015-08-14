var saveWaybackMachineButton = document.getElementById("saveWaybackMachine");
var saveArchiveIsButton = document.getElementById("saveArchiveIs");

saveWaybackMachineButton.addEventListener('click', function() {
	self.port.emit("saveWaybackMachine");
});

saveArchiveIsButton.addEventListener('click', function() {
	self.port.emit("saveArchiveIs");
});
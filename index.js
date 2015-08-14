var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var self = require("sdk/self");
var tabs = require("sdk/tabs");

var button = ToggleButton({
	id: "my-button",
	label: "my button",
	icon: {
		"16": "./archive-icon-16.png",
		"32": "./archive-icon-32.png",
		"64": "./archive-icon-64.png"
	},
	onChange: handleChange
});

var contextMenu = require("sdk/context-menu");
	var menuItem = contextMenu.Item({
		label: "Save to Wayback Machine",
		context: contextMenu.PageContext(),
		contentScript: 'self.on("click", function () {' +
					   '	self.postMessage();' +
					   '});',
		onMessage: function () {
			handleSaveWaybackMachine();
		}
});

var panel = panels.Panel({
	contentURL: self.data.url("panel.html"),
	contentScriptFile: self.data.url("panel.js"),
	onHide: handleHide,
	width: 250,
	height: 60
});

function handleChange(state) {
	if (state.checked) {
		panel.show({
			position: button
		});
	}
	else {
		panel.hide({
			position: button
		})
	}
}

function handleHide() {
	button.state('window', {checked: false});
}

function handleSaveArchiveIs() {
	panel.hide();
	tabs.open("https://archive.is/?run=1&url=" + tabs.activeTab.url);
}

function handleSaveWaybackMachine() {
	panel.hide();
	tabs.open("https://web.archive.org/save/" + tabs.activeTab.url);
}

panel.port.on("saveArchiveIs" , function() {
	handleSaveArchiveIs(tabs.activeTab.url);
});

panel.port.on("saveWaybackMachine" , function() {
	handleSaveWaybackMachine(tabs.activeTab.url);
});
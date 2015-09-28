// Set up necessary variables via "require"
var contextMenu = require("sdk/context-menu");
var preferences = require("sdk/simple-prefs").prefs;
var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var self = require("sdk/self");
var tabs = require("sdk/tabs");
var windowUtils = require('sdk/window/utils');

require("sdk/simple-prefs").on("defaultArchiver", onDefaultArchiverPreferenceChange);
require("sdk/simple-prefs").on("oneClickSave", onOneClickSavePreferenceChange);

// Create string constants for the context menu label
var archiveIsLabel = "Save to archive.is";
var waybackMachineLabel = "Save to Wayback Machine";

// Create string constants for the toolbar button label
var saveUrlLabel = "Save URL";

// Initialize preferences
var defaultArchiver = preferences.defaultArchiver;
var oneClickSave = preferences.oneClickSave;

// Initialize labels
var contextMenuArchiverLabel = (defaultArchiver == "archiveIs") ? archiveIsLabel : waybackMachineLabel;
var toolbarButtonLabel = oneClickSave ? contextMenuArchiverLabel : saveUrlLabel;

// Create toggle button for toolbar
var button = ToggleButton({
	id: "save-url",
	label: toolbarButtonLabel,
	icon: {
		"16": "./archive-icon-16.png",
		"32": "./archive-icon-32.png",
		"64": "./archive-icon-64.png"
	},
	onChange: handleChange
});

// Create context menu item
var menuItem = contextMenu.Item({
	label: contextMenuArchiverLabel,
	context: contextMenu.PageContext(),
	contentScript: 'self.on("click", function () {' +
				   '	self.postMessage();' +
				   '});',
	onMessage: function () {
		handleSave();
	}
});

// Create panel to be used in the toggle button
var panel = panels.Panel({
	contentURL: self.data.url("panel.html"),
	contentScriptFile: [self.data.url("jquery-1.11.3.min.js"), self.data.url("panel.js")],
	onHide: handleHide,
	width: 210,
	height: 55
});

function handleChange(state) {
	if (oneClickSave) {
		handleSave();

		button.state('window', {checked: false});
	}
	else if (state.checked) {
		panel.show({
			position: button
		});
	}
}

function handleHide() {
	button.state('window', {checked: false});
}

function handleSave() {
	if (defaultArchiver == "archiveIs") {
		handleSaveArchiveIs();
	}
	else {
		handleSaveWaybackMachine();
	}
}

function handleSaveArchiveIs() {
	var document = windowUtils.getMostRecentBrowserWindow().document;

	tabs.open("https://archive.is/?run=1&url=" + document.getElementById("urlbar").value);

	panel.hide();
}

function handleSaveWaybackMachine() {
	var document = windowUtils.getMostRecentBrowserWindow().document;

	tabs.open("https://web.archive.org/save/" + document.getElementById("urlbar").value);

	panel.hide();
}

function onDefaultArchiverPreferenceChange() {
	defaultArchiver = preferences.defaultArchiver;

	contextMenuArchiverLabel = (defaultArchiver == "archiveIs") ? archiveIsLabel : waybackMachineLabel;
	menuItem.label = contextMenuArchiverLabel;

	toolbarButtonLabel = oneClickSave ? contextMenuArchiverLabel : saveUrlLabel;
	button.label = toolbarButtonLabel
}

function onOneClickSavePreferenceChange() {
	oneClickSave = preferences.oneClickSave;

	toolbarButtonLabel = oneClickSave ? contextMenuArchiverLabel : saveUrlLabel;
	button.label = toolbarButtonLabel
}

// Handle button clicks from the panel
panel.port.on("saveArchiveIs" , function() {
	handleSaveArchiveIs();
});

panel.port.on("saveWaybackMachine" , function() {
	handleSaveWaybackMachine();
});
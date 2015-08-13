var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");

var button = buttons.ActionButton({
	id: "save-url-link",
	label: "Save URL to Wayback Machine",
	icon: {
		"16": "./archive-icon-16.png",
		"32": "./archive-icon-32.png",
		"64": "./archive-icon-64.png",
		"128": "./archive-icon-128.png",
	},
	onClick: handleSaveURL
});

var contextMenu = require("sdk/context-menu");
	var menuItem = contextMenu.Item({
		label: "Save to Wayback Machine",
		context: contextMenu.PageContext(),
		contentScript: 'self.on("click", function () {' +
					   '	self.postMessage();' +
					   '});',
		onMessage: function () {
			handleSaveURL();
		}
});

function handleSaveURL() {
	tabs.open("http://web.archive.org/save/" + tabs.activeTab.url);
}
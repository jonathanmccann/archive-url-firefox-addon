var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");

var button = buttons.ActionButton({
	id: "save-url-link",
	label: "Save URL to Wayback Machine",
	icon: {
		"16": "./icon-save-16.png",
		"32": "./icon-save-32.png",
		"48": "./icon-save-64.png"
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
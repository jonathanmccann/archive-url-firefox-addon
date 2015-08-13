var tabs = require("sdk/tabs");

var contextMenu = require("sdk/context-menu");
	var menuItem = contextMenu.Item({
		label: "Save to Wayback Machine",
		context: contextMenu.PageContext(),
		contentScript: 'self.on("click", function () {' +
					   '	self.postMessage();' +
					   '});',
		onMessage: function () {
			tabs.open("http://web.archive.org/save/" + tabs.activeTab.url);
		}
});
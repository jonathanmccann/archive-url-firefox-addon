var archiver = "wayback";

var archiveCurrentUrlTitle = "Archive Current URL";
var archiveImageUrlTitle = "Archive Image URL";
var archiveLinkUrlTitle = "Archive Link URL"

function saveCurrentUrl() {
	browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
		if (tabs[0]) {
			archiveUrl(tabs[0].url);
		}
	});
}

function archiveUrl(url) {
	if (archiver == "archive") {
		browser.tabs.create({
			url: "https://archive.is/?run=1&url=" + url
		})
	}
	else {
		browser.tabs.create({
			url: "https://web.archive.org/save/" + url
		})
	}
}

// Check for changes to 'archiver' and update the local value accordingly as well as the toolbar title
function updateArchiver(changes, area) {
	if (area == "local") {
		var changedItems = Object.keys(changes);

		for (item of changedItems) {
			if (item == "archiver") {
				archiver = changes[item].newValue;

				console.log("Archiver - " + archiver);

				if (archiver == "archive") {
					browser.browserAction.setTitle({title: "Archive to archive.is"});
				}
				else {
					browser.browserAction.setTitle({title: "Archive to Wayback Machine"});
				}
			}
		}
	}
}

// Create the various context menus
browser.contextMenus.create({
	id: "archive-url",
	title: archiveCurrentUrlTitle,
	contexts: ["page"]
})

browser.contextMenus.create({
	id: "archive-image-url",
	title: archiveImageUrlTitle,
	contexts: ["image"]
})

browser.contextMenus.create({
	id: "archive-link-url",
	title: archiveLinkUrlTitle,
	contexts: ["link"]
})

browser.contextMenus.onClicked.addListener(function(info, tab) {
	switch (info.menuItemId) {
		case "archive-url":
			archiveUrl(tab.url);
			break;
		case "archive-image-url":
			archiveUrl(info.srcUrl);
			break;
		case "archive-link-url":
			archiveUrl(info.linkUrl);
			break;
	}
});

// Add listener for toolbar button
browser.browserAction.onClicked.addListener(saveCurrentUrl);

// Add listener for changes to local storage to update the archiver
browser.storage.onChanged.addListener(updateArchiver);
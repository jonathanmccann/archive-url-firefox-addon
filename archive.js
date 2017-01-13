var archiver;

var archiveCurrentUrlTitle = "Archive Current URL";
var archiveImageUrlTitle = "Archive Image URL";
var archiveLinkUrlTitle = "Archive Link URL"

function saveCurrentUrl() {
	browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
		if (tabs[0]) {
			if (archiver == "archive") {
				archiveUrlArchive(tabs[0].url);
			}
			else {
				archiveUrlWayback(tabs[0].url);
			}
		}
	});
}

function archiveUrlArchive(url) {
	browser.tabs.create({
		url: "https://archive.is/?run=1&url=" + url
	})
}

function archiveUrlWayback(url) {
	browser.tabs.create({
		url: "https://web.archive.org/save/" + url
	})
}

// Check for changes to 'archiver' and update the local value accordingly as well as the toolbar title
function checkForArchiverChanges(changes, area) {
	if (area == "local") {
		var changedItems = Object.keys(changes);

		for (item of changedItems) {
			if (item == "archiver") {
				archiver = changes[item].newValue;

				updateArchiver();
			}
		}
	}
}

function updateArchiver() {
	console.log("Archiver = " + archiver);

	if (archiver == "archive") {
		browser.browserAction.setTitle({title: "Archive to archive.is"});

		browser.contextMenus.removeAll();

		browser.contextMenus.create({
			id: "archive-url-archive",
			title: archiveCurrentUrlTitle,
			contexts: ["page"]
		})

		browser.contextMenus.create({
			id: "archive-image-url-archive",
			title: archiveImageUrlTitle,
			contexts: ["image"]
		})

		browser.contextMenus.create({
			id: "archive-link-url-archive",
			title: archiveLinkUrlTitle,
			contexts: ["link"]
		})
	}
	else {
		browser.browserAction.setTitle({title: "Archive to Wayback Machine"});

		browser.contextMenus.removeAll();

		browser.contextMenus.create({
			id: "archive-url-wayback",
			title: archiveCurrentUrlTitle,
			contexts: ["page"]
		})

		browser.contextMenus.create({
			id: "archive-image-url-wayback",
			title: archiveImageUrlTitle,
			contexts: ["image"]
		})

		browser.contextMenus.create({
			id: "archive-link-url-wayback",
			title: archiveLinkUrlTitle,
			contexts: ["link"]
		})
	}
}

browser.contextMenus.onClicked.addListener(function(info, tab) {
	switch (info.menuItemId) {
		case "archive-url-archive":
			archiveUrlArchive(tab.url);
			break;
		case "archive-image-url-archive":
			archiveUrlArchive(info.srcUrl);
			break;
		case "archive-link-url-archive":
			archiveUrlArchive(info.linkUrl);
			break;
		case "archive-url-wayback":
			archiveUrlWayback(tab.url);
			break;
		case "archive-image-url-wayback":
			archiveUrlWayback(info.srcUrl);
			break;
		case "archive-link-url-wayback":
			archiveUrlWayback(info.linkUrl);
			break;
	}
});

// Add listener for toolbar button
browser.browserAction.onClicked.addListener(saveCurrentUrl);

// Add listener for changes to local storage to update the archiver
browser.storage.onChanged.addListener(checkForArchiverChanges);

// Read the archiver name from local storage
browser.storage.local.get("archiver", function(name) {
	if (name.archiver == "undefined") {
		archiver = wayback;
	}
	else {
		archiver = name.archiver;
	}

	updateArchiver();
});
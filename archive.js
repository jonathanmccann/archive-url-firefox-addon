var archiveDomain;
var archiver;

var enabledArchivers = [];

var archiveCurrentUrlTitle = "Archive Current URL";
var archiveCurrentUrlTitleToArchive = "Archive Current URL to archive.";
var archiveCurrentUrlTitleToWayback = "Archive Current URL to Wayback Machine";
var archiveCurrentUrlTitleToBoth = "Archive Current URL to both";

var archiveImageUrlTitle = "Archive Image URL";
var archiveImageUrlTitleToArchive = "Archive Image URL to archive.";
var archiveImageUrlTitleToWayback = "Archive Image URL to Wayback Machine";
var archiveImageUrlTitleToBoth = "Archive Image URL to bothm";

var archiveLinkUrlTitle = "Archive Link URL";
var archiveLinkUrlTitleToArchive = "Archive Link URL to archive.";
var archiveLinkUrlTitleToWayback = "Archive Link URL to Wayback Machine";
var archiveLinkUrlTitleToBoth = "Archive Link URL to both";

function saveCurrentUrl() {
	browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
		if (tabs[0]) {
			if (enabledArchivers[0] == "archive") {
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
		url: "https://archive." + archiveDomain + "/?run=1&url=" + encodeURIComponent(url),
		active: false
	})
}

function archiveUrlWayback(url) {
	browser.tabs.create({
		url: "https://web.archive.org/save/" + url,
		active: false
	})
}

function archiveUrlToBoth(url) {
	archiveUrlArchive(url);
	archiveUrlWayback(url);
}

// Check for changes to 'archiver' and update the local value accordingly as well as the toolbar title
function checkForArchiverChanges(changes, area) {
	if (area == "local") {
		var preferenceChange = false;

		var changedItems = Object.keys(changes);

		for (item of changedItems) {
			if (item == "archiveDomain") {
				archiveDomain = changes[item].newValue;

				preferenceChange = true;
			}
			else if (item == "enabledArchivers") {
				enabledArchivers = JSON.parse(changes[item].newValue);

				preferenceChange = true;
			}
		}

		if (preferenceChange) {
			updateArchiver();
		}
	}
}

function addArchiveContextMenus() {
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

function addBothArchiveContextMenus() {
	browser.contextMenus.create({
		id: "archive-url-both",
		title: archiveCurrentUrlTitleToBoth,
		contexts: ["page"]
	})

	browser.contextMenus.create({
		id: "archive-image-url-both",
		title: archiveImageUrlTitleToBoth,
		contexts: ["image"]
	})

	browser.contextMenus.create({
		id: "archive-link-url-both",
		title: archiveLinkUrlTitleToBoth,
		contexts: ["link"]
	})
}

function addWaybackContextMenus() {
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

function updateArchiver() {
	browser.contextMenus.removeAll();

	if (enabledArchivers.length == 1) {
		browser.browserAction.setPopup({popup: ""});

		browser.browserAction.onClicked.addListener(saveCurrentUrl);

		if (enabledArchivers[0] == "archive") {
			browser.browserAction.setTitle({title: "Archive to archive." + archiveDomain});

			addArchiveContextMenus();
		}
		else {
			browser.browserAction.setTitle({title: "Archive to Wayback Machine"});

			addWaybackContextMenus();
		}
	}
	else {
		browser.browserAction.setPopup({popup: "popup/popup.html"});

		browser.browserAction.onClicked.removeListener(saveCurrentUrl);

		browser.browserAction.setTitle({title: "Archive current URL"});

		addArchiveContextMenus();
		addWaybackContextMenus();
		addBothArchiveContextMenus();
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
		case "archive-url-both":
			archiveUrlToBoth(tab.url);
			break;
		case "archive-image-url-both":
			archiveUrlToBoth(info.srcUrl);
			break;
		case "archive-link-url-both":
			archiveUrlToBoth(info.linkUrl);
			break;
	}
});

// Add listener for changes to local storage to update the archiver
browser.storage.onChanged.addListener(checkForArchiverChanges);

// Read the preferences from local storage
browser.storage.local.get("archiverDomain", function(name) {
	archiveDomain = name.archiveDomain;

	if (archiveDomain == undefined) {
		archiveDomain = "today";
	}

	browser.storage.local.get("enabledArchivers", function(name) {
		enabledArchivers = JSON.parse(name);

		updateArchiver();
	});
});
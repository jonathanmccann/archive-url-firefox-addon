var archiveDomain;
var archiver;

var enabledArchivers = [];

var archiveCurrentUrlTitleToArchive = "Archive Current URL to archive.";
var archiveCurrentUrlTitleToGhostArchive = "Archive Current URL to Ghost Archive";
var archiveCurrentUrlTitleToWayback = "Archive Current URL to Wayback Machine";
var archiveCurrentUrlTitleToMultiple = "Archive Current URL to ";

var archiveImageUrlTitleToArchive = "Archive Image URL to archive.";
var archiveImageUrlTitleToGhostArchive = "Archive Image URL to Ghost Archive";
var archiveImageUrlTitleToWayback = "Archive Image URL to Wayback Machine";
var archiveImageUrlTitleToMultiple = "Archive Image URL to ";

var archiveLinkUrlTitleToArchive = "Archive Link URL to archive.";
var archiveLinkUrlTitleToGhostArchive = "Archive Link URL to Ghost Archive";
var archiveLinkUrlTitleToWayback = "Archive Link URL to Wayback Machine";
var archiveLinkUrlTitleToMultiple = "Archive Link URL to ";

function saveCurrentUrl() {
	browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
		if (tabs[0]) {
			if (enabledArchivers[0] == "archive") {
				archiveUrlArchive(tabs[0].url);
			}
			else if (enabledArchivers[0] == "ghostArchive") {
				archiveUrlGhostArchive(tabs[0].url);
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

function archiveUrlGhostArchive(url) {
	browser.tabs.create({
		url: "https://ghostarchive.org/save/" + url,
		active: false
	})
}

function archiveUrlWayback(url) {
	browser.tabs.create({
		url: "https://web.archive.org/save/" + url,
		active: false
	})
}

function archiveUrlToMultiple(url) {
	for (enabledArchiver of enabledArchivers) {
		if (enabledArchiver == "archive") {
			archiveUrlArchive(url);
		}
		else if (enabledArchiver == "ghostArchive") {
			archiveUrlGhostArchive(url);
		}
		else if (enabledArchiver == "wayback") {
			archiveUrlWayback(url);
		}
	}
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
		title: archiveCurrentUrlTitleToArchive + archiveDomain,
		contexts: ["page"]
	})

	browser.contextMenus.create({
		id: "archive-image-url-archive",
		title: archiveImageUrlTitleToArchive + archiveDomain,
		contexts: ["image"]
	})

	browser.contextMenus.create({
		id: "archive-link-url-archive",
		title: archiveLinkUrlTitleToArchive + archiveDomain,
		contexts: ["link"]
	})
}

function addBothArchiveContextMenus() {
	browser.contextMenus.create({
		id: "archive-url-both",
		title: archiveCurrentUrlTitleToMultiple + (enabledArchivers.length == 2 ? "both" : "all"),
		contexts: ["page"]
	})

	browser.contextMenus.create({
		id: "archive-image-url-both",
		title: archiveImageUrlTitleToMultiple + (enabledArchivers.length == 2 ? "both" : "all"),
		contexts: ["image"]
	})

	browser.contextMenus.create({
		id: "archive-link-url-both",
		title: archiveLinkUrlTitleToMultiple + (enabledArchivers.length == 2 ? "both" : "all"),
		contexts: ["link"]
	})
}

function addGhostArchiveContextMenus() {
	browser.contextMenus.create({
		id: "archive-url-ghost-archive",
		title: archiveCurrentUrlTitleToGhostArchive,
		contexts: ["page"]
	})

	browser.contextMenus.create({
		id: "archive-image-url-ghost-archive",
		title: archiveImageUrlTitleToGhostArchive,
		contexts: ["image"]
	})

	browser.contextMenus.create({
		id: "archive-link-url-ghost-archive",
		title: archiveLinkUrlTitleToGhostArchive,
		contexts: ["link"]
	})
}

function addWaybackContextMenus() {
	browser.contextMenus.create({
		id: "archive-url-wayback",
		title: archiveCurrentUrlTitleToWayback,
		contexts: ["page"]
	})

	browser.contextMenus.create({
		id: "archive-image-url-wayback",
		title: archiveImageUrlTitleToWayback,
		contexts: ["image"]
	})

	browser.contextMenus.create({
		id: "archive-link-url-wayback",
		title: archiveLinkUrlTitleToWayback,
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
		else if (enabledArchivers[0] == "ghostArchive") {
			browser.browserAction.setTitle({title: "Archive to Ghost Archive"});

			addGhostArchiveContextMenus();
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

		for (enabledArchiver of enabledArchivers) {
			if (enabledArchiver == "archive") {
				addArchiveContextMenus();
			}
			else if (enabledArchiver == "ghostArchive") {
				addGhostArchiveContextMenus();
			}
			else if (enabledArchiver == "wayback") {
				addWaybackContextMenus();
			}
		}

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
		case "archive-url-ghost-archive":
			archiveUrlGhostArchive(tab.url);
			break;
		case "archive-image-url-ghost-archive":
			archiveUrlGhostArchive(info.srcUrl);
			break;
		case "archive-link-url-ghost-archive":
			archiveUrlGhostArchive(info.linkUrl);
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
			archiveUrlToMultiple(tab.url);
			break;
		case "archive-image-url-both":
			archiveUrlToMultiple(info.srcUrl);
			break;
		case "archive-link-url-both":
			archiveUrlToMultiple(info.linkUrl);
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
		if ((name.enabledArchivers == undefined) || (name.enabledArchivers == "")) {
			enabledArchivers.push("wayback");
		}
		else {
			enabledArchivers = JSON.parse(name.enabledArchivers);
		}

		updateArchiver();
	});
});
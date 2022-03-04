document.addEventListener("click", function(e) {
	if (!e.target.classList.contains("archiver")) {
		return;
	}

	browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
		if (tabs[0]) {
			if (e.target.id == "multiple") {
				browser.extension.getBackgroundPage().archiveUrlToMultiple(tabs[0].url);
			}
			else if (e.target.id == "archive") {
				browser.extension.getBackgroundPage().archiveUrlArchive(tabs[0].url);
			}
			else if (e.target.id == "ghostArchive") {
				browser.extension.getBackgroundPage().archiveUrlGhostArchive(tabs[0].url);
			}
			else if (e.target.id == "wayback") {
				browser.extension.getBackgroundPage().archiveUrlWayback(tabs[0].url);
			}
		}

		window.close();
	});
});

function resetArchiveURL() {
	browser.storage.local.get("archiveDomain").then(name => {
		var archiveDomain = name.archiveDomain;

		if (archiveDomain == undefined) {
			archiveDomain = "today";
		}

		document.getElementById("archive").innerHTML = "Archive to archive." + archiveDomain;
	});

	browser.storage.local.get("enabledArchivers", function(name) {
		if ((name.enabledArchivers == undefined) || (name.enabledArchivers == "")) {
			document.getElementById("wayback").style.display = "block";
		}
		else {
			var count = 0;

			for (var enabledArchiver of JSON.parse(name.enabledArchivers)) {
				document.getElementById(enabledArchiver).style.display = "block";

				count++;
			}

			document.getElementById("multiple").style.display = "block";

			if (count == 2) {
				document.getElementById("multiple").innerHTML = "Archive to both";
			}
			else {
				document.getElementById("multiple").innerHTML = "Archive to all";
			}
		}
	});
}

document.addEventListener("DOMContentLoaded", resetArchiveURL);
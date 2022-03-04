document.addEventListener("click", function(e) {
	if (!e.target.classList.contains("archiver")) {
		return;
	}

	browser.storage.local.get("archiveDomain").then(name => {
		browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
			if (tabs[0]) {
				if ((e.target.id == "archive") || (e.target.id == "multiple")) {
					var archiveDomain = name.archiveDomain;

					if (archiveDomain == undefined) {
						archiveDomain = "today";
					}

					browser.tabs.create({
						url: "https://archive." + archiveDomain + "/?run=1&url=" + encodeURIComponent(tabs[0].url),
						active: false
					})
				}

				if ((e.target.id == "ghostArchive") || (e.target.id == "multiple")) {
					browser.tabs.create({
						url: "https://ghostarchive.org/save/" + tabs[0].url,
						active: false
					})
				}

				if ((e.target.id == "wayback") || (e.target.id == "multiple")) {
					browser.tabs.create({
						url: "https://web.archive.org/save/" + tabs[0].url,
						active: false
					})
				}
			}

			window.close();
		});
	});
});

function resetArchiveURL() {
	console.log("Hit reset")
	browser.storage.local.get("archiveDomain").then(name => {
		var archiveDomain = name.archiveDomain;

		if (archiveDomain == undefined) {
			archiveDomain = "today";
		}

		document.getElementById("archive").innerHTML = "Archive to archive." + archiveDomain;
	});

	browser.storage.local.get("enabledArchivers", function(enabledArchivers) {
		if ((enabledArchivers.enabledArchivers == undefined) || (enabledArchivers.enabledArchivers == "")) {
			document.getElementById("wayback").style.display = "block";
		}
		else {
			var count = 0;

			for (var enabledArchiver of JSON.parse(enabledArchivers.enabledArchivers)) {
				console.log("Displaying " + enabledArchiver);
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
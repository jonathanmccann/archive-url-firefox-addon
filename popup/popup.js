document.addEventListener("click", function(e) {
	var archiveDomain;

	if (!e.target.classList.contains("archiver")) {
		return;
	}

	browser.storage.local.get("archiveDomain").then(name => {
		if ((name.archiveDomain == undefined)) {
			archiveDomain = "today";
		}
		else {
			archiveDomain = name.archiveDomain;
		}

		browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
			if (tabs[0]) {
				if ((e.target.id == "archive") || (e.target.id == "both")) {
					browser.tabs.create({
						url: "https://archive." + archiveDomain + "/?run=1&url=" + tabs[0].url,
						active: false
					})
				}

				if ((e.target.id == "wayback") || (e.target.id == "both")) {
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
	browser.storage.local.get("archiveDomain").then(name => {
		var archiveDomain;

		if ((name.archiveDomain == undefined)) {
			console.log("Setting udnefined to today");
			archiveDomain = "today";
		}
		else {
			console.log("Setting udnefined to " + name.archiveDomain);
			archiveDomain = name.archiveDomain;
		}

		document.getElementById("archive").innerHTML = "Save to archive." + archiveDomain;
	});
}

document.addEventListener("DOMContentLoaded", resetArchiveURL);
document.addEventListener("click", function(e) {
	if (!e.target.classList.contains("archiver")) {
		return;
	}

	browser.storage.local.get("archiveDomain").then(name => {
		browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
			if (tabs[0]) {
				if ((e.target.id == "archive") || (e.target.id == "both")) {
					var archiveDomain = name.archiveDomain;

					if (archiveDomain == undefined) {
						archiveDomain = "today";
					}

					browser.tabs.create({
						url: "https://archive." + archiveDomain + "/?run=1&url=" + encodeURIComponent(tabs[0].url),
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
		var archiveDomain = name.archiveDomain;

		if (archiveDomain == undefined) {
			archiveDomain = "today";
		}

		document.getElementById("archive").innerHTML = "Save to archive." + archiveDomain;
	});
}

document.addEventListener("DOMContentLoaded", resetArchiveURL);
document.addEventListener("click", function(e) {
	if (!e.target.classList.contains("archiver")) {
		return;
	}

	browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
		if (tabs[0]) {
			if ((e.target.id == "archive") || (e.target.id == "both")) {
				browser.tabs.create({
					url: "https://archive.is/?run=1&url=" + tabs[0].url,
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
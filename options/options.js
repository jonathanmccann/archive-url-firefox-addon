function saveOptions(e) {
	var archiver;

	var archiveDomain = document.options.archiveDomain.value;

	if ((archiveDomain == undefined) || (archiveDomain == "")) {
		archiveDomain = "today";

		document.getElementById("archiveDomain").value = "today";
	}

	document.getElementById("archiveLabel").innerHTML = "archive." + archiveDomain;

	var enabledArchiverCheckboxes = document.querySelectorAll('input[type=checkbox]:checked');

	var enabledArchivers = [];

	if (enabledArchiverCheckboxes.length == 0) {
		enabledArchivers.push("wayback");
	}
	else {
		for (i = 0; i < enabledArchiverCheckboxes.length; i++) {
			enabledArchivers.push(enabledArchiverCheckboxes[i].id)
		}
	}

	setArchiver(enabledArchivers);

	browser.storage.local.set({
		archiveDomain: archiveDomain,
		enabledArchivers: JSON.stringify(enabledArchivers)
	});

	e.preventDefault();
}

function setArchiveDomain(archiveDomain) {
	if ((archiveDomain == undefined) || (archiveDomain == "")) {
		document.getElementById("archiveDomain").value = "today";
		document.getElementById("archiveLabel").innerHTML = "archive.today";
	}
	else {
		document.getElementById("archiveDomain").value = archiveDomain;
		document.getElementById("archiveLabel").innerHTML = "archive." + archiveDomain;
	}
}

function setArchiver(enabledArchivers) {
	for (i = 0; i < enabledArchivers.length; i++) {
		document.getElementById(enabledArchivers[i]).checked = true;
	}
}

function restoreOptions() {
	browser.storage.local.get("archiveDomain", function(archiveDomain) {
		setArchiveDomain(archiveDomain.archiveDomain);
	});

	browser.storage.local.get("enabledArchivers", function(enabledArchivers) {
		setArchiver(JSON.parse(enabledArchivers.enabledArchivers));
	});
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
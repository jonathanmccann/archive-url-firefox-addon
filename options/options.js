var oneClickSave = document.getElementById("oneClickSave");

function saveOptions(e) {
	var archiver;

	var archiveDomain = document.options.archiveDomain.value;

	if ((archiveDomain == undefined) || (archiveDomain == "")) {
		archiveDomain = "today";

		document.getElementById("archiveDomain").value = "today";
	}

	document.getElementById("archiverLabel").innerHTML = "archive." + archiveDomain;

	var length = document.options.archiver.length;

	for (var i = 0; i < length; i++) {
		if (document.options.archiver[i].checked) {
			archiver = document.options.archiver[i].value;

			break;
		}
	}

	var oneClickSave = document.options.oneClickSave.checked;

	browser.storage.local.set({
		archiveDomain: archiveDomain,
		archiver: archiver,
		oneClickSave: oneClickSave
	});

	e.preventDefault();
}

function setArchiveDomain(archiveDomain) {
	if ((archiveDomain.archiveDomain == undefined) || (archiveDomain.archiveDomain == "")) {
		document.getElementById("archiveDomain").value = "today";
		document.getElementById("archiverLabel").innerHTML = "archive.today";
	}
	else {
		document.getElementById("archiveDomain").value = archiveDomain.archiveDomain;
		document.getElementById("archiverLabel").innerHTML = "archive." + archiveDomain.archiveDomain;
	}
}

function setArchiver(archiver) {
	if ((archiver.archiver == "") || (archiver.archiver == "wayback")) {
		document.getElementById("wayback").checked = true;
	}
	else {
		document.getElementById("archive").checked = true;
	}
}

function setOneClickSave(oneClickSave) {
	if ((oneClickSave == undefined) || (oneClickSave == false)) {
		document.getElementById("oneClickSave").checked = false;
	}
	else {
		document.getElementById("oneClickSave").checked = true;
	}
}

function toggleArchiverOptions() {
	var length = document.options.archiver.length

	for (var i = 0; i < length; i++) {
		document.options.archiver[i].disabled = !oneClickSave.checked;
	}
}

function restoreOptions() {
	browser.storage.local.get("archiveDomain", function(archiveDomain) {
		setArchiveDomain(archiveDomain);
	});

	browser.storage.local.get("archiver", function(archiver) {
		setArchiver(archiver);

		browser.storage.local.get("oneClickSave", function(name) {
			setOneClickSave(name.oneClickSave);

			toggleArchiverOptions();
		});
	});
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);

oneClickSave.addEventListener('change', function (event) {
	toggleArchiverOptions();
});
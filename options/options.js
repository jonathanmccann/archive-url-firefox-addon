var oneClickSave = document.getElementById("oneClickSave");

function saveOptions(e) {
	var archiver;

	var length = document.options.archiver.length

	for (var i = 0; i < length; i++) {
		if (document.options.archiver[i].checked) {
			archiver = document.options.archiver[i].value;

			break;
		}
	}

	var oneClickSave = document.options.oneClickSave.checked;

	browser.storage.local.set({
		archiver: archiver,
		oneClickSave: oneClickSave
	});

	e.preventDefault();
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
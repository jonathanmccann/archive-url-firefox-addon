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

function onGetArchiver(archiver) {
	if ((archiver.archiver == "") || (archiver.archiver == "wayback")) {
		document.getElementById("wayback").checked = true;
	}
	else {
		document.getElementById("archive").checked = true;
	}
}

function onGetOneClickSave(oneClickSave) {
	if ((oneClickSave.oneClickSave == undefined) || (oneClickSave.oneClickSave == false)) {
		document.getElementById("oneClickSave").checked = false;
	}
	else {
		document.getElementById("oneClickSave").checked = true;
	}
}

function onError(error) {
	console.log("Error: ${error}");
}

function restoreOptions() {
	var archiver = browser.storage.local.get("archiver");

	archiver.then(onGetArchiver, onError);

	var oneClickSave = browser.storage.local.get("oneClickSave");

	oneClickSave.then(onGetOneClickSave, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
function saveOptions(e) {
	var archiver;

	var length = document.options.archiver.length

	for (var i = 0; i < length; i++) {
		if (document.options.archiver[i].checked) {
			archiver = document.options.archiver[i].value;

			break;
		}
	}

	browser.storage.local.set({
		archiver: archiver
	});

	e.preventDefault();
}

function onGot(archiver) {
	if ((archiver.archiver == "") || (archiver.archiver == "wayback")) {
		document.getElementById("wayback").checked = true;
	}
	else {
		document.getElementById("archive").checked = true;
	}
}

function onError(error) {
	console.log("Error: ${error}");
}

function restoreOptions() {
	var archiver = browser.storage.local.get("archiver");

	archiver.then(onGot, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
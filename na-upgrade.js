function majorUpgrade(from) {
}

function minorUpgrade(from) {
}

function revUpgrade(from) {
}

function welcome() {
	var notification = webkitNotifications.createNotification(
		'alert.png',
		'Nouvel Amour',
		'Nouvel Amour has been installed');

	notification.show();
}

function upgraded(maj, min, rev) {
	var notice = "Nouvel Amour has been updated to version {0}.{1}.{2}.";
	
	var notification = webkitNotifications.createNotification(
		'alert.png',
		'Nouvel Amour',
		notice.format(maj, min, rev));
	
	notification.show();
}

chrome.runtime.onInstalled.addListener(function(object details) {
	if (details.reason != "update") {
		welcome();
		return;
	}
	var curVersion = chrome.app.getDetails().version.split(".");
	var cmaj = curVersion[0];
	var cmin = curVersion[1];
	var crev = curVersion[2];

	var oldVersion = details.previousVersion.split(".");
	var omaj = oldVersion[0];
	var omin = oldVersion[1];
	var orev = oldVersion[2];
	
	if (omaj < cmaj)
		majorUpgrade(omaj);
	if (omin < cmin)
		minorUpgrade(omin);
	if (orev < crev)
		revUpgrade(orev);

	upgraded(cmaj, cmin, crev);
});

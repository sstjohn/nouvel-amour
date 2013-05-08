function majorUpgrade(from) {
}

function minorUpgrade(from) {
}

function revUpgrade(from) {
}

function welcome(maj, min, rev) {
	var ver = '' + maj + '.' + min + '.' + rev;
	var notice = "v";
        notice += ver;
	notice += " has been installed";
	var notification = webkitNotifications.createNotification(
		'alert.png',
		'Nouvel Amour',
		notice);

	notification.show();
	setTimeout(function() {
		                notification.close();
			      }, 10000);
}

function upgraded(maj, min, rev) {
	var ver = '' + maj + '.' + min + '.' + rev;
	var notice = "has been updated to version ";
	notice += ver + ".";
	
	var notification = webkitNotifications.createNotification(
		'alert.png',
		'Nouvel Amour',
		notice);
	
	notification.show();
	setTimeout(function() {
		                notification.close();
			      }, 10000);
} 

chrome.runtime.onInstalled.addListener(function(details) {
	if (details.reason == "chrome_update")
		return;

	var curVersion = chrome.app.getDetails().version.split(".");
	var cmaj = curVersion[0];
	var cmin = curVersion[1];
	var crev = curVersion[2];
	
	if (details.reason == "install") {
		welcome(cmaj, cmin, crev);
		return;
	} 

	var oldVersion = details.previousVersion.split(".");
	var omaj = oldVersion[0];
	var omin = oldVersion[1];
	var orev = oldVersion[2];
	
	if (omaj != cmaj || omin != cmin)
	{
		if (omaj < cmaj) {
			majorUpgrade(omaj);
			omin = 0;
			orev = 0;
		}
		if (omin < cmin) {
			minorUpgrade(omin);
			orev = 0;
		}
		upgraded(cmaj, cmin, crev);
	}
	if (orev < crev)
		revUpgrade(orev);
});

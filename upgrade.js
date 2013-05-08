function majorUpgrade(from) {
}

function minorUpgrade(from) {
}

function revUpgrade(from) {
}

chrome.runtime.onInstalled.addListener(function(details) {
	if (details.reason != "upgrade")
		return;

	var curVersion = chrome.app.getDetails().version.split(".");
	var cmaj = curVersion[0];
	var cmin = curVersion[1];
	var crev = curVersion[2];
	
	var oldVersion = details.previousVersion.split(".");
	var omaj = oldVersion[0];
	var omin = oldVersion[1];
	var orev = oldVersion[2];
	
	if (omaj < cmaj) {
		majorUpgrade(omaj);
		omin = 0;
		orev = 0;
	}
	if (omin < cmin) {
		minorUpgrade(omin);
		orev = 0;
	}
	if (orev < crev)
		revUpgrade(orev);
});

function upgrade(omaj, omin, orev) {
	if (omaj < 3) {
		chrome.storage.local.get(null, function(data) {
			for (user in data) {
				for (author in data[user]) {
					var new_author_data = {};
					for (item in data[user][author]) {
						var txt = data[user][author][item];
						var hash = md5(txt);
						new_author_data[hash] = "";
					}
					data[user][author] = new_author_data;
				}	
			}
			chrome.storage.local.set(data);
		});
	}
	if (omaj <= 3 && omin < 5) {
		if (localStorage["notify"] || false)
			localStorage["notify_newlove"] = "true";
	}
}

function settings_cleanup() {
	if ("poll_interval" in localStorage) {
		if (localStorage["poll_interval"] < 300)
			localStorage["poll_interval"] = 300;
	}
}

chrome.runtime.onInstalled.addListener(function(details) {
	chrome.management.getAll(function(data) {
		for (idx in data) {
			var ext = data[idx];
			if (ext.name == "GrinnellPlans NewLove") {
				chrome.management.setEnabled(ext.id, false);
				_gaq.push(['_trackEvent', 'oldnewlove', 'disabled']);
			}
		}
	});

	if (details.reason != "update") {
		_gaq.push(['_trackEvent', 'installed', details.reason]);
		return;
	}

	_gaq.push(['_trackEvent','installed','update from '+ details.previousVersion]);

	var oldVersion = details.previousVersion.split(".");
	var omaj = oldVersion[0];
	var omin = oldVersion[1];
	var orev = oldVersion[2];

	upgrade(omaj, omin, orev);	
	settings_cleanup();
});

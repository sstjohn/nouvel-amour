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
}

chrome.runtime.onInstalled.addListener(function(details) {
	if (details.reason != "update")
		return;

	var oldVersion = details.previousVersion.split(".");
	var omaj = oldVersion[0];
	var omin = oldVersion[1];
	var orev = oldVersion[2];

	upgrade(omaj, omin, orev);	
});

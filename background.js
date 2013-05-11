function findNew(old, current) {
	var newLove = {};

	for (author in current) {
		if (!(author in old))
			newLove[author] = current[author];
		else {
			newLove[author] = [];
			for (item in current[author]) {
				var hash = md5(current[author][item]);

				if (!(hash in old[author]) || -1 != old[author][hash].search(/!/))
					newLove[author].push(current[author][item]);
			}
		}
	}

	return newLove;
}

function loveClean(old, current) {
	var clean = {};
	for (author in old) {
		if (!(author in current))
			continue;

		clean[author] = {};
		
		for (item in old[author]) {
			var is_gone = true;
			for (tmp in current[author]) {
				if (md5(current[author][tmp]) == item)
					is_gone = false;
			}
			if (!is_gone)
				clean[author][item] = old[author][item];
		}
	}

	return clean;	
}

function mergeNew(clean, newLove) {
	for (author in newLove) {

		for (item in newLove[author]) {
			if (!(author in clean))
				clean[author] = {};
			var hash = md5(newLove[author][item]);
			if (!(hash in clean[author]))
				clean[author][hash] = ("autodismiss" in localStorage && localStorage["autodismiss"] == "False" ?
							"!" : "");
			else if (!("autodismiss" in localStorage) || localStorage["autodismiss"] == "True")
				clean[author][hash] = clean[author][hash].replace("!","");
		}
	}

	return clean;
}

function love_diff(request, callback) {
				chrome.storage.local.get(request.user, function(data) {
					var old = data[request.user];
					if (old == undefined)
						old = {};
					var newLove = findNew(old, request.love);
					var response = {};
					response["type"] = "love-delta";
					response["love"] = newLove;
					callback(response);
					var clean = loveClean(old, request.love);
					var updated = mergeNew(clean, newLove);
					var toStore = {};
					toStore[request.user] = updated;
					chrome.storage.local.set(toStore);
				});
}

function mark_seen(data, author, love) {
	var hash = md5(love);
	data[author][hash] = data[author][hash].replace("!", "");
	return data;
}

function update_aflist(finger_data) {
	chrome.storage.local.get("*autofinger", function(data) {
		var aflist = data["*autofinger"];
		if (aflist == undefined)
			aflist = {1: {}, 2: {}, 3: {}};
		for (var level = 1; level <= 3; level++) {
			var tmp = {};
			for (idx in finger_data[level]) {
				var name = finger_data[level][idx];
				aflist[level][name] = "N";
				tmp[name] = "";
			}
			var remove_list = [];
			for (idx in aflist[level]) {
				if (!(idx in tmp)) {
					remove_list.push(idx);
				}
			}
			for (idx in remove_list) {
				delete aflist[level][remove_list[idx]];
			}
		}
		chrome.storage.local.set({"*autofinger": aflist});
	});
}

function check_af_fresh(level, name, callback) {
	chrome.storage.local.get("*autofinger", function(data) {
		var aflist = data["*autofinger"];
		if (undefined == aflist) {
			callback(true);
			return;
		}
		if (!(name in aflist[level])) {
			callback(true);
			return;
		}
		callback(aflist[level][name].match(/N/) == null);
	});
	return true;
}

function set_af_notified(level, name) {
	chrome.storage.local.get("*autofinger", function(data) {
		var aflist = data["*autofinger"];
		if (undefined == aflist)
			aflist = {1: {}, 2: {}, 3: {}};
		aflist[level][name] = "N";
		chrome.storage.local.set({"*autofinger": aflist});
	});
	return false;
}
chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			if (request["type"] == "love-diff") {
				love_diff(request, sendResponse);
				return true;
			}
			if (request["type"] == "finger-check")
				return check_af_fresh(request["level"], request["name"], sendResponse);
			if (request["type"] == "finger-seen")
				return set_af_notified(request["level"], request["name"]);
			if (request["type"] == "love-seen") {
				chrome.storage.local.get(request.user, function(data) {
					var hash = md5(request["love"]);

					var flags = data[request.user][request.author][hash];
					flags = flags.replace("!","");

					data[request.user][request.author][hash] = flags;

					chrome.storage.local.set(data);
				});
				return false;
			}
			if (request["type"] == "poll-ctrl") {
				if (request["action"] == "start")
					schedule_poll(poll);
				if (request["action"] == "stop")
					clearTimeout(polling_tid);
				if (request["action"] == "reset") {
					clearTimeout(polling_tid);
					schedule_poll(poll);
				}
				return false;
			}
			if (request["type"] == "autofinger-update")
				update_aflist(request["finger"]);
			return false;
		});


function findNew(old, current) {
	var newLove = {};

	for (author in current) {
		if (!(author in old))
			newLove[author] = current[author];
		else {
			newLove[author] = [];
			for (item in current[author]) {
				var is_old = false;
				var old_txt = old[author][tmp];
				if (old_txt[0] != '\x01')
					old_txt = "\x01" + md5(old_txt);

				for (tmp in old[author]) {
					if (old[author][tmp] == "\x01" + md5(current[author][item]))
						is_old = true;
				}

				if (!is_old)
					newLove[author].push(current[author][item]);
			}
		}
	}

	return newLove;
}

function loveClean(old, current) {
	var cleanLove = {};
	for (author in old) {
		if (!(author in current))
			continue;

		cleanLove[author] = [];
		
		for (item in old[author]) {
			var is_gone = true;
			var old_txt = old[author][item];
			if (old_txt[0] != '\x01')
				old_txt = "\x01" + md5(old_txt);

			for (tmp in current[author]) {
				var cur_txt = current[author][tmp];
			
				if (cur_txt[0] != '\x01')
					cur_txt = "\x01" + md5(cur_txt);
				
				if (cur_txt == old_txt)
					is_gone = false;
			}
			if (!is_gone)
				cleanLove[author].push(cur_txt);
		}
	}

	return cleanLove;	
}

function mergeNew(clean, newLove) {
	for (author in newLove) {

		for (item in newLove[author]) {
			if (!(author in clean))
				clean[author] = [];
			clean[author].push("\x01" + md5(newLove[author][item]));
		}
	}

	return clean;
}

chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			chrome.storage.sync.get(request.user, function(data) {
				var old = data[request.user];
				if (old == undefined)
					old = {};
				var newLove = findNew(old, request.love);
				var response = {};
				response["type"] = "love-delta";
				response["love"] = newLove;
				sendResponse(response);
				var clean = loveClean(old, request.love);
				var updated = mergeNew(clean, newLove);
				var toStore = {};
				toStore[request.user] = updated;
				chrome.storage.sync.set(toStore);
			});
			return true;
		});

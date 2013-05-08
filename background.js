
function findNew(old, current) {
	var newLove = {};

	for (author in current) {
		if (!(author in old))
			newLove[author] = current[author];
		else {
			newLove[author] = [];
			for (item in current[author]) {
				var is_old = false;

				for (tmp in old[author]) {
					if (old[author][tmp] == current[author][item])
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
			for (tmp in current[author]) {
				if (current[author][tmp] == old[author][item])
					is_gone = false;
			}
			if (!is_gone)
				cleanLove[author].push(current[author][item]);
		}
	}

	return cleanLove;	
}

function mergeNew(clean, newLove) {
	for (author in newLove) {

		for (item in newLove[author]) {
			if (!(author in clean))
				clean[author] = [];
			clean[author].push(newLove[author][item]);
		}
	}

	return clean;
}

chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			if (request["type"] == "love-diff") {
				chrome.storage.local.get(request.user, function(data) {
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
					chrome.storage.local.set(toStore);
				});
				return true;
			}
			return false;
		});

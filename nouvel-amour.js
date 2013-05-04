function getAuthor(node) {
var links = node.getElementsByTagName('a');
return links[0].textContent;
}

function getCurrentUsername() {
	var urly = window.location.href;
	var startIndex = urly.indexOf("mysearch=") + 9;
	var endIndex = urly.indexOf("&", startIndex);
	return urly.substring(startIndex, endIndex);
}

var loves = document.evaluate(
        '//ul[@id="search_results"]/li//ul/li',
        document,
        null,
        XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
        null);

var currentLove = {};

var thisLoveNode;
while ( thisLoveNode = loves.iterateNext() ) {
    var author = getAuthor(thisLoveNode.parentNode.parentNode);

    thisLoveText = thisLoveNode.textContent;

    if (!currentLove[author])
	    currentLove[author] = [];

    currentLove[author].push(thisLoveText);
}

var message = {};
message["user"] = getCurrentUsername();
message["love"] = currentLove;
message["type"] = "love-diff";

function cleanDisplay(newLove) {
	var loves = document.evaluate(
        	'//ul[@id="search_results"]/li//ul/li',
        	document,
        	null,
        	XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
        	null);

	var tmp;
	var toRemove = [];
	while (tmp = loves.iterateNext()) {
		var author = getAuthor(tmp.parentNode.parentNode);
		var txt = tmp.textContent;

		var is_new = false;
		if (author in newLove) {
			for (item in newLove[author]) {
				if (txt == newLove[author][item])
					is_new = true;
			}
		}
		
		if (!is_new)
			toRemove.push(tmp);
	}

	toRemove.forEach(function(n) { n.parentNode.removeChild(n); });
}

var bgResponse;
chrome.runtime.sendMessage(message, function(response) {
	if (response["type"] != "love-delta")
		console.log("unknown response received: " + response);
	else {
		cleanDisplay(response["love"]);
	}
});



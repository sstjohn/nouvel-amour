function getCurrentUsername() {
	var urly = window.location.href;
	var startIndex = urly.indexOf("mysearch=") + 9;
	var endIndex = urly.indexOf("&", startIndex);
	return urly.substring(startIndex, endIndex);
}


var loveList = $("#search_results > li");

var currentLove = {};

loveList.each( function(index, tmp) {
	var author = $(this).find("a.planlove").text();

	currentLove[author] = [];

	$(this).find("ul > li").each(function(index, tmp) {
		var txt = $(this).children("span").text();
    		currentLove[author].push(txt);
	});
});

var message = {};
message["user"] = getCurrentUsername();
message["love"] = currentLove;
message["type"] = "love-diff";

function cleanDisplay(newLove) {
        loveList.each(
		function(index, tmp) {
			var author = $(this).find("a.planlove").text();

			$(this).find("ul > li").each(
				function (index, tmp) {
					var txt = $(this).children("span").text();

					var is_new = false;
					if (author in newLove) {
						for (item in newLove[author]) {
							if (txt == newLove[author][item])
								is_new = true;
						}
					}
		
					if (!is_new)
						$(this).hide();
				});
		});
}

var bgResponse;
chrome.runtime.sendMessage(message, function(response) {
	if (response["type"] != "love-delta")
		console.log("unknown response received: " + response);
	else {
		cleanDisplay(response["love"]);
	}
});



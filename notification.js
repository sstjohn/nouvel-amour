function poll() {
	$.ajax({"url": "http://grinnellplans.com/quicklove.php",
		"dataType": "html",
		"success": function(data, text_status, jq) {
			var $doc = $(data);
			var user = $doc.find("#mysearch").attr("value");
			var love_list = $doc.find("#search_results > li");

			/*
			love_list.each(function(index, tmp) {
				var author = $(this).find("a.planlove").text();
				msg["love"][author] = [];

				$(this).find("ul > li").each(function(index, tmp) {
					msg["love"][author].push($(this).children("span").text());
				});
			});
			*/

			var af1 = $doc.find(".autoreadlevel.first .planlove");
			var af2 = $doc.find(".autoreadlevel.odd .planlove");
			var af3 = $doc.find(".autoreadlevel.last .planlove");
		}});
}


setTimeout(function() {
	//alert("this is a test!");
}, 1000);

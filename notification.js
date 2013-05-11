function poll() {
	var resp = $.get("http://grinnellplans.com/quicklove.php");
	var ql_doc = $(resp.responseText);
	var love_list = ql_doc("#search_results > li");

	var user = ql_doc("#mysearch").val();

	love_list.each(function(index, tmp) {
		var author = $(this).find("a.planlove").text();
		msg["love"][author] = [];

		$(this).find("ul > li").each(function(index, tmp) {
			msg["love"][author].push($(this).children("span").text());
		});
	});



setTimeout(function() {
	//alert("this is a test!");
}, 1000);

function get_username() {
	var link = $("#poweredby div span a:contains('bug report')").attr('href');
	var tmp = link.replace(/^.*5B/, "");
	return tmp.replace(/%5D.*$/, "");
}

$(document).ready(function() {
	var finger_list = {1: [], 2: [], 3: []};
	$(".autoreadlevel.first .planlove").each(function(idx, tmp) {
		 finger_list[1].push($(this).text());
	});

	$(".autoreadlevel.odd .planlove").each(function(idx, tmp) {
		finger_list[2].push($(this).text());
	});
	
	$(".autoreadlevel.last .planlove").each(function(idx, tmp) {
		finger_list[3].push($(this).text());
	});
	
	var message = {};
	message["type"] = "autofinger-update";
	message["user"] = get_username();
	message["finger"] = finger_list;
	chrome.runtime.sendMessage(message);
});

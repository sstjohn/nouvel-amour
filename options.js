function clear_storage() {
	chrome.storage.local.clear();

	$("#status").html("Settings cleared.");
	setTimeout(function() {
		$("#status").html("");
	}, 1000);
}

$(document).ready(function() {
	$("#clear").click(clear_storage);
});

function clear_storage() {
	chrome.storage.local.clear();

	$("#status").html("Settings cleared.");
	setTimeout(function() {
		$("#status").html("");
	}, 1000);
}

function autodismiss_set() {
	localStorage["autodismiss"] = $("#autodismiss option:selected").val();
}

$(document).ready(function() {
	$("#clear").click(clear_storage);
	if ("autodismiss" in localStorage)
		$("#autodismiss").val(localStorage["autodismiss"]);
	$("#autodismiss").change(autodismiss_set);
});

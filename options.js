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

function notification_toggle() {
	$("#notification_settings").slideToggle();

	var message = {};
	message["type"] = "poll-ctrl";

	if ("true" == localStorage["notify"] || false) {
		localStorage["notify"] = "false";
		message["action"] = "stop";
	}
	else {
		localStorage["notify"] = "true";
		message["action"] = "start";
	}
	chrome.runtime.sendMessage(message);
}

$(document).ready(function() {
	$("#clear").click(clear_storage);
	if ("autodismiss" in localStorage)
		$("#autodismiss").val(localStorage["autodismiss"]);
	$("#autodismiss").change(autodismiss_set);
	if ("true" == localStorage["notify"] || false) {
		$("#notification_settings").show();
		$("#notify").prop('checked', true);
	}
	$("#notify").change(notification_toggle);
	$("#poll_interval").val(localStorage["poll_interval"] || 30);
	$("#poll_interval").change(function() { localStorage["poll_interval"] = $(this).val(); 
						chrome.runtime.sendMessage({"type": "poll-ctrl",
									    "action": "reset"});});

	if ("true" == localStorage["use_ssl"] || false)
		$("#use_ssl").prop('checked', true);

	$("#use_ssl").change(function() {localStorage["use_ssl"] = $(this).is(':checked');});

	if ("true" == localStorage["notify_newlove"] || false)
		$("#notify_newlove").prop('checked', true);

	$("#notify_newlove").change(function() {localStorage["notify_newlove"] = $(this).is(':checked');});

	if ("true" == localStorage["notify_af1"] || false)
		$("#af1").prop('checked', true);
	if ("true" == localStorage["notify_af2"] || false)
		$("#af2").prop('checked', true);
	if ("true" == localStorage["notify_af3"] || false)
		$("#af3").prop('checked', true);

	$("#af1").change(function() {localStorage["notify_af1"] = $(this).is(':checked');});
	$("#af2").change(function() {localStorage["notify_af2"] = $(this).is(':checked');});
	$("#af3").change(function() {localStorage["notify_af3"] = $(this).is(':checked');});
});

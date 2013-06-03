var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-40740194-1']);
_gaq.push(['_trackPageview']);

(function() {
	  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	    ga.src = 'https://ssl.google-analytics.com/ga.js';
	      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

function clear_storage() {
	_gaq.push(['_trackEvent', 'clear', 'clicked']);
	chrome.storage.local.clear();

	$("#status").html("Settings cleared.");
	setTimeout(function() {
		$("#status").html("");
	}, 1000);
}

function autodismiss_set() {
	localStorage["autodismiss"] = $("#autodismiss option:selected").val();
	_gaq.push(['_trackEvent', 'autodismiss', localStorage["autodismiss"]]);
}

function notification_toggle() {
	$("#notification_settings").slideToggle();

	var message = {};
	message["type"] = "poll-ctrl";

	if ("true" == localStorage["notify"] || false) {
		localStorage["notify"] = "false";
		message["action"] = "stop";
		_gaq.push(['_trackEvent', 'notify', 'disabled']);
	}
	else {
		localStorage["notify"] = "true";
		message["action"] = "start";
		_gaq.push(['_trackEvent', 'notify', 'enabled']);
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
	$("#poll_interval").val(localStorage["poll_interval"] || 1800);
	$("#poll_interval").change(function() { 
		if ($(this).val() < 300) {
			$("#status").html("Minimum allowed polling interval is 5 minutes (300 seconds).");
		        setTimeout(function() {
                		$("#status").html("");
		        }, 5000);
			if ("poll_interval" in localStorage) {
				if (localStorage["poll_interval"] >= 300) {
					$(this).val(localStorage["poll_interval"]);
					return;
				}
			}
			localStorage["poll_interval"] = 300;
			$(this).val(300);
		} else {
			localStorage["poll_interval"] = $(this).val(); 
			chrome.runtime.sendMessage({"type": "poll-ctrl",
					    "action": "reset"});
		}
	});

	if ("true" == localStorage["use_ssl"] || false)
		$("#use_ssl").prop('checked', true);

	$("#use_ssl").change(function() {
		localStorage["use_ssl"] = $(this).is(':checked');
		_gaq.push(['_trackEvent', 'use_ssl', localStorage["use_ssl"]]);
	});

	if ("true" == localStorage["notify_newlove"] || false)
		$("#notify_newlove").prop('checked', true);

	$("#notify_newlove").change(function() {
		localStorage["notify_newlove"] = $(this).is(':checked');
		_gaq.push(['_trackEvent', 'notify_newlove', localStorage["notify_newlove"]]);
	});
	
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

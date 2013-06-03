var pending_notifications = {1: {}, 2: {}, 3: {}};

function af_alert(level, name) {
	if (name in pending_notifications[level])
		return;

	if (localStorage["notify_af" + level] == "true" || false) {
		check_af_fresh(level, name, function(data) {
			if (data) {
				pending_notifications[level][name] = "";

				var notification = webkitNotifications.createNotification(
				  	'alert.png',
				  	'autofinger level ' + level,
				  	name);

				notification.onclose = function() {
					_gaq.push(['_trackEvent', 'notification', 'closed']);
					chrome.runtime.sendMessage(
						{"type": "finger-seen",
						 "level": level,
						 "name": name});
					delete pending_notifications[level][name];
				};

				notification.onclick = function() {
					_gaq.push(['_trackEvent', 'notification', 'clicked']);
					chrome.tabs.create({"url": (localStorage["use_ssl"] == "true" || false ? "https" : "http")
								   + "://grinnellplans.com/read.php?searchname="
								   + name}, function(tab) {
									   chrome.windows.update(tab.windowId,
										   		{"focused": true});
								   });
					notification.close();
				};
				
				 _gaq.push(['_trackEvent', 'notification', 'shown']);
				notification.show();
			}
		});
	}
}

var polling_tid = null;

function schedule_poll(poller) {
	var timeout = "poll_interval" in localStorage ?
			localStorage["poll_interval"] * 1000 :
			30000;
	polling_tid = setTimeout(poller, timeout);
}

function poll() {
	if (localStorage["notify"] != "true")
		return;

	$.ajax({"url": (localStorage["use_ssl"] == "true" || false ? "https" : "http") 
			+ "://grinnellplans.com/quicklove.php",
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

			$doc.find(".autoreadlevel.first .planlove").each(function(idx, tmp) {
				af_alert(1, $(this).text());
			});

			$doc.find(".autoreadlevel.odd .planlove").each(function(idx, tmp) {
				af_alert(2, $(this).text());
			});

			$doc.find(".autoreadlevel.last .planlove").each(function(idx, tmp) {
				af_alert(3, $(this).text());
			});

		}});

	schedule_poll(poll);
}

if (localStorage["notify"] == "true" || false)
	schedule_poll(poll);

var pending_notifications = {1: {}, 2: {}, 3: {}};

function love_alert(item) {
	if (localStorage["notify_newlove"] == "true" || false) {
		var notification = webkitNotifications.createNotification(
			'love.png',
			'newlove from ' + item["author"],
			item["content"]);

		notification.onclick = function() {
			_gaq.push(['_trackEvent', 'lnotification', 'clicked']);
			chrome.tabs.create({"url": (localStorage["use_ssl"] == "true" || false ? "https" : "http")
						   + "://grinnellplans.com/read.php?searchname="
						   + item["author"]}, function(tab) {
								chrome.windows.update(tab.windowId,
										{"focused": true});
								});
			notification.close();
		};

		notification.onclose = function() {
			_gaq.push(['_trackEvent','lnotification','closed']);
		};

		_gaq.push(['_trackEvent','lnotification','shown']);
		notification.show();
	}
}

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
			600000;
	polling_tid = setTimeout(poller, timeout);
}

function poll() {
	_gaq.push(['_trackEvent', 'notification', 'polled']);
	if (localStorage["notify"] != "true")
		return;

	$.ajax({"url": (localStorage["use_ssl"] == "true" || false ? "https" : "http") 
			+ "://grinnellplans.com/quicklove.php",
		"dataType": "html",
		"success": function(data, text_status, jq) {
			var $doc = $(data);
			var user = $doc.find("#mysearch").attr("value");
			var love_list = $doc.find("#search_results > li");
			var msgs = [];

			love_list.each(function(index, tmp) {
				var author = $(this).find("a.planlove").text();
				msgs[author] = [];

				$(this).find("ul > li").each(function(index, tmp) {
					msgs[author].push($(this).children("span").text());
				});
			});

			$doc.find(".autoreadlevel.first .planlove").each(function(idx, tmp) {
				af_alert(1, $(this).text());
			});

			$doc.find(".autoreadlevel.odd .planlove").each(function(idx, tmp) {
				af_alert(2, $(this).text());
			});

			$doc.find(".autoreadlevel.last .planlove").each(function(idx, tmp) {
				af_alert(3, $(this).text());
			});
			
			var notify_of = [];

			chrome.storage.local.get(user, function(data) {
                                        var old = data[user];
                                        if (old == undefined)
                                                old = {};
					for (author in msgs) {
						for (msg in msgs[author]) {
							var found = false;
							var msg_hash = md5(msgs[author][msg]);
							if (author in old) {
								for (olove in old[author]) {
									if (olove == msg_hash)
										found = true;
								}
							}
							if (!found)
								notify_of.push({"author": author, "content": msgs[author][msg]});
						}
					}
					for (idx in notify_of) {
						var item = notify_of[idx];
						love_alert(item);
						if (!(item["author"] in old))
							old[item["author"]] = {};
						old[item["author"]][md5(item["content"])] = "!";
					}
					data[user] = old;
					chrome.storage.local.set(data);
                                });
		}});

	schedule_poll(poll);
}

if (localStorage["notify"] == "true" || false)
	schedule_poll(poll);

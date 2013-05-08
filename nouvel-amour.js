function getCurrentUsername() {
	var urly = window.location.href;
	var startIndex = urly.indexOf("mysearch=") + 9;
	var endIndex = urly.indexOf("&", startIndex);
	return urly.substring(startIndex, endIndex);
}

var love_list = $("#search_results > li");

function each_love(state) {
	love_list.each( function(index, tmp) {
		var author = $(this).find("a.planlove").text();

		state.author_set(author);

		$(this).find("ul > li").each(function(index, tmp) {
			state.love_process(this);
		});
	});
	return state;
}

function love_collector() {
	var state = 
		{author_set: function(a) {
			this.author = a;
			this.current_love[a] = [];
				     },
		 love_process: function(l) {
			var txt = $(l).children("span").text();
    			this.current_love[this.author].push(txt);
				   },
		 current_love: []
		};
	return state;
}

var message = {};
message["user"] = getCurrentUsername();
message["love"] = each_love(love_collector()).current_love;
message["type"] = "love-diff";

function expandomatic(author) {
	var state = 	{author_set: function(a) {
				if (author == a) {
					this.love_process = this.this_is_it;
					var btn = $("#expand_" + a);
					if (btn.text() == "+")
						btn.text("-");
					else
						btn.text("+");
				}
				else
					this.love_process = this.this_is_not_it;
						   },
			this_is_it: function(l) {
				$(l).slideToggle();
				                },
			this_is_not_it: function(l) {}};
	return function() { each_love(state); };
}

function display_cleaner(new_love) {
	return
		{author_set: function(a) {
			this.author = a;
			this.collapsable = false;
					 },
		 love_process: function(l) {
			var txt = $(l).children("span").text();

			var is_new = false;
			if (this.author in new_love) {
				for (item in new_love[this.author]) {
					if (txt == new_love[this.author][item])
						is_new = true;
				}
			}
		
			if (!is_new) {
				if (!this.collapsable) {
					var expander = $("<button>+</button>");
					expander.attr("class", "submitinput");
					expander.attr("id", "expand_" + this.author);
					expander.css("float", "none");
					expander.css("margin-left", "0.5em");
					expander.click(expandomatic(this.author));
					var par = $(l).parent().parent();
					var detached = par.children("a").detach();
					var new_div = $("<div/>");
					new_div.append(detached);
					detached = par.children("span").detach();
					detached.css("margin-left", "0.4em");
					new_div.append(detached);
					new_div.append(expander);
					par.children("ul").before(new_div);
					this.collapsable = true;
				}
				$(l).hide();
			}
					 }
		};
}

var bgResponse;
chrome.runtime.sendMessage(message, function(response) {
	if (response["type"] != "love-delta")
		console.log("unknown response received: " + response);
	else {
		each_love(display_cleaner(response["love"]));
	}
});



function each_love_gen(love_list) {
	var closure = function(state) {
		love_list.each( function(index, tmp) {
			var author = $(this).find("a.planlove").text();

			state.author_set(author, this);

			$(this).find("ul > li").each(function(index, tmp) {
				state.love_process(this);
			});
		});
		return state;
	};

	return closure;
}
function getCurrentUsername() {
	var urly = window.location.href;
	var startIndex = urly.indexOf("mysearch=") + 9;
	var endIndex = urly.indexOf("&", startIndex);
	return urly.substring(startIndex, endIndex);
}
function love_collector() {
	var state = 
		{author_set: function(a, e) {
			this.author = a;
			this.current_love[a] = [];
				     },
		 love_process: function(l) {
			var txt = $(l).children("span").text();
			this.current_love[this.author].push(txt);
				   },
		 current_love: {}
		};
	return state;
}


$(document).ready(function() {
	var love_list = $("#search_results > li");
	var each_love = each_love_gen(love_list);

	var message = {};
	message["user"] = getCurrentUsername();
	message["love"] = each_love(love_collector()).current_love;
	message["type"] = "love-diff";

	function expandomatic(author) {
		var state = 	{author_set: function(a, e) {
					if (author == a) {
						this.love_process = this.this_is_it;
						var btn = $("#expand_" + a);
						if (btn.text() == "+")
							btn.text("-");
						else if (btn.text() == "-")
							btn.text("+");
					}
					else
						this.love_process = this.this_is_not_it;
							   },
				this_is_it: function(l) {
					if (!$(l).data("is_new"))
						$(l).slideToggle();
							},
				this_is_not_it: function(l) {}};
		return function() { each_love(state); };
	}

	function display_cleaner(new_love) {
		var state = 
			{author_set: function(a, e) {
				this.author = a;
				this.button_plus = false;
				
				var new_div = $("<div/>");

				var expander = $("<button>!</button>");
				expander.attr("class", "submitinput");
				expander.attr("id", "expand_" + this.author);
				expander.css("float", "none");
				expander.css("margin-right", "0.5em");
				expander.css("font-family", "monospace");
				expander.click(expandomatic(this.author));
				new_div.append(expander);
				
				
				var detached = $(e).find("div > a.planlove").detach();
				new_div.append(detached);
				
				detached = $(e).find("div > span").detach();
				detached.css("margin-left", "0.4em");
				new_div.append(detached);

				$(e).find("div > ul").before(new_div);
						 },
			 love_process: function(l) {
				var txt = $(l).children("span").text();

				$(l).data("is_new", false);
				if (this.author in new_love) {
					for (item in new_love[this.author]) {
						if (txt == new_love[this.author][item])
							$(l).data("is_new", true);
					}
				}
			
				if (!$(l).data("is_new")) {
					$(l).hide();
					if (!this.button_false) {
						$("#expand_" + this.author).text("+");
						this.button_plus = true;
					}
				}
						 }
			};
		return state;
	}

	chrome.runtime.sendMessage(message, function(response) {
		if (response["type"] != "love-delta")
			console.log("unknown response received: " + response);
		else {
			each_love(display_cleaner(response["love"]));
		}
		$("#search_results").css("visibility", "visible");
	});
});

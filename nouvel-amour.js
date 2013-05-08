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
				if (author == a)
					this.love_process = this.this_is_it;
				else
					this.love_process = this.this_is_not_it;
						   },
			this_is_it: function(l) {
				$(l).toggle();
				                },
			this_is_not_it: function(l) {}};
	return function() { each_love(state); };
}

function display_cleaner(new_love) {
	var state = 
		{author_set: function(a) {
			this.author = a;
			this.collapsed = false;
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
				if (!this.collapsed) {
					var expander = $("<button>+</button>");
					expander.attr("class", "submitinput");
					expander.css("float", "right");
					expander.css("margin-left", "10px");
					var par = $(l).parent().parent();
					par.css("display", "inline-block");
					par.children("span").after(expander);
					expander.click(expandomatic(this.author));
					this.collapsed = true;
				}
				$(l).hide();
			}
					 }
		};
	return state;
}

var bgResponse;
chrome.runtime.sendMessage(message, function(response) {
	if (response["type"] != "love-delta")
		console.log("unknown response received: " + response);
	else {
		each_love(display_cleaner(response["love"]));
	}
});



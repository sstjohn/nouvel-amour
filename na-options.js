function save_options() {
	//var select = document.getElementById("color");
	//var color = select.children[select.selectedIndex].value;
	//localStorage["favorite_color"] = color;

	var status = document.getElementById("status");
	status.innerHTML = "Options Saved.";
	setTimeout(function() {
		status.innerHTML = "";
	}, 750);
}
/*
function restore_options() {
	var favorite = localStorage["favorite_color"];
	if (!favorite) {
		return;
	}
	var select = document.getElementById("color");
   	for (var i = 0; i < select.children.length; i++) {
		var child = select.children[i];
		if (child.value == favorite) {
			child.selected = "true";
			break;
		}
	}
}
*/

function clear_storage() {
	chrome.storage.local.clear();

	$("#status").html("Settings cleared.");
}

$(document).ready(function() {
	//document.addEventListener('DOMContentLoaded', restore_options);
	document.querySelector('#save').addEventListener('click', save_options);
	$("#clear").click(clear_storage);
});

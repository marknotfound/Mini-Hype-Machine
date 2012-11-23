var bg = chrome.extension.getBackgroundPage();
var tabId = bg.tabid;
var favState = bg.favState;
var playState = bg.playState;
var haveTab = bg.haveTab;
var banner;
var artist;
var track;
var postURL;
var next;
var prev;
var pp;
var fav;
var banner;
var trackDiv;
var contentDiv;

window.onload = function () {

	// Update all controls.
	chrome.tabs.sendMessage(tabId, {todo: "update"}, function(response) {
		pp.className = bg.playState;
		fav.className = bg.favState;
		trackDiv.innerHTML = bg.currentTrack;
		contentDiv.innerHTML = bg.currentBlurb;
	});

	next = document.getElementById('goNext');
	prev = document.getElementById('goPrev');
	pp = document.getElementById('goPlay');
	fav = document.getElementById('goFav');
	trackDiv = document.getElementById('track');
	contentDiv = document.getElementById('content');

	// Bind functions to click events
	next.onclick = nextSong;
	prev.onclick = prevSong;
	pp.onclick = pausePlay;
	fav.onclick = favorite;
	
}
function nextSong() {
	if(haveTab) {
	  chrome.tabs.sendMessage(tabId, {todo: "next"}, function(response) {
	  		fav.className = bg.favState;
		  	pp.className = bg.playState;
	  });
	}
}
function prevSong() {
	if(haveTab) {
	  chrome.tabs.sendMessage(tabId, {todo: "prev"}, function(response) {
	  		fav.className = bg.favState;
	  		pp.className = bg.playState;
	  });
	}
}
function pausePlay() {
	if(haveTab) {
		chrome.tabs.sendMessage(tabId, {todo: "pp"}, function(response) {
			pp.className = bg.playState;
		});
	}
}
function favorite() {
	if(haveTab) {
	  	chrome.tabs.sendMessage(tabId, {todo: "fav"}, function(response) {
	  		fav.className = bg.favState;
	  	});
	}
}
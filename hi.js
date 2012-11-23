var bg = chrome.extension.getBackgroundPage();
var tabId = bg.tabid;
var favState = bg.favState;
var playState = bg.playState;
var haveTab = bg.haveTab;
var banner;
var artist;
var track;
var postURL;
var songStr = bg.currentTrack;

var nowPlayingHTML;
var nPArr = new Array();
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
		// Set up the UI buttons
		pp.className = bg.playState;
		fav.className = bg.favState;
		trackDiv.innerHTML = songStr;
		contentDiv.innerHTML = bg.currentBlurb;
	});

	console.log('Current playState from bg: '+bg.favState);
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
	  chrome.tabs.sendMessage(tabId, {todo: "next"});
		  	fav.className = bg.favState;
		  	pp.className = bg.playState;
	}
}
function prevSong() {
	if(haveTab) {
	  chrome.tabs.sendMessage(tabId, {todo: "prev"});
	  		pp.className = bg.playState;
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
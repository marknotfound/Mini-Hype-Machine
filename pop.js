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
	// Some setup stuff...
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

	// Set up the buttons
	// Update all controls.
	if(haveTab) {
		chrome.tabs.sendMessage(tabId, {todo: "update"}, function(response) {
			pp.className = bg.playState;
			fav.className = bg.favState;
			trackDiv.innerHTML = bg.currentTrack;
			contentDiv.innerHTML = bg.currentBlurb;
		});
	} else {
		// Just set stuff to the background page values and don't try to send a message.
		pp.className = bg.playState;
		fav.className = bg.favState;
		trackDiv.innerHTML = bg.currentTrack;
		contentDiv.innerHTML = bg.currentBlurb;
	}
	// Done setting up buttons!
	
}
function nextSong() {
	if(haveTab) {
	  chrome.tabs.sendMessage(tabId, {todo: "next"}, function(response) {
	  		fav.className = bg.favState;
		  	pp.className = bg.playState;
		  	trackDiv.innerHTML = bg.currentTrack;
		  	contentDiv.innerHTML = bg.currentBlurb;
	  });
	}
}
function prevSong() {
	if(haveTab) {
	  chrome.tabs.sendMessage(tabId, {todo: "prev"}, function(response) {
	  		fav.className = bg.favState;
	  		pp.className = bg.playState;
	  		trackDiv.innerHTML = bg.currentTrack;
		  	contentDiv.innerHTML = bg.currentBlurb;
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
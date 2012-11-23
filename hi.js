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
var songBlurb = bg.currentBlurb;
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
	next = document.getElementById('goNext');
	prev = document.getElementById('goPrev');
	pp = document.getElementById('goPlay');
	fav = document.getElementById('goFav');
	trackDiv = document.getElementById('track');
	contentDiv = document.getElementById('content');

	next.onclick = nextSong;
	prev.onclick = prevSong;
	pp.onclick = pausePlay;
	fav.onclick = favorite;

	// Set up UI
	setTimeout(function() {
		pp.className = playState;
		fav.className = favState;
		trackDiv.innerHTML = songStr;
		contentDiv.innerHTML = songBlurb;
	}, 250);
	
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
		chrome.tabs.sendMessage(tabId, {todo: "pp"});
			pp.className = bg.playState;
			console.log("New playState: "+pp.className);
	}
}
function favorite() {
	if(haveTab) {
	  	chrome.tabs.sendMessage(tabId, {todo: "fav"});
	  		fav.className = bg.favState;
	}
}
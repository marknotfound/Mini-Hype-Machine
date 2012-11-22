// CACHE SONGID IN GETTAB.JS AND COMPARE EACH NEW SONG TO IT TO SEE IF YOU NEED TO PLACE THE CACHED SONG BLURB INFO OR NOT

var bg = chrome.extension.getBackgroundPage();
var tabId = bg.tabid;
var favState = bg.favState;
var playState = bg.playState;
var banner;
var artist;
var track;
var postURL;
var songStr;
var nowPlayingHTML;
var songBlurb;
var nPArr = new Array();
var next;
var prev;
var pp;
var fav;
var banner;
var songId;

if(tabId>0) {
	haveTab = true;
} else {
	haveTab = false;
}

window.onload = function () {
	// Get current favState, playState, and nowPlayingHTML
	chrome.tabs.sendMessage(tabId, {todo: 'update'}, function(response) {
		favState = response.f;
		playState = response.p;
		nowPlayingHTML = response.nP;
		nPArr = nowPlayingHTML.split('>');
		songId = response.sId;
		if(bg.songId == songId) {
			songBlurb = bg.songBlurb;

		} else {
			// new song
			bg.songId = songId;
			songBlurb = response.sB; // Attempt to get new blurb
			bg.songBlurb = songBlurb;
		}
		//songBlurb = response.sB;

	});
	next = document.getElementById('goNext');
	prev = document.getElementById('goPrev');
	pp = document.getElementById('goPlay');
	fav = document.getElementById('goFav');

	
	next.onclick = nextSong;
	prev.onclick = prevSong;
	pp.onclick = pausePlay;
	document.getElementById('goFav').onclick = favorite;

	// Set up UI
	setTimeout(function() {
		//pp.src='images/'+playState+'.png';
		pp.className = playState;
		//document.getElementById('goFav').src='images/'+favState+'.png';
		document.getElementById('goFav').className = favState;
		artist = nPArr[7].slice(0,-3);
		track = nPArr[11].slice(0,-3);
		postURL = nPArr[12].slice(28,-1);
		songStr = '<a href="'+postURL+'" target="_blank">'+artist+' - '+track+'</a>';
		songBlurb += ' <a href="'+postURL+'" target="_blank">Read more...</a>';
		
		document.getElementById('track').innerHTML = songStr;
		document.getElementById('content').innerHTML = songBlurb;
	}, 250);
	
}
function nextSong() {
	if(haveTab) {
	  chrome.tabs.sendMessage(tabId, {todo: "next"}, function(response) {
	  	if(response.done==true) {
			nowPlayingHTML = response.nP;
			nPArr = nowPlayingHTML.split('>');
			songBlurb = response.sB;
			songId = response.sId;
	  		//pp.src='images/pause.png';
	  		pp.className = 'pause';
	  		//document.getElementById('goFav').src = 'images/'+response.f+'.png';
	  		document.getElementById('goFav').className = response.f;
	  		artist = nPArr[7].slice(0,-3);
			track = nPArr[11].slice(0,-3);
			postURL = nPArr[12].slice(28,-1);
			songStr = '<a href="'+postURL+'" target="_blank">'+artist+' - '+track+'</a>';
			songBlurb += ' <a href="'+postURL+'" target="_blank">Read more...</a>';
			document.getElementById('track').innerHTML = songStr;
			document.getElementById('content').innerHTML = songBlurb;
	  	}
	  });
	}
}
function prevSong() {
	if(haveTab) {
	  chrome.tabs.sendMessage(tabId, {todo: "prev"}, function(response) {
	  	if(response.done==true) {
	  		nowPlayingHTML = response.nP;
			nPArr = nowPlayingHTML.split('>');
			songBlurb = response.sB;
			songId = response.sId;
	  		//pp.src='images/pause.png';
	  		pp.className = 'pause';
	  		//document.getElementById('goFav').src='images/'+response.f+'.png';
	  		document.getElementById('goFav').className = response.f;
	  		artist = nPArr[7].slice(0,-3);
			track = nPArr[11].slice(0,-3);
			postURL = nPArr[12].slice(28,-1);
			songStr = '<a href="'+postURL+'" target="_blank">'+artist+' - '+track+'</a>';
			songBlurb += ' <a href="'+postURL+'" target="_blank">Read more...</a>';
			document.getElementById('track').innerHTML = songStr;
			document.getElementById('content').innerHTML = songBlurb;
			console.log('NEW SONG ID IS '+songId);
	  	}
	  }); 
	}
}
function pausePlay() {
	if(haveTab) {
		chrome.tabs.sendMessage(tabId, {todo: "pp"}, function(response) {
			if(response.done==true) {
				if(bg.playState == 'pause') {
					//pp.src='images/pause.png';
					pp.className = 'pause';
				} else {
					//pp.src='images/play.png';
					pp.className ='play';
				}
			}
		});
		
	}
}
function favorite() {
	if(haveTab) {
	  chrome.tabs.sendMessage(tabId, {todo: "fav"}, function(response) {
	  	if(bg.favState == 'fav-on') {
			//document.getElementById('goFav').src='images/fav-on.png';
			document.getElementById('goFav').className = 'fav-on';
		} else {
			//document.getElementById('goFav').src='images/fav-off.png';
			document.getElementById('goFav').className = 'fav-off'
		}
	  });
	}
}
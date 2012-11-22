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
var songId;
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
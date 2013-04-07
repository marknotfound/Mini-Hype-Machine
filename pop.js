var bg = chrome.extension.getBackgroundPage()
  , tabId = bg.tabid
  , favState = bg.favState
  , playState = bg.playState
  , haveTab = bg.haveTab
  , playlist = bg.playlist
  , playlist_html = ''
  , color_class = ''
  , banner
  , artist
  , track
  , postURL
  , next
  , prev
  , pp
  , fav
  , banner
  , trackDiv
  , contentDiv;

window.onload = function () {
	// Some setup stuff...
	next = document.getElementById('goNext');
	prev = document.getElementById('goPrev');
	pp = document.getElementById('goPlay');
	fav = document.getElementById('goFav');
	trackDiv = document.getElementById('track');
	contentDiv = document.getElementById('the_blurb');
	$playlist_container = $('#playlist');
	
	// Bind functions to click events
	next.onclick = nextSong;
	prev.onclick = prevSong;
	pp.onclick = pausePlay;
	fav.onclick = favorite;

	// Set up the buttons
	// Update all controls.
	if ( haveTab )
	{
		chrome.tabs.sendMessage(tabId, {todo: "update"}, function(response) {
			pp.className = bg.playState;
			fav.className = bg.favState;
			trackDiv.innerHTML = bg.currentTrack;
			contentDiv.innerHTML = bg.currentBlurb;
		});

		// Do playlist items
		if ( playlist ) 
		{
    		
        	$.each(playlist, function(key, hype) {
        		console.log(hype);
        		if ( hype.track_id )
        		{ // This if-block protects from the magical last element which is not actually a track
                    playlist_html += "<div class='playlist-item "+color_class+"'>";
                    playlist_html += "<a id='"+hype.play_button+"' class='play' href='#'></a>"+hype.artist+ " - "+hype.track_title;
                    playlist_html += "</div>";
                    color_class = color_class=="white" ? "" : "white";
                }
			});

			$playlist_container.html(playlist_html);
        }

	} 
	else 
	{
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
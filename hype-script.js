// Check if there's already a Hype Machine tab open.
var haveTab;
chrome.extension.sendMessage({hype: 'tabCheck'}, function(response) {
    haveTab = response.tabcheck;
});

// Work around for onload not firing correctly
// hacky but whatever, it works.
window.onload = setTimeout('main()', 500);

// Initialize some variables
var playButton
  , favButton
  , playState
  , playNext
  , playPrev
  , favState
  , favClass
  , songId
  , songBlurb
  , artist
  , track
  , playlist = {}
  , nowplaying = {}
  , readMore;

// Main function. Called after 500ms
function main() {
  // Only run this if we don't already have a Hype Machine tab open.
  if ( haveTab) return false; // Know what's cooler than wrapping a whole function in an if-block? Not wrapping a whole function in an if-block.
  /*************************************************************************/
  /*
  /*   BEGIN INITIALIZATION STUFF. SAY HELLO TO THE BACKGROUND SCRIPT!
  /*
  /*************************************************************************/
  // Cache control elements
  favButton  = document.getElementById("playerFav");
  playButton = document.getElementById("playerPlay");
  playNext   = document.getElementById("playerNext");
  playPrev   = document.getElementById("playerPrev");

  // Get classes on the favorite button
  favClasses = favButton.getAttribute("class");

  // Set initial load junk
  playState  = playButton.getAttribute("class").split(" ")[2] == "pause" ? "pause" : "play";
  try {
      favState   = $('#playerFav').hasClass("fav-on") ? "fav-on" : "fav-off";
  } catch(e) {
    favState = "fav-off";
  }
  songId     = $("#player-nowplaying").children('a')[1].getAttribute('href').split('/')[2];
  playlist   = getPlaylistItems();

  // Let background page know the tab loaded.  Send it initial load info.
  alertBackground(playState, favState, songId, playlist);
  /*************************************************************************/
  /*
  /*   END INITILIZATION STUFF (doesn't initilization look weird with a 'z'?)
  /*
  /*************************************************************************/
  /*************************************************************************/
  /*
  /*   UPDATE BUTTON STATES FROM TAB (NOT EXT) ACTIVITY
  /*
  /*************************************************************************/
  // Listener to update favState when accessed through the website
  favButton.onclick = function() {
    favState = favClasses.split(" ")[1];
    chrome.extension.sendMessage({hype: 'favUpdate', fs: favState});
  }

  // Listener to update favState when accessed through the website
  playButton.onclick = function() {
    playState = playButton.getAttribute("class").split(" ")[2];
    chrome.extension.sendMessage({hype: 'playUpdate', ps: playState});
  }
  /*************************************************************************/
  /*
  /*   END BUTTON STATES FROM TAB HANDLING
  /*
  /*************************************************************************/
  /*************************************************************************/
  /*
  /*   HANDLE INCOMING MESSAGES FROM MAIN POPUP
  /*
  /*************************************************************************/
  chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.todo) {
      case "next":
        playNext.click();
        break;

      case "prev":
        playPrev.click();
        break;

      case "pp":
        playButton.click();
        break;

      case "fav":
        document.getElementById("playerFav").click();
        break;

      case "update":
        // Run on each popup load. Just blank to refresh information.
        break;

      case "click_id":
        document.getElementById(request.button_id).click();
        break;
    }

    // Update some things
    songId     = getSongID();
    playState  = playButton.getAttribute("class").split(" ")[2];
    playState  = playState === undefined ? "play" : playState;
    favState   = getFavState();
    songBlurb  = findBlurb(songId);
    artist     = getArtist();
    track      = getTrackTitle();
    readMore   = getPost();
    playlist   = {};
    playlist   = getPlaylistItems();

    nowplaying = {};
    nowplaying.share_url    = encodeURIComponent("http://www.hypem.com/track/"+songId);
    nowplaying.share_title  = encodeURIComponent(artist + " - " + track);
    nowplaying.share_text   = encodeURIComponent("I'm listening to "+track+" by "+artist+" on @hypem via Mini Hype Machine! bit.ly/Z5xcGw");
    nowplaying.amazon       = "http://hypem.com/go/amazon_mp3_search/"+artist.replace(/ /gi,'+');
    nowplaying              = JSON.stringify(nowplaying);

    // Update background.js
    chrome.extension.sendMessage({hype: 'updateAll',
                                  ps:    playState,
                                  fs:    favState,
                                  sid:   songId,
                                  sb:    songBlurb,
                                  a:     artist,
                                  t:     track,
                                  rm:    readMore,
                                  pl:    playlist,
                                  np:    nowplaying}, function(response) {});

    // Send response to popup.js -- I think? I don't remember why this fixes stuff, but it does, so leave it!
    sendResponse({done: true});
  });
  /*************************************************************************/
  /*
  /*   END MESSAGE HANDLING
  /*
  /*************************************************************************/

  // Notify extension that the tab is being closed
  window.onbeforeunload = function () {
    chrome.extension.sendMessage({hype: 'closed'});
  }
} // End main()


/*************************************************************************/
/*
/*   FUNCTIONS AND THINGS
/*
/*************************************************************************/

//  Alert the background script of the Hypem tab
function alertBackground(p, f, s, playlist) {
  chrome.extension.sendMessage({hype: 'loaded',
                                ps: p,
                                fs: f,
                                sid: s,
                                pl: playlist});
}
// Returns artist name
function getArtist() {
  return document.getElementById('player-nowplaying').childNodes[1].innerText;
}
// Returns track title
function getTrackTitle() {
  return document.getElementById('player-nowplaying').childNodes[3].innerText;
}
// Returns post URL wrapping 'Read More'.  HTML.
function getPost() {
  return $('#player-nowplaying').find('.read').attr('href');
}
// Returns song ID
function getSongID() {
  return $("#player-nowplaying").children('a')[1].getAttribute('href').split('/')[2];
}
// Returns fav state
function getFavState() {
   var favstate = "fav-off";
   try {
    favstate = document.getElementById("playerFav").getAttribute("class").split(" ")[1];
   } catch(e) {

   }
   return favstate;
}

// HAHA THIS IS SO MUCH BETTER THAN THAT GIANT SHITTY FUNCTION THAT USED TO BE HERE YESSSSSS
function findBlurb(songID) {
    var songBlurb = "Sorry, Mini Hype Machine couldn't find a blurb for this track on the current page, but you can still click ahead to read it in full!" // defaul
    try
    {
      songBlurb = document.getElementById('section-track-'+songID).getElementsByTagName('p')[0].childNodes[3].textContent.trim()
    }
    catch (e) {}

    return songBlurb;
}

function getBlogUrl(songID) {
    return $('#section-track-'+songID).find('.readpost').attr('href');
}


function getPlaylistItems() {
  // Get a list of playlist items
  $('#track-list .section-track').each(function() {
    $self    = $(this);
    var temp = $self.data("itemid");
    if ( temp !== undefined )
    {
      playlist['_'+temp]              = {};
      playlist['_'+temp].track_id     = temp;
      playlist['_'+temp].blurb        = findBlurb(temp);
      playlist['_'+temp].blog_url     = $self.find('.readpost').attr('href');
      playlist['_'+temp].div_id       = "section-track-"+playlist['_'+temp].track_id;
      playlist['_'+temp].artist       = $self.find(".section-player .track_name .artist").text();
      playlist['_'+temp].track_title  = $self.find(".section-player .track_name .track .base-title").text();
      playlist['_'+temp].share_url    = encodeURIComponent("http://www.hypem.com"+$self.find(".section-player .track_name .track").attr('href'));
      playlist['_'+temp].share_title  = encodeURIComponent(playlist['_'+temp].artist + " - " + playlist['_'+temp].track_title);
      playlist['_'+temp].share_text   = encodeURIComponent("I'm listening to "+playlist['_'+temp].track_title+" by "+playlist['_'+temp].artist+" on @hypem via Mini Hype Machine!");
      playlist['_'+temp].amazon       = "http://hypem.com/go/amazon_mp3_search/"+playlist['_'+temp].artist.replace(/ /gi,'+');
      playlist['_'+temp].play_button  = "play_ctrl_"+temp;
    }
  });

  return JSON.stringify(playlist);
}
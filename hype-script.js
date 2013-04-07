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
  , playlist = []
  , readMore;

// Main function. Called after 500ms
function main() {
  // Only run this if we don't already have a Hype Machine tab open.
  if(!haveTab) {
    /*************************************************************************/
    /*
    /*   BEGIN INITIALIZATION STUFF. SAY HELLO TO THE BACKGROUND SCRIPT!
    /*
    /*************************************************************************/
    // Cache control elements
    favButton = document.getElementById("playerFav");
    playButton = document.getElementById("playerPlay");
    playNext = document.getElementById("playerNext");
    playPrev = document.getElementById("playerPrev");

    // Get classes on the favorite button 
    favClasses = favButton.getAttribute("class");

    // Set initial load junk
    playState = playButton.getAttribute("class").split(" ")[2] == "pause" ? "pause" : "play";
    favState = favClasses.split(" ")[1];
    songId = favClasses.split(" ")[0].split("_")[2];

    // Get a list of playlist items
    $('#track-list .section-track').each(function() {
      $self = $(this);
      temp = $self.data("itemid");
      playlist[temp] = {};
      playlist[temp].track_id = temp;
      playlist[temp].div_id = "section-track-"+playlist[temp].track_id;
      playlist[temp].artist = $self.find(".section-player .track_name .artist").text();
      playlist[temp].track_title = $self.find(".section-player .track_name .track .base-title").text();
      playlist[temp].share_url = encodeURIComponent("http://www.hypem.com"+$self.find(".section-player .track_name .track").attr('href'));
      playlist[temp].share_title = encodeURIComponent(playlist[temp].artist + " - " + playlist[temp].track_title);
      playlist[temp].play_button = "play_ctrl_"+temp;
    });

    console.log(playlist);
    // Let background page know the tab loaded.  Send it initial load info.
    alertBackground(playState, favState, songId);
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
    /*   HANDLE INCOMING MESSAGES FROM HI.JS
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
      }

      // Update some things
      songId = getSongID();
      playState = playButton.getAttribute("class").split(" ")[2];
      playState = playState==undefined ? "play" : playState;
      favState = getFavState();
      songBlurb = findBlurb(songId);
      artist = getArtist();
      track = getTrackTitle();
      readMore = getPost();
      
      // Update background.js
      chrome.extension.sendMessage({hype: 'updateAll', ps: playState, fs: favState, sid: songId, sb: songBlurb, a: artist, t: track, rm: readMore}, function(response) {
        // Do nothing. Just making sure we wait for it to complete before sending the response.
      });

      // Send response to hi.js
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
  } // End haveTab if
} // End main()


/*************************************************************************/
/*
/*   FUNCTIONS AND THINGS
/*
/*************************************************************************/

//  Alert the background script of the Hypem tab
function alertBackground(p, f, s) {
  chrome.extension.sendMessage({hype: 'loaded', ps: p, fs: f, sid: s});
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
  return document.getElementById('player-nowplaying').childNodes[4].getAttribute('href');
}
// Returns song ID 
function getSongID() {
  return document.getElementById("playerFav").getAttribute("class").split(" ")[0].split("_")[2];
}
// Returns fav state
function getFavState() {
   return document.getElementById("playerFav").getAttribute("class").split(" ")[1]; 
} 
// Fuck this function.  Tries to find a song blurb.  Bugs the fuck out if you're not on the page the song originated from
function findBlurb(songID) {
    var trackDiv = document.getElementById('section-track-'+songID);
    var found = false;
    var hasBlurb = false;
    var ohshit = false;
    var songBlurb = "Sorry, Mini Hype Machine couldn't find a blurb for this track on the current page, but you can still click ahead to read it in full!"; // default
    var temp;
    var len;
    var childOne = 0;
    var childTwo = 0;
    var childThree = 0;
    // Find section player child node
    try {
      len = trackDiv.childNodes.length;
    } catch(e) {
      ohshit = true; // Track playing is from a different page and the blurb doesn't exist on the current page.
    }
    if(!ohshit) {
      while(!found) {
          try {
              temp = trackDiv.childNodes[childOne].getAttribute('class');
          } catch(e) {
              temp = 'no';
          }

          if(temp=='section-player') {
              found = true;
          } else {
              childOne++;
          }
      }
      found = false;
      
      // Find second child node
      while(!found) {
          try {
              temp = trackDiv.childNodes[childOne].childNodes[childTwo].getAttribute('class');
          } catch(e) {
              temp = 'no';
          }

          if(temp=='meta') {
              found = true;
              childTwo+=2;
              try {
                temp = trackDiv.childNodes[childOne].childNodes[childTwo].getAttribute('class');
              } catch(e) {
                temp = 'act_info';
              }
              
              if(temp!='act_info') {
                hasBlurb = true;
              }
          } else {
              childTwo++;
          }
      }
    }
    if(hasBlurb) {
      songBlurb = trackDiv.childNodes[childOne].childNodes[childTwo].childNodes[3].textContent.trim();
    }
    return songBlurb;
}

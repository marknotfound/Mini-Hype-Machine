// Work around for onload not firing correctly
// hacky but whatever
window.onload = setTimeout('main()', 500); 

// Initialize stuff
var playButton;
var favButton;
var playState;
var playNext;
var playPrev;
var favState;
var favClass;
var songId;
var songBlurb;

function main() {
  // Shortcuts
  favButton = document.getElementById("playerFav");
  playButton = document.getElementById("playerPlay");
  playNext = document.getElementById("playerNext");
  playPrev = document.getElementById("playerPrev");
  // Get classes on the favorite button 
  favClasses = favButton.getAttribute("class");

  // Set initial load junk
  playState = playButton.getAttribute("class").split(" ")[1] == "pause" ? "pause" : "play";
  favState = favClasses.split(" ")[1];
  songId = favClasses.split(" ")[0].split("_")[2];

  // Let background page know the tab loaded.  Send it initial load info.
  alertBackground(playState, favState, songId);

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
    playState = playButton.getAttribute("class").split(" ")[1];
    chrome.extension.sendMessage({hype: 'playUpdate', ps: playState});
  }

  /*************************************************************************/
  /*
  /*   END BUTTON STATES FROM TAB HANDLING
  /*
  /*************************************************************************/


  /*************************************************************************/
  /*
  /*   HANDLE INCOMING COMMANDS FROM HI.JS
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
    favClasses = favButton.getAttribute("class");
    songId = favClasses.split(" ")[0].split("_")[2];
    songBlurb = findBlurb(songId);
    playState = playButton.getAttribute("class").split(" ")[1];
    playState = playState==undefined ? "play" : playState;
    favState = document.getElementById("playerFav").getAttribute("class").split(" ")[1];

    // Update background.js
    chrome.extension.sendMessage({hype: 'updateAll', ps: playState, fs: favState, sid: songId, sb: songBlurb}, function(response) {
      // Do nothing. Just making sure we wait for it to complete.
      if(response.bgupdate) {
        console.log('SENT PLAYSTATE: '+playState+', FAVSTATE: '+favState+', SONGID: '+songId+', SONGBLURB: '+songBlurb);
      }
    });

    // Send response to hi.js
    sendResponse({done: true});
  });
  /*************************************************************************/
  /*
  /*   END COMMAND HANDLING
  /*
  /*************************************************************************/

  // Notify extension that the tab is being closed
  window.onbeforeunload = function () {
    chrome.extension.sendMessage({hype: 'closed'});
  }
  
} // End main()
















//  Alert the background script of the Hypem tab
function alertBackground(p, f, s) {
  chrome.extension.sendMessage({hype: 'loaded', ps: p, fs: f, sid: s});
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

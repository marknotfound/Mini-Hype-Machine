// Work around for onload not firing correctly
window.onload = setTimeout('runExt()', 500); 

function runExt() {
  // Main function
  var playNext = document.getElementById('playerNext');
  var playPrev = document.getElementById('playerPrev');
  var pausePlay = document.getElementById('playerPlay');
  var fav = document.getElementById('playerFav');
  var favState = fav.getAttribute('class');
  favState = favState.split(' ')[1];
  var playState = 'play';
  var nowPlaying;
  var songId;
  var songBlurb;

  //pausePlay.onclick = updatePlay;
  pausePlay.addEventListener('click', function () {
    updatePlay();
  });
  alertBackground(favState);

  // Listen for commands
  chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    var todo = request.todo;
    songId = document.getElementById('playerFav').getAttribute('class').split(' ')[0].substring(9);
    switch(todo) {
      case 'next':
        playNext.click();
        favState = document.getElementById('playerFav').getAttribute('class').split(' ')[1];
        songId = document.getElementById('playerFav').getAttribute('class').split(' ')[0].substring(9);
        nowPlaying = document.getElementById('player-nowplaying').innerHTML;
        songBlurb = findBlurb(songId);
        break;
      case 'prev':
        playPrev.click();
        favState = document.getElementById('playerFav').getAttribute('class').split(' ')[1];
        songId = document.getElementById('playerFav').getAttribute('class').split(' ')[0].substring(9);
        nowPlaying = document.getElementById('player-nowplaying').innerHTML;
        songBlurb = findBlurb(songId);
        break;
      case 'pp':
        pausePlay.click();
        playState = pausePlay.getAttribute('class').split(' ')[1];
        break;
      case 'fav':
        document.getElementById('playerFav').click();
        favState = document.getElementById('playerFav').getAttribute('class').split(' ')[1];
        break;
      case 'update':
        favState = document.getElementById('playerFav').getAttribute('class').split(' ')[1];
        playState = document.getElementById('playerPlay').getAttribute('class').split(' ')[1];
        nowPlaying = document.getElementById('player-nowplaying').innerHTML;
        songBlurb = findBlurb(songId);
        break;
    }
    chrome.extension.sendMessage({hype: 'update', ps: playState, fs: favState});
    if(playState == undefined) { playState = 'play'; }
    sendResponse({done: true, f: favState, p: playState, nP: nowPlaying, sB: songBlurb, sId: songId});  
  });


  // Listener to check favState
  chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.question=='isthisfavorite') {
      var f = document.getElementById('playerFav').getAttribute('class').split(' ')[1];
      if(f == 'fav-on') 
        sendResponse({answer: 'yes'});
      else 
        sendResponse({answer: 'no'});
    }
  });

  window.onbeforeunload = function () {
    // Notify extension that the tab is being closed
    chrome.extension.sendMessage({hype: 'closed'});
  }
  
}
// Update the playState (from the hypem.com, not the extension)
function updatePlay() {
  var playState = document.getElementById('playerPlay').getAttribute('class').split(' ')[1];
  chrome.extension.sendMessage({hype: 'updatePlay', ps: playState});
}
// Update the favState (from the hypem.com, not the extension)
function updateFav() {
  var favState = document.getElementById('playerFav').getAttribute('class').split(' ')[1];
  chrome.extension.sendMessage({hype: 'updateFav', fs: favState});
}
// Alert background script of Hype tab id
function alertBackground(fs) {
  chrome.extension.sendMessage({greeting: "loaded", f: fs}, function(response) {
    
  });
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

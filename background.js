var tabid;
var favState = 'fav-off';
var playState = 'play';
var haveTab = false;
var currentTrack = "<a href='http://www.hypem.com' target='_blank'>No Hype Machine tab found. Open one!</a>";
var currentBlurb = "Nothing to see here! <a href='http://www.hypem.com' target='_blank'>Load up a Hype Machine tab!</a>";
var readMore;
var songId='';
var artist;
var track;

// Listener to get the Hypem tab ID on load and update favState and playState
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.hype) {
      case "tabCheck": // Checks if there's already a tab open.
            // Do nothing.
          break;
      case "loaded": // Tab loaded.  Set everything up.
        tabid = sender.tab.id;
        favState = request.fs;
        playState = request.ps;
        //songId = request.sid;
        haveTab = true;
        break;

      case "favUpdate":
        favState = request.fs;
        break;

      case "playUpdate":
        playState = request.ps;
        break;
      case "updateAll":
        // Button states
        playState = request.ps;
        favState = request.fs;
        // Blurb: Don't update it if the songID hasn't changed.  This holds the blurb regardless of what page the user is on.
        readMore = request.rm;
        readMore = "<a href='"+readMore+"' target='_blank'> Read Post »</a>";
        currentBlurb = songId==request.sid ? currentBlurb : request.sb+' '+readMore;
        console.log('songid: '+songId);
        console.log('sid: '+request.sid);
        console.log(currentBlurb);
        // Track information
        songId = request.sid;
        artist = request.a;
        track = request.t;
        currentTrack = artist+' - '+track;
        break;
      case "closed": // lol, CASE CLOSED MOTHERFUCKER
        console.log('Tab closed.  Setting everything back to defaults...');
        setDefaults();
        console.log('Done!');
        break;
    }

    sendResponse({bgupdate: true, tabcheck: haveTab });
});

function setDefaults() {
  tabid = '';
  favState = 'fav-off';
  playState = 'play';
  haveTab = false;
  currentTrack = "<a href='http://www.hypem.com'>No Hype Machine tab found. Open one!</a>";
  currentBlurb = "<a href='http://www.hypem.com'>Nothing to see here! Load up a Hype Machine tab!</a>";
  readMore = '';
  songId = '';
  artist = '';
  track = '';
}
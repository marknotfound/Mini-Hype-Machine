var tabid
  , favState = 'fav-off'
  , playState = 'play'
  , haveTab = false
  , currentTrack = "<a href='http://www.hypem.com' target='_blank'>No Hype Machine tab found. Open one!</a>"
  , currentBlurb = "Nothing to see here! <a href='http://www.hypem.com' target='_blank'>Load up a Hype Machine tab!</a>"
  , readMore
  , songId = ''
  , artist
  , playlist
  , nowplaying
  , track;

// Listener to get the Hypem tab ID on load and update favState and playState
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {

    switch(request.hype) {
      case "tabCheck": // Checks if there's already a tab open.
            // Do nothing.
          break;
      case "loaded": // Tab loaded.  Set everything up.
        tabid     = sender.tab.id;
        favState  = request.fs;
        playState = request.ps;
        playlist  = JSON.parse(request.pl);
        haveTab   = true;
        break;

      case "favUpdate":
        favState = request.fs;
        break;

      case "playUpdate":
        playState = request.ps;
        break;

      case "updateAll":
        // Button states
        playState    = request.ps;
        favState     = request.fs;
        readMore     = request.rm;
        currentBlurb = songId == request.sid ? currentBlurb : request.sb;
        songId       = request.sid;
        artist       = request.a;
        track        = request.t;
        playlist     = JSON.parse(request.pl);
        nowplaying   = JSON.parse(request.np);
        currentTrack = artist+' - '+track;
        break;

      case "closed": // lol, CASE CLOSEDDDDDD
        setDefaults();
        break;
    }

    sendResponse({bgupdate: true, tabcheck: haveTab});
});

// Just set up defaults when a tab closes.
// Every time a tab closes, a developer gets his wings.
function setDefaults() {
  tabid        = '';
  favState     = 'fav-off';
  playState    = 'play';
  haveTab      = false;
  currentTrack = "<a href='http://www.hypem.com' target='_blank'>No Hype Machine tab found. Open one!</a>";
  currentBlurb = "Nothing to see here! <a href='http://www.hypem.com' target='_blank'>Load up a Hype Machine tab!</a>";
  readMore     = '';
  songId       = '';
  artist       = '';
  track        = '';
}
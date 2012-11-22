var tabid;
var favState = 'fav-off';
var playState = 'play';
var haveTab = false;
var currentTrack = "No Hype Machine tab found. Open one!";
var currentBlurb = "Nothing to see here! Load up a Hype Machine tab!";
var songId;

// Listener to get the Hypem tab ID on load and update favState and playState
chrome.extension.onMessage.addListener(function(request, sender) {
    switch(request.hype) {
      case "loaded": // Tab loaded
        tabid = sender.tab.id;
        favState = request.fs;
        playState = request.ps;
        songId = request.sid;
        haveTab = true;
        break;

      case "favUpdate":
        favState = request.fs;
        break;

      case "playUpdate":
        playState = request.ps;
        break;
        
    }
});
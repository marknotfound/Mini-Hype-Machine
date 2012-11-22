var tabid;
var favState;
var playState;
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
        console.log('Tab loaded. Tab ID: '+tabid+', favState: '+favState+', haveTab: '+haveTab+', playState: '+playState+', songId: '+songId);
        break;
    }
});
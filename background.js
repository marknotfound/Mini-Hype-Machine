var tabid;
var favState = 'fav-off';
var playState = 'play';
var haveTab = false;
var currentTrack = "<a href='http://www.hypem.com'>No Hype Machine tab found. Open one!</a>";
var currentBlurb = "<a href='http://www.hypem.com'>Nothing to see here! Load up a Hype Machine tab!</a>";
var readMore;
var songId;
var artist;
var track;

// Listener to get the Hypem tab ID on load and update favState and playState
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
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
      case "updateAll":
        playState = request.ps;
        favState = request.fs;
        songId = request.sid;
        readMore = request.rm;
        readMore = "<a href='"+readMore+"' target='_blank'> Read Post </a>";
        currentBlurb = request.sb+' '+readMore;
        artist = request.a;
        track = request.t;
        currentTrack = artist+' - '+track;

        console.log('Current Track: '+currentTrack);
        console.log('Current Blurb: '+currentBlurb);
        break;
    }

    sendResponse({bgupdate: true});
});
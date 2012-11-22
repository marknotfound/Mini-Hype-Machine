var tabid;
var favState;
var playState = 'play';
var haveTab = false;
var currentSong;
var currentBlurb;
var songId = '';
var songBlurb = '';

  // Listener to get the Hypem tab ID on load and update favState and playState
  chrome.extension.onMessage.addListener(function(request, sender) {
    // haveTab makes it so if you open a second tab it doesn't fuck anything up.
    if(!haveTab) {
      if(request.greeting=='loaded') {
        tabid = sender.tab.id;
        favState = request.f; // Initial favState
        haveTab = true;
      }
    }
    if(request.hype=='update') {
      favState = request.fs;
      playState = request.ps;
    } else if(request.hype=='updatePlay') {
      playState = request.ps;
    } else if(request.hype=='updateFav') {
      favState = request.fs;
    } else if(request.hype=='closed') {
      playState = 'play';
      favState = 'fav-off';
      haveTab = false; // Make room for a new tab to open up
    }
  });
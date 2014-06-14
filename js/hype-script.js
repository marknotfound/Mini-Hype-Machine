var Parser = new Parser();
var haveTab;

chrome.extension.sendMessage({action: 'load'}, function(response) {
  haveTab = response.hadTab;
});

window.onbeforeunload = function() {
  if (haveTab !== true) {
    chrome.extension.sendMessage({action: 'unload'});
  }
};

$(document).ready(function() {
  // Snag the important stuff so we can build a parser
  var playlist;

  var playing  = document.getElementById('player-nowplaying');

  var controls = {
    next     : document.getElementById('playerNext'),
    previous : document.getElementById('playerPrev'),
    play     : document.getElementById('playerPlay'),
    favorite : document.getElementById('playerFav')
  };

  // Grab the playlist elements which are a little trickier.
  var interval = setInterval(function() {

    try {
      playlist = document.getElementById('track-list').querySelectorAll('.section-track');
    } catch(e) {}

    // If we got the playlist, then let's clear this timeout and move on with our lives.
    if (playlist !== undefined) {
      // Initialize the parser so it can get datas and things.
      Parser.initialize(controls, playing, playlist);
      clearInterval(interval);
    }

  }, 100);

  // Listen up!
  chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('[MHM DEBUG] Received message to perform action ' + request.action);

    if (request.action === 'next') {
      controls.next.click();
    }
    else if (request.action === 'previous') {
      controls.previous.click();
    }
    else if (request.action === 'play') {
      controls.play.click();
    }
    else if (request.action === 'favorite') {
      controls.favorite.click();
    }
    else if (request.action === 'change') {
      document.getElementById(request.id).click();
    }
    else if (request.action === 'update') {
      playlist = document.getElementById('track-list').querySelectorAll('.section-track');
      Parser.setTracks(playlist);
    }

    // Prep data to shoot back to update the view
    var response = {
      track: {
        artist: Parser.artist(),
        title: Parser.title(),
        url: Parser.url(),
        id: Parser.trackId()
      },
      state: {
        play: Parser.playState(),
        favorite: Parser.favoriteState()
      },
      meta: {
        facebook: Parser.shareUrl('facebook'),
        twitter: Parser.shareUrl('twitter')
      },
      playlist: Parser.playlist()
    };

    sendResponse(response);
  });
});

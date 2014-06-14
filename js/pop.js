var Mini = new Mini();
var background = chrome.extension.getBackgroundPage();

window.onload = function () {
  var controls = {
    next     : document.getElementById('next'),
    previous : document.getElementById('previous'),
    play     : document.getElementById('play'),
    favorite : document.getElementById('favorite')
  };

  var player = {
    track   : document.getElementById('track'),
    content : document.getElementById('blurb'),
    list    : document.getElementById('playlist')
  };

  var meta = {
    read: document.getElementById('read-more'),
    facebook: document.getElementById('share-facebook'),
    twitter: document.getElementById('share-twitter'),
    content: document.getElementById('content')
  };

  // Initialize the popup player
  Mini.initialize(controls, player, meta, $(document));

  if (background.tab) {
    chrome.tabs.sendMessage(background.tab, { action: 'update' }, function(response) {
      Mini.update(response);
    });
  }
};

function Mini() {};

Mini.prototype.initialize = function(controls, player, meta, popup) {
  this.controls = controls;
  this.player   = player;
  this.meta     = meta;
  this.popup      = popup;

  this.bindEvents(this.controls);
}

// Bind the click events for the pop up controls
Mini.prototype.bindEvents = function(controls) {
  var that = this;

  controls.next.onclick = function() {
    that.remoteClick({ action: 'next' });
  };

  controls.previous.onclick = function() {
    that.remoteClick({ action: 'previous'});
  };

  controls.play.onclick = function() {
    that.remoteClick({ action: 'play' });
  };

  controls.favorite.onclick = function() {
    that.remoteClick({ action : 'favorite' });
  };

  this.bindHotkeys({
    74: controls.next.onclick, // j
    78: controls.next.onclick, // n
    39: controls.next.onclick, // ->
    75: controls.previous.onclick, // k
    80: controls.previous.onclick, // p
    37: controls.previous.onclick, // <-
    32: controls.play.onclick, // spacebar
    70: controls.favorite.onclick // f
  });
};

Mini.prototype.bindHotkeys = function(map) {
  var that = this;

  this.popup.on('keyup', function(e) {
    var code = e.keyCode || e.which;

    if (map[code] !== undefined) {
      map[code]();
    }
  })
};

// Send a message to the Hype Machine tab and tell it to act.
Mini.prototype.remoteClick = function(which) {
  var that = this;

  chrome.tabs.sendMessage( background.tab, which, function( response ) {
    that.update( response );
  });
};

Mini.prototype.update = function(data) {
  this.controls.play.setAttribute( 'class', data.state.play );
  this.controls.favorite.setAttribute( 'class', data.state.favorite );

  this.player.track.innerHTML = '<a href="http://www.hypem.com/artist/' + data.track.artist + '/" target="_blank">' + data.track.artist + '</a> - '+
                                '<a href="http://www.hypem.com/track/' + data.track.id + '/" target="_blank">' + data.track.title + '</a>';

  this.meta.read.setAttribute('href', data.track.url);
  this.meta.facebook.setAttribute('href', data.meta.facebook);
  this.meta.twitter.setAttribute('href', data.meta.twitter);
  this.meta.content.className = '';

  this.appendPlaylist(data.playlist).bindPlaylistEvents();
};

Mini.prototype.appendPlaylist = function(playlist) {
  var html  = '';
  var color = 'white';

  for ( var i = 0; i < playlist.length; i++ ) {
    var that = playlist[i];

    html += '<div class="playlist-item ' + color + '">';
    html += '<a id="' + that.button + '" class="playlist-control ' + that.state + '" href="#"></a>';
    html += that.artist + ' - ' + that.title;
    html += '</div>';

    color = ( color == 'white' ) ? '' : 'white';
  }

  this.player.list.innerHTML = html;

  return this;
};

Mini.prototype.bindPlaylistEvents = function() {
  var that = this;
  var playlist = document.getElementsByClassName('playlist-control');

  for ( var i = 0; i < playlist.length - 1; i++ ) {
    var trackId = playlist[i].getAttribute('id');

    document.getElementById(trackId).onclick = function() {
      that.remoteClick({ action: 'change', id: this.getAttribute('id') });
    };
  }
}

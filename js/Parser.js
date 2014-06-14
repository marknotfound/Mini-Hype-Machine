function Parser() {};

// Initialize properties
Parser.prototype.initialize = function(controls, playing, tracks) {
  this.controls = controls;
  this.playing  = playing;
  this.tracks   = tracks;
};

// Retrieve the current playstate.
Parser.prototype.playState = function() {

  var classes = this.controls.play.getAttribute('class').split(' ');

  for (var i = 0; i < classes.length; i++ ) {

    if ( classes[i] == 'play' || classes[i] == 'pause' ) {
      return classes[i];
    }

  }

  // Default
  return 'play';
};

// Retrieve the current favorite state.
Parser.prototype.favoriteState = function() {
  var classes = this.controls.favorite.getAttribute('class').split(' ');

  for (var i = 0; i < classes.length; i++) {
    if ( classes[i] === 'fav-off' || classes[i] === 'fav-on' ) {
      return classes[i];
    }
  }

  // Default
  return 'fav-off';
};

// Retrieve the current artist
Parser.prototype.artist = function() {
  return this.playing.querySelectorAll('a')[0].innerText;
};

// Retrieve the current track title
Parser.prototype.title = function() {
  return this.playing.querySelectorAll('a')[1].innerText;
};

// Retrieve the blog url for the current track
Parser.prototype.url = function() {
  return this.playing.querySelectorAll('.read-post')[0].getAttribute('href');
};

// Retrieve the id for this track
Parser.prototype.trackId = function() {
  return this.playing.querySelectorAll('a')[1].getAttribute('href').split('/')[2];
};

// Retrieve the active playlist from the DOM
Parser.prototype.playlist = function() {

  var playlist = [];

  for ( var i = 0; i < this.tracks.length; i++ ) {
    var that = this.tracks[i].querySelector('.section-player');
    var section = {};
    // Sometimes there's a section without a button because Hype Machine likes
    // to mess with me. That's cool though. We'll just catch the null value and
    // not push it into our playlist.
    try {
      section.id     = that.getAttribute('data-itemid');
      section.artist = that.querySelector('.track_name .artist').innerText;
      section.title  = that.querySelector('.track_name .track').innerText;
      section.button = that.querySelector('.tools .playdiv .play-ctrl').getAttribute('id');
      section.state  = this.listItemState( section.button );

      playlist.push(section);
    } catch(e) {}
  }

  return playlist;
};

Parser.prototype.shareUrl = function(network) {
  var icon = 'icon-' + network;
  return 'http:' + this.playing.getElementsByClassName(icon)[0].getAttribute('data-href');
};

Parser.prototype.listItemState = function(id) {
  var classes = document.getElementById(id).getAttribute('class').split(' ');

  for (var i = 0; i < classes.length; i++ ) {
    if ( classes[i] == 'play' || classes[i] == 'pause' ) {
      return classes[i];
    }
  }

  // Default
  return 'play';
};

// Update the tracks property
Parser.prototype.setTracks = function(tracks) {
  this.tracks = tracks;
};

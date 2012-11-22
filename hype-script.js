// Work around for onload not firing correctly
// hacky but whatever
window.onload = setTimeout('main()', 500); 

// Initialize stuff
var playButton;
var favButton;
var playState;
var favState;
var favClass;
var songId;

function main() {
  // make life easier later
  favButton = document.getElementById("playerFav");
  playButton = document.getElementById("playerPlay");

  // set play and fav state
  playState = playButton.getAttribute("class").split(" ")[1]=="pause" ? "pause" : "play";
  favClass = favButton.getAttribute("class");
  favState = favClass.split(" ")[1];
  songId = favClass.split(" ")[0].split("_")[2];

  alertBackground(playState, favState, songId);

  console.log('Found some stuff. playState: '+playState+', favState: '+favState+', songId: '+songId);

  // Notify extension that the tab is being closed
  window.onbeforeunload = function () {
    chrome.extension.sendMessage({hype: 'closed'});
  }
  
} // End main()

//  Alert the background script of the Hypem tab
function alertBackground(p, f, s) {
  chrome.extension.sendMessage({hype: 'loaded', ps: p, fs: f, sid: s});
}

// Fuck this function.  Tries to find a song blurb.  Bugs the fuck out if you're not on the page the song originated from
function findBlurb(songID) {
    var trackDiv = document.getElementById('section-track-'+songID);
    var found = false;
    var hasBlurb = false;
    var ohshit = false;
    var songBlurb = "Sorry, Mini Hype Machine couldn't find a blurb for this track on the current page, but you can still click ahead to read it in full!"; // default
    var temp;
    var len;
    var childOne = 0;
    var childTwo = 0;
    var childThree = 0;
    // Find section player child node
    try {
      len = trackDiv.childNodes.length;
    } catch(e) {
      ohshit = true; // Track playing is from a different page and the blurb doesn't exist on the current page.
    }
    if(!ohshit) {
      while(!found) {
          try {
              temp = trackDiv.childNodes[childOne].getAttribute('class');
          } catch(e) {
              temp = 'no';
          }

          if(temp=='section-player') {
              found = true;
          } else {
              childOne++;
          }
      }
      found = false;
      
      // Find second child node
      while(!found) {
          try {
              temp = trackDiv.childNodes[childOne].childNodes[childTwo].getAttribute('class');
          } catch(e) {
              temp = 'no';
          }

          if(temp=='meta') {
              found = true;
              childTwo+=2;
              try {
                temp = trackDiv.childNodes[childOne].childNodes[childTwo].getAttribute('class');
              } catch(e) {
                temp = 'act_info';
              }
              
              if(temp!='act_info') {
                hasBlurb = true;
              }
          } else {
              childTwo++;
          }
      }
    }
    if(hasBlurb) {
      songBlurb = trackDiv.childNodes[childOne].childNodes[childTwo].childNodes[3].textContent.trim();
    }
    return songBlurb;
}

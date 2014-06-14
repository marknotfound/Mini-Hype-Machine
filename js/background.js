var tab;

// Listener to get the Hypem tab ID on load and update favState and playState
chrome.extension.onMessage.addListener( function( request, sender, sendResponse ) {
  // If being loaded, don't overwrite the current tab.
  if (request.action === 'load') {
    // Assume we already had a tab by default
    var hadTab = true;

    // If there actually is no tab yet set, set it and update hadTab
    if (tab === undefined) {
      tab = sender.tab.id;
      hadTab = false;
    }

    sendResponse({hadTab: hadTab});
  }
  else if (request.action === 'unload') {
    tab = undefined;
  }
});

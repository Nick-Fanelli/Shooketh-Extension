chrome.browserAction.onClicked.addListener(function(activeTab) {
	var newURL = "https://google.com";
	chrome.tabs.create( { url: newURL} );
});
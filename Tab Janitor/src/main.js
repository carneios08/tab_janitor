let entireURL = undefined;
let currentTab = undefined;

chrome.webNavigation.onCommitted.addListener(function(details) {
    if (details && details.tabId && details.transitionType === "typed") {
        chrome.storage.sync.get(['entireURL'], setMode);

        chrome.tabs.get(details.tabId, function(tab) {
            currentTab = tab;
        });

        if (currentTab && currentTab.id) {
            main();
        }
    }
});

function setMode(result) {
    if (result && result.entireURL) {
        entireURL = result.entireURL;
    }
    else {
        entireURL = false;
    }
}

function main() {
    if (!entireURL) {
        chrome.tabs.query({
            discarded: false,
            url: currentTab.url.split('?')[0] + "*"
        },
        removeSimilarTabs);
    }
    else {

    }
}

function removeSimilarTabs(resultSet) {
    if (resultSet) {
        for (let i = 0; i < resultSet.length; i++) {
            if (resultSet[i] && currentTab && resultSet[i].id && currentTab.id && resultSet[i].id !== currentTab.id) {
                chrome.tabs.remove(resultSet[i].id);
            }
        }
    }
}
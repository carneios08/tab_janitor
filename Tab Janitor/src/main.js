let entireURL = undefined;
let currentTab = undefined;

chrome.webNavigation.onCompleted.addListener(function(details) {
    if (details && details.tabId && details.frameId == 0) {
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
    chrome.tabs.query({}, removeSimilarTabs);
}

function removeSimilarTabs(resultSet) {
    if (resultSet) {
        let baseURL = "";

        for (let i = 0; i < resultSet.length; i++) {
            if (!entireURL) {
                baseURL = currentTab.url.split('?')[0];

                if (baseURL.length > 0 && resultSet[i].url && resultSet[i].url.split('?')[0] === baseURL) {
                    if (resultSet[i].id && resultSet[i].id !== currentTab.id) {
                        chrome.tabs.remove(resultSet[i].id);
                    }
                }
            }
            else {
                if (resultSet[i].url && resultSet[i].url === currentTab.url) {
                    if (resultSet[i].id && resultSet[i].id !== currentTab.id) {
                        chrome.tabs.remove(resultSet[i].id);
                    }
                }
            }
        }
    }
}
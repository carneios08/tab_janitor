chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        main();
    });
});

function main() {
    let currentTab = getCurrentTab();

    if (currentTab) {
        let relatedTabs = getAllTabs(chrome.storage.sync.get(['entireURL'], setMode), currentTab);
        let relatedTabIDs = [];
    
        for (let i = 0; i < relatedTabs.length; i++) {
            // Do not add the tab to the temp collection if the tab ID DNE.
            if (relatedTabs[i].id && relatedTabs[i].id !== chrome.tabs.TAB_ID_NONE) {
                // Do not allow the removal of the current tab if it is included in the collection.
                if (currentTab.id && currentTab.id !== relatedTabs[i].id) {
                    relatedTabIDs.push(relatedTabs[i].id);
                }
            }
        }
    
        // Remove all of the other related tabs.
        chrome.tabs.remove(relatedTabIDs);
    }
}

function setMode(result) {
    return result.entireURL;
}

function getCurrentTab() {
    return chrome.tabs.getCurrent(function(tab) {
        return tab;
    });
}

function getAllTabs(entireURL, currentTabIn) {
    let tabs = null;

    if (!entireURL) {
        let baseURL = currentTabIn.url.split('?')[0];

        tabs = chrome.tabs.query({
            url: baseURL
        },
        getAllTabsCallback());
    }
    else {
        tabs = chrome.tabs.query({
            url: currentTabIn.url
        },
        getAllTabsCallback());
    }

    return tabs;
}

function getAllTabsCallback(tabsResult) {
    return tabsResult;
}
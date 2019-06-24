// Create event listeners and initialize the page.
window.addEventListener('load', initialize);



function initialize() {
    document.getElementById('btnReset').addEventListener('click', resetClick);
    document.getElementById('btnSubmit').addEventListener('click', submitClick);

    loadOptions();
}

function loadOptions() {
    chrome.storage.sync.get(['entireURL'], setMode);
}

function setMode(result) {
    if (!result.entireURL) {
        document.getElementById('rdoBaseURL').checked = true
        document.getElementById('rdoEntireURL').checked = false;
    }
    else {
        document.getElementById('rdoBaseURL').checked = false;
        document.getElementById('rdoEntireURL').checked = true;
    }
}

function resetClick() {
    loadOptions();
}

function submitClick() {
    if (validateMode()) {
        chrome.storage.sync.set({
            entireURL: document.getElementById('rdoEntireURL').checked
        });

        alert("Options were updated successfully.");
    }
    else {
        alert("Invalid mode submission was attempted. Please select a single mode.");
    }
}

function validateMode() {
    let baseURL = document.getElementById('rdoBaseURL').checked;
    let entireURL = document.getElementById('rdoEntireURL').checked;

    if ((!baseURL && !entireURL) || (baseURL && entireURL)) {
        return false;
    }
    return true;
}

function isNullOrWhiteSpace(input) {
    if (!input) {
        return true;
    }
    else {
        return input.replace(/\s/g, '').length < 1;
    }
}
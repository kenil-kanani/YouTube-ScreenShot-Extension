
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'saveScreenshot') {
        console.log("Inside saveScreenshot function");
        const imageDataURL = message.imageDataURL;
        saveImage(imageDataURL);
    }
});

function saveImage(imageDataURL) {
    chrome.storage.local.get('screenshot', function (result) {
        let screenshots = result.screenshot || [];

        if (!Array.isArray(screenshots)) {
            screenshots = [];
        }

        screenshots.push(imageDataURL);

        chrome.storage.local.set({ 'screenshot': screenshots }, function () {
            if (chrome.runtime.lastError) {
                console.error('Failed to save image:', chrome.runtime.lastError);
            } else {
                console.log('Image saved to chrome.storage.local successfully');
            }
        });
    });
}

// contentScript.js

function captureScreenshot() {

    try {
        const video = document.querySelector('video');
        if (!video) {
            console.error('Video element not found');
            return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight + 35;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height - 35);


        const watermarkText = "Made with ❤️ by Kenil Kanani's Chrome Extension";
        const fontSize = 20;
        ctx.font = `${fontSize}px Arial`;
        const textWidth = ctx.measureText(watermarkText).width;
        const textX = canvas.width - textWidth - 10; // 10px from the right edge
        const textY = canvas.height - 10; // 10px from the bottom edge
        ctx.fillText(watermarkText, textX, textY);

        const imageDataURL = canvas.toDataURL('image/png');

        chrome.runtime.sendMessage({ action: 'saveScreenshot', imageDataURL: imageDataURL });
    } catch (error) {
        alert('Something went wrong. Please refresh the page and try again.')
    }

}

function notifyUser() {
    const notification = document.createElement('div');
    notification.textContent = 'Screenshot Captured!';
    notification.style.position = 'absolute';
    notification.style.top = '20px';
    notification.style.fontSize = '20px';
    notification.style.right = '20px';
    notification.style.padding = '20px';
    notification.style.backgroundColor = 'black';
    notification.style.color = 'white';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '9999';
    document.body.appendChild(notification);
    // shake effect
    notification.animate([
        { transform: 'translateX(0)' },
        { transform: 'translateX(10px)' },
        { transform: 'translateX(-10px)' },
        { transform: 'translateX(10px)' },
        { transform: 'translateX(-10px)' },
        { transform: 'translateX(10px)' },
        { transform: 'translateX(-10px)' },
        { transform: 'translateX(0)' }
    ], {
        duration: 2000,
        iterations: 1
    });
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

function createCustomButton() {
    try {

        const parentElement = document.querySelector('.ytp-right-controls');
        if (!parentElement) return;

        const customButton = document.createElement('button');
        customButton.textContent = 'Capture Screenshot';
        customButton.classList.add('ytp-button');
        customButton.style.position = 'relative';
        customButton.style.bottom = '20px';
        customButton.style.fontSize = '13px';
        customButton.style.left = '10px';
        customButton.style.marginRight = '20px';
        customButton.style.cursor = 'pointer';
        // hover effect
        customButton.addEventListener('mouseenter', () => {
            customButton.style.opacity = '0.8';
            customButton.style.transition = 'opacity 0.3s';
            customButton.style.transform = 'scale(1.1)';
        });
        customButton.addEventListener('mouseleave', () => {
            customButton.style.opacity = '1';
            customButton.style.transition = 'opacity 0.3s';
            customButton.style.transform = 'scale(1)';
        });

        // if user press command + c then capture screenshot or in windows ctrl + c
        document.addEventListener('keydown', (event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'c') {
                captureScreenshot();
                notifyUser();
            }
        });

        customButton.addEventListener('click', () => {
            captureScreenshot();
            notifyUser();
        });

        parentElement.appendChild(customButton);
    } catch (error) {
        alert("Please open a video page to use this extension. And Refresh the page.")
    }
}

createCustomButton();
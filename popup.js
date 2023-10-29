const btn = document.querySelector('.change-color-button');
const colorGrid = document.querySelector('.color-grid');
const colorValue = document.querySelector('.color-value');

btn.addEventListener('click', async () => {
    // Query the active tab in the current window
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Execute the pickColor function in the tab's context using chrome.scripting
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: pickColor,
    }, async (injectionResults) => {
        const [data] = injectionResults;
        if (data.result) {
            const color = data.result.sRGBHex;
            colorGrid.style.backgroundColor = color;
        }
    });
});

async function pickColor() {
    try {
        // Create a new EyeDropper instance and open it
        const eyeDropper = new eyeDropper();
        return await eyeDropper.open();
    } catch (error) {
        console.log(error);
    }
}

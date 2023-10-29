const btn = document.querySelector('.changeColorBtn');
const colorGrid = document.querySelector('.colorGrid');
const colorValue = document.querySelector('.colorValue');
let tab; // Define the tab variable in the outer scope

btn.addEventListener('click', async () => {
    // Get the active tab within the click event handler
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        tab = tabs[0]; // Assign the tab value here
        if (tab) {
            chrome.scripting.executeScript(
                {
                    target: { tabId: tab.id },
                    function: pickColor,
                },
                async (injectionResults) => {
                    const [data] = injectionResults;
                    if (data.result) {
                        const color = data.result.sRGBHex;
                        colorGrid.style.backgroundColor = color;
                        colorValue.innerText = color;
                        try {
                            await navigator.clipboard.writeText(color);
                        } catch (err) {
                            console.error(err);
                        }
                    }
                }
            );
        }
    });
});

async function pickColor() {
    try {
        const eyeDropper = new EyeDropper();
        const result = await eyeDropper.open();
        if (result) {
            return { result: { sRGBHex: result } };
        }
    } catch (err) {
        console.error(err);
    }
}

chrome.commands.onCommand.addListener(async (command) => {
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });


    if (!tab || !tab.id) return;

    const actionMap = {
        "zoom-in": "zoomIn",
        "zoom-out": "zoomOut",
        "zoom-reset": "zoomReset"
    };

    const action = actionMap[command];

    if (!action) return;

    chrome.tabs.sendMessage(tab.id, { action }).catch((err) => {
        console.log(err);
    });

});
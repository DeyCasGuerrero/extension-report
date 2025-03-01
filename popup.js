document.getElementById("report").addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    let reportReason = document.getElementById("report-reason").value;
    console.log(`⏳ Reportando el tweet en ${tab.title}...`);
    // alert(`⏳ Reportando el tweet en ${tab.title} con motivo: ${reportReason}`);

    async function loopReports(){
        while(true){
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: reportTweet,
                args: [reportReason]
            });
            await new Promise(resolve => setTimeout(resolve, 60000));
        }
    }
    loopReports();
});

function reportTweet(reason) {
    let numberOption = parseInt(reason, 10); 

    function logMessage(message) {
        chrome.runtime.sendMessage({ log: message });
    }

    logMessage("🔍 Buscando botón de más opciones...");
    let menuButton = document.querySelector('button[data-testid="caret"]') ||
        document.querySelector('button[aria-haspopup="menu"]') ||
        [...document.querySelectorAll("button")].find(btn =>
            btn.querySelector("svg[viewBox='0 0 24 24']") 
        );

   

    if (menuButton) {
        logMessage("✅ Botón de más opciones encontrado.");
        menuButton.click();

        setTimeout(() => {
            let reportOption = document.querySelector('div[data-testid="report"]') ||
                [...document.querySelectorAll("div[role='menuitem']")].find(el => el.textContent.includes("Reportar Tweet"));
            logMessage(`🔍 Buscando opción 'Reportar Tweet'... ${reportOption ? "Encontrado ✅" : "No encontrado ❌"}`);

            if (reportOption) {
                reportOption.click();
                setTimeout(() => {
                    let targetInput = document.querySelector(`input[aria-posinset="${numberOption}"]`);

                    if (targetInput) {
                        targetInput.checked = true;
                        logMessage(`✅ Motivo del reporte seleccionado (aria-posinset="${numberOption}").`);
                        targetInput.click();

                        setTimeout(() => {
                            let confirmButton = document.querySelector('button[data-testid="ChoiceSelectionNextButton"]');
                            if (confirmButton) {
                                confirmButton.click();

                                if (numberOption === 6) {
                                    setTimeout(() => {
                                        let spamConfirmation = document.querySelector(`button[data-testid="ocfSettingsListNextButton"]`);
                                        if (spamConfirmation) {
                                            spamConfirmation.click();
                                        }
                                    }, 1000);
                                }

                                setTimeout(() => {
                                    const option = 1;
                                    let inputSecondOption = document.querySelector(`input[aria-posinset="${option}"]`);

                                    if (inputSecondOption) {
                                        inputSecondOption.click();

                                        setTimeout(() => {
                                            let secondConfirmButton = document.querySelector('button[data-testid="ChoiceSelectionNextButton"]');
                                            if (secondConfirmButton) {
                                                secondConfirmButton.click();
                                                
                                                setTimeout(() => {
                                                    let finalConfirmButton = document.querySelector('button[data-testid="ocfSettingsListNextButton"]');
                                                    if (finalConfirmButton) {
                                                        finalConfirmButton.click();
                                                    }
                                                },1000);
                                              
                                            } else {
                                                logMessage("❌ No se encontró el botón final de envío.");
                                            }
                                        }, 1000);
                                        
                                    }
                                }, 1000);
                            } else {
                                logMessage("❌ No se encontró la opción 'Es abusivo o dañino'.");
                            }
                        }, 1000);
                    } else {
                        logMessage(`❌ No se encontró un input con aria-posinset="${numberOption}".`);
                    }
                }, 1000);
            } else {
                logMessage("❌ No se encontró la opción 'Reportar Tweet'.");
            }
        }, 1000);
    } else {
        logMessage("❌ No se encontró el botón de opciones del tweet.");
        alert("❌ No se encontró el botón de opciones del tweet.");
    }
}

// Listener en el background script (debe agregarse en background.js de la extensión)
chrome.runtime.onMessage.addListener((message) => {
    if (message.log) {
        console.log(`[TweetReport] ${message.log}`);
    }
});

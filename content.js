function reportTweet() {
    // Buscar el botón de "Reportar" en el tweet seleccionado
    const reportButton = document.querySelector('[data-testid="tweetActionButton"]');
    if (reportButton) {
        reportButton.click();

        // Esperar a que se abra el menú de reportar
        setTimeout(() => {
            // Seleccionar el botón para hacer el reporte (esto depende de la estructura actual de Twitter)
            const reportOption = document.querySelector('div[data-testid="reportOption"]');
            if (reportOption) {
                reportOption.click();

                // Esperar y hacer los siguientes pasos del reporte
                setTimeout(() => {
                    // Repetir 5 veces el proceso de reporte
                    for (let i = 0; i < 5; i++) {
                        setTimeout(() => {
                            // Ejecutar cada paso de reporte (por ejemplo, seleccionar una opción)
                            const confirmButton = document.querySelector('[data-testid="confirmButton"]');
                            if (confirmButton) {
                                confirmButton.click();
                            }
                        }, i * 2000);  // Espera entre cada intento (ajustar según sea necesario)
                    }
                }, 2000);
            }
        }, 2000);
    }
}

// Ejecutar la función de reporte al seleccionar un tweet
document.addEventListener('click', function (e) {
    const tweet = e.target.closest('[data-testid="tweet"]');
    if (tweet) {
        reportTweet();
    }
});

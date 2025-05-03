window.onload = function () {
    let graficoActual = null;

    const regionesExcluir = ["Lima", "Callao"];

    const xhr = new XMLHttpRequest();
    xhr.open("GET", "data.json", true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const datos = JSON.parse(xhr.responseText);
            console.log("Datos cargados desde JSON:", datos.map(d => d.region));

            const fechas = [];
            const datasets = [];

            datos.forEach(region => {
                if (!regionesExcluir.includes(region.region)) {
                    if (fechas.length === 0) {
                        region.confirmed.forEach(item => fechas.push(item.date));
                    }

                    const valores = region.confirmed.map(item => parseInt(item.value));
                    datasets.push({
                        label: region.region,
                        data: valores,
                        borderColor: colorAleatorio(),
                        fill: false
                    });
                }
            });

            if (datasets.length === 0) {
                alert("No se encontraron datos para las regiones.");
                return;
            }

            const ctx = document.getElementById("grafico").getContext("2d");
            if (graficoActual) {
                graficoActual.destroy();
            }

            graficoActual = new Chart(ctx, {
                type: "line",
                data: {
                    labels: fechas,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: "Crecimiento diario en provincias en Perú. (No se cuentan Lima y Callao)"
                        }
                    }
                }
            });
        }
    };

    xhr.send();

    function colorAleatorio() {
        const r = Math.floor(Math.random() * 200);
        const g = Math.floor(Math.random() * 200);
        const b = Math.floor(Math.random() * 200);
        return `rgb(${r}, ${g}, ${b})`;
    }
};

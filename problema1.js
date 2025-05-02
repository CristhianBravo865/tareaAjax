const select = document.getElementById('regiones');
const choices = new Choices(select, {
    removeItemButton: true,
    maxItemCount: 25,
    searchResultLimit: 10,
    renderChoiceLimit: 25
});

window.onload = function () {
    const boton = document.getElementById("generar");
    let graficoActual = null;

    boton.addEventListener("click", function () {
        const opciones = select.options;
        const seleccionadas = [];

        for (let i = 0; i < opciones.length; i++) {
            if (opciones[i].selected) {
                const region = opciones[i].getAttribute("data-region");
                if (region) {
                    seleccionadas.push(region);
                }
            }
        }

        if (seleccionadas.length === 0) {
            alert("Debe seleccionar al menos una región.");
            return;
        }

        console.log("Regiones seleccionadas:", seleccionadas);

        const xhr = new XMLHttpRequest();
        xhr.open("GET", "data.json", true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const datos = JSON.parse(xhr.responseText);
                console.log("Datos cargados desde JSON:", datos.map(d => d.region));

                const fechas = [];
                const datasets = [];

                seleccionadas.forEach(regionNombre => {
                    const datosRegion = datos.find(r => r.region === regionNombre);

                    if (datosRegion) {
                        console.log("Región encontrada:", regionNombre);
                        if (fechas.length === 0) {
                            datosRegion.confirmed.forEach(item => fechas.push(item.date));
                        }

                        const valores = datosRegion.confirmed.map(item => parseInt(item.value));
                        datasets.push({
                            label: regionNombre,
                            data: valores,
                            borderColor: colorAleatorio(),
                            fill: false
                        });
                    } else {
                        console.warn("Región no encontrada en data.json:", regionNombre);
                    }
                });

                if (datasets.length === 0) {
                    alert("No se encontraron datos para las regiones seleccionadas.");
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
                                text: "Comparación de casos confirmados"
                            }
                        }
                    }
                });
            }
        };

        xhr.send();
    });

    function colorAleatorio() {
        const r = Math.floor(Math.random() * 200);
        const g = Math.floor(Math.random() * 200);
        const b = Math.floor(Math.random() * 200);
        return `rgb(${r}, ${g}, ${b})`;
    }
};

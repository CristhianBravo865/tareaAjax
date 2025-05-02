const select = document.getElementById('regiones');
const choices = new Choices(select, {
    removeItemButton: true,
    maxItemCount: 25,
    searchResultLimit: 10,
    renderChoiceLimit: 25
});
window.onload = function () {
    var select = document.getElementById("regiones");
    var boton = document.getElementById("generar");

    boton.addEventListener("click", function () {
        var opciones = select.options;
        var seleccionadas = [];

        for (var i = 0; i < opciones.length; i++) {
            if (opciones[i].selected) {
                seleccionadas.push(opciones[i].getAttribute("data-region"));
            }
        }

        if (seleccionadas.length !== 2) {
            alert("Debe seleccionar 2 regiones.");
            return;
        }

        console.log("Regiones elegidas: " + seleccionadas[0] + " y " + seleccionadas[1]);

        var xhr = new XMLHttpRequest();
        xhr.open("GET", "data.json", true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var datos = JSON.parse(xhr.responseText);

                var region1 = seleccionadas[0];
                var region2 = seleccionadas[1];

                var datosRegion1 = null;
                var datosRegion2 = null;

                for (var i = 0; i < datos.length; i++) {
                    if (datos[i].region === region1) {
                        datosRegion1 = datos[i];
                    } else if (datos[i].region === region2) {
                        datosRegion2 = datos[i];
                    }
                }

                if (datosRegion1 && datosRegion2) {
                    console.log("Datos de " + region1, datosRegion1);
                    console.log("Datos de " + region2, datosRegion2);
                    var fechas = datosRegion1.confirmed.map(function (item) {
                        return item.date;
                    });
                    var valores1 = datosRegion1.confirmed.map(function (item) {
                        return parseInt(item.value);
                    });

                    var valores2 = datosRegion2.confirmed.map(function (item) {
                        return parseInt(item.value);
                    });

                    var ctx = document.getElementById("grafico").getContext("2d");

                    new Chart(ctx, {
                        type: "line",
                        data: {
                            labels: fechas,
                            datasets: [
                                {
                                    label: region1,
                                    data: valores1,
                                    borderColor: "red",
                                    fill: false
                                },
                                {
                                    label: region2,
                                    data: valores2,
                                    borderColor: "blue",
                                    fill: false
                                }
                            ]
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

                } else {
                    alert("No se encontraron datos para las regiones seleccionadas.");
                }
            }
        };

        xhr.send();

    });
};

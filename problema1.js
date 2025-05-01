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
      // aqui se cargara el json
    });
  };
  
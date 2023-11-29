window.onload = function () {
  var listaSujetos = JSON.parse(localStorage.getItem('listaSujetos')) || [];

  if (listaSujetos.length === 0) {
      var davidChoak = {
          nombre: 'David Choak',
          imagenUrl: 'https://www.postavy.cz/foto/david-choak-foto.jpg',
          tipo: 'cargado',
          dondeVive: 'Lakeview',
          descargado: '2022-01-01',
          culpabilidad: 'delincuente',
          comentario: 'Líder de la banda,Cooperó la segunda empresa privada más grande del mundo. Es más que una coincidencia que David y su hermano sean parodias de los multimillonarios de la industria petrolera de la vida real, David y Charles Koch.'
        };

        listaSujetos.push(davidChoak);
  
        localStorage.setItem('listaSujetos', JSON.stringify(listaSujetos));
    }
  
    document.getElementById('infoSujetos').addEventListener('click', function (event) {
      if (event.target.tagName.toLowerCase() === 'img') {
          var selectedIndex = obtenerIndexSujetoClickeado(event.target);
          cargarDatosSeleccionados(selectedIndex);
          mostrarFormulario('editarForm');
      }
  });
  
    mostrarSujetosAlCargar();
    cargarNombresEnSelector();
    cambiarTipo();
  };
  

  
  function mostrarOcultarImagen() {
    var overlay = document.getElementById("overlay");
    overlay.style.display = (overlay.style.display === "none" || overlay.style.display === "") ? "block" : "none";
  }
  
  function mostrarFormulario(formularioId) {
    var formularioAgregar = document.getElementById('bandaForm');
    var formularioEditar = document.getElementById('editarForm');
    var infoSujetosDiv = document.getElementById('infoSujetos');
  
    if (formularioId === 'bandaForm') {
      formularioAgregar.style.display = formularioAgregar.style.display === 'block' ? 'none' : 'block';
      formularioEditar.style.display = 'none';
      infoSujetosDiv.style.display = formularioAgregar.style.display === 'block' ? 'none' : 'block';
  
      if (infoSujetosDiv.style.display === 'block') {
        recargarpagina();
      }
    } else if (formularioId === 'editarForm') {
      formularioEditar.style.display = formularioEditar.style.display === 'block' ? 'none' : 'block';
      formularioAgregar.style.display = 'none';
      infoSujetosDiv.style.display = formularioEditar.style.display === 'block' ? 'none' : 'block';
  
      if (infoSujetosDiv.style.display === 'block') {
        recargarpagina();
      }
    }
  }
  
  
  function cambiarTipo() {
    var tipoSelect = document.getElementById('tipo');
    var descargadoDesdeInput = document.getElementById('DescargadoDesde');
    descargadoDesdeInput.disabled = (tipoSelect.value === "vivo");
  }
  
  function crearNuevoSujeto() {
    var nombre = document.getElementById('nombre').value;
    var imagenUrl = document.getElementById('imagen-url').value;
    var tipo = document.getElementById('tipo').value;
    var dondeVive = document.getElementById('DondeVive').value;
    var descargado = document.getElementById('DescargadoDesde').value;
    var culpabilidad = document.getElementById('Culpabilidad').value;
    var comentario = document.getElementById('Comentario').value;

    if (!nombre || !dondeVive || !comentario) {
        mostrarError('Por favor, completa la información.');
        return;
    }

    if (tipo !== "vivo" && !(descargado && new Date(descargado))) {
        mostrarError('Por favor, ingresa una fecha de descarga válida.');
        return;
    }


    var confirmacion = window.confirm('¿Estás seguro de crear el nuevo sujeto?');

    if (!confirmacion) {
      
        return;
    }

    var nuevoSujeto = {
        nombre: nombre,
        imagenUrl: imagenUrl,
        tipo: tipo,
        dondeVive: dondeVive,
        descargado: descargado,
        culpabilidad: culpabilidad,
        comentario: comentario
    };

    var listaSujetos = JSON.parse(localStorage.getItem('listaSujetos')) || [];
    listaSujetos.push(nuevoSujeto);
    localStorage.setItem('listaSujetos', JSON.stringify(listaSujetos));

    ocultarError();
    document.getElementById('bandaForm').reset();
    mostrarSujetosAlCargar();
    recargarpagina();
}

  
  
  function mostrarError(mensaje) {
    var errorDiv = document.getElementById('error-message');
    if (errorDiv) {
      errorDiv.innerHTML = mensaje;
      errorDiv.style.display = 'block';
    } else {
      alert(mensaje);
    }
  }
  
  function ocultarError() {
    var errorDiv = document.getElementById('error-message');
    if (errorDiv) {
      errorDiv.style.display = 'none';
    }
  }
  
  function mostrarSujetosAlCargar() {
    var listaSujetos = JSON.parse(localStorage.getItem('listaSujetos')) || [];
    var infoSujetosHTML = "";

    for (var i = 0; i < listaSujetos.length; i++) {
        var sujeto = listaSujetos[i];

        var bordeStyle = sujeto.tipo === 'vivo' ? 'border: 2px solid red;' : 'border: 2px solid green;';
        var colorNombre = sujeto.culpabilidad === 'posible-cooperador' ? 'green' : sujeto.culpabilidad === 'cooperador' ? 'orange' : 'red';

        var imagenUrl = validarURL(sujeto.imagenUrl) ? sujeto.imagenUrl : 'https://definicion.de/wp-content/uploads/2019/07/perfil-de-usuario.png';

        var descargadoFecha = sujeto.tipo === 'vivo' ? 'N/A' : (sujeto.descargado ? new Date(sujeto.descargado).toLocaleDateString() : 'N/A');

        infoSujetosHTML += "<p style='" + bordeStyle + " text-align: center;'>Nombre: <span style='color:" + colorNombre + ";'>" + sujeto.nombre + "</span><br>" +
            "<img src='" + imagenUrl + "' alt='Imagen del sujeto' style='max-width: 80%; margin: 0 auto;'></p>";
    }

    document.getElementById('infoSujetos').innerHTML = infoSujetosHTML;
}

  
function validarURL(url) {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}
  function cargarNombresEnSelector() {
    var listaSujetos = JSON.parse(localStorage.getItem('listaSujetos')) || [];
    var selectNombre = document.getElementById('select-nombre');
  
    selectNombre.innerHTML = "<option value=''>Seleccionar Nombre</option>";
  
    for (var i = 0; i < listaSujetos.length; i++) {
      var sujeto = listaSujetos[i];
      var option = document.createElement("option");
      option.value = i;
      option.text = sujeto.nombre;
      selectNombre.add(option);
    }
  }
  
  function cargarDatosSeleccionados() {
    var listaSujetos = JSON.parse(localStorage.getItem('listaSujetos')) || [];
    var selectNombre = document.getElementById('select-nombre');
    var selectedIndex = selectNombre.value;
  
    if (selectedIndex !== "") {
      var sujetoSeleccionado = listaSujetos[selectedIndex];
  
      document.getElementById('tipoedit').value = sujetoSeleccionado.tipo;
      document.getElementById('DondeViveEdit').value = sujetoSeleccionado.dondeVive;
      document.getElementById('DescargadoDesdeEdit').value = sujetoSeleccionado.descargado;
      document.getElementById('CulpabilidadEdit').value = sujetoSeleccionado.culpabilidad;
      document.getElementById('imagen-urlEdit').value = sujetoSeleccionado.imagenUrl;
      document.getElementById('ComentarioEdit').value = sujetoSeleccionado.comentario;
  
      cambiarTipoEdit();
    } else {
     
  

        document.getElementById('tipoedit').value = "";
        document.getElementById('DondeViveEdit').value = "";
        document.getElementById('DescargadoDesdeEdit').value = "";
        document.getElementById('CulpabilidadEdit').value = "";
        document.getElementById('imagen-urlEdit').value = "";
        document.getElementById('ComentarioEdit').value = "";
    }
}




function cambiarTipoEdit() {
    var tipoSelect = document.getElementById('tipoedit');
    var descargadoDesdeInput = document.getElementById('DescargadoDesdeEdit');

    descargadoDesdeInput.disabled = (tipoSelect.value === "vivo");

    if (tipoSelect.value === "vivo") {
        descargadoDesdeInput.style.display = "none";
    } else {
        descargadoDesdeInput.style.display = "block";
    }
}



function guardarEdicion() {
  var listaSujetos = JSON.parse(localStorage.getItem('listaSujetos')) || [];
  var selectNombre = document.getElementById('select-nombre');
  var selectedIndex = selectNombre.value;

  if (selectedIndex !== "") {
      var sujetoSeleccionado = listaSujetos[selectedIndex];


      var nuevoNombre = document.getElementById('nombreEdit').value.trim();
      if (!nuevoNombre) {
          alert('Por favor, ingresa un nombre.');
          return;
      }

      var dondeVive = document.getElementById('DondeViveEdit').value.trim();
      if (!dondeVive) {
          alert('Por favor, ingresa una ubicación (Donde Vive).');
          return;
      }

      var comentario = document.getElementById('ComentarioEdit').value.trim();
      if (!comentario) {
          alert('Por favor, ingresa un comentario.');
          return;
      }

   
      sujetoSeleccionado.nombre = nuevoNombre;
      sujetoSeleccionado.tipo = document.getElementById('tipoedit').value;
      sujetoSeleccionado.dondeVive = dondeVive;
      sujetoSeleccionado.descargado = document.getElementById('DescargadoDesdeEdit').value;
      sujetoSeleccionado.culpabilidad = document.getElementById('CulpabilidadEdit').value;
      sujetoSeleccionado.imagenUrl = document.getElementById('imagen-urlEdit').value;
      sujetoSeleccionado.comentario = comentario;

      listaSujetos[selectedIndex] = sujetoSeleccionado;

      localStorage.setItem('listaSujetos', JSON.stringify(listaSujetos));

      mostrarSujetosAlCargar();
      cargarNombresEnSelector();

      limpiarFormularioEdicion();
      recargarpagina();
  } else {
      alert('Por favor, selecciona un nombre para editar.');
  }
}




function limpiarFormularioEdicion() {
    document.getElementById('tipo').value = "";
    document.getElementById('DondeViveEdit').value = "";
    document.getElementById('DescargadoDesdeEdit').value = "";
    document.getElementById('CulpabilidadEdit').value = "";
    document.getElementById('imagen-urlEdit').value = "";
    document.getElementById('ComentarioEdit').value = "";
}


function recargarpagina() {
    location.reload();
}



function eliminarSujeto() {
    var listaSujetos = JSON.parse(localStorage.getItem('listaSujetos')) || [];
    var selectNombre = document.getElementById('select-nombre');
    var selectedIndex = selectNombre.value;

    if (selectedIndex !== "") {

        var confirmacion = confirm('¿Estás seguro de que deseas eliminar este sujeto?');
        if (confirmacion) {

            listaSujetos.splice(selectedIndex, 1);
        
            localStorage.setItem('listaSujetos', JSON.stringify(listaSujetos));

            mostrarSujetosAlCargar();
            cargarNombresEnSelector();

            limpiarFormularioEdicion();
            recargarpagina();
        }
    } else {

        alert('Por favor, selecciona un nombre para eliminar.');
    }

}
function obtenerIndexSujetoClickeado(elementoClickeado) {
  
  var sujetoDiv = elementoClickeado.closest('p'); 
  var infoSujetosDiv = document.getElementById('infoSujetos');
  var listaSujetos = Array.from(infoSujetosDiv.children);
  return listaSujetos.indexOf(sujetoDiv);
}

function cargarDatosSeleccionados(selectedIndex) {
  var listaSujetos = JSON.parse(localStorage.getItem('listaSujetos')) || [];
  if (selectedIndex !== -1 && selectedIndex < listaSujetos.length) {
      var sujetoSeleccionado = listaSujetos[selectedIndex];

      document.getElementById('select-nombre').value = selectedIndex;
      document.getElementById('nombreEdit').value = sujetoSeleccionado.nombre;
      document.getElementById('tipoedit').value = sujetoSeleccionado.tipo;
      document.getElementById('DondeViveEdit').value = sujetoSeleccionado.dondeVive;
      document.getElementById('DescargadoDesdeEdit').value = sujetoSeleccionado.descargado;
      document.getElementById('CulpabilidadEdit').value = sujetoSeleccionado.culpabilidad;
      document.getElementById('imagen-urlEdit').value = sujetoSeleccionado.imagenUrl;
      document.getElementById('ComentarioEdit').value = sujetoSeleccionado.comentario;

      cambiarTipoEdit();
  } else {
      limpiarFormularioEdicion();
  }
}

function mostrarInfoSujetos() {
  var infoSujetosDiv = document.getElementById('infoSujetos');
  infoSujetosDiv.style.display = 'block';


  var formularioAgregar = document.getElementById('bandaForm');
  var formularioEditar = document.getElementById('editarForm');
  formularioAgregar.style.display = 'none';
  formularioEditar.style.display = 'none';
  recargarpagina();
}

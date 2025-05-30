const searchInput = document.getElementById("search-input");
const btnBuscar = document.getElementById("btnBuscar");
const contenedorPadre = document.getElementById("contenedor-data");
const urlDragonBall = "https://dragonball-api.com/api/characters?limit=58";
const URL_DRAGON_BALL_BASE = "https://dragonball-api.com/api/characters"; // URL base, este sin límites
const btnRefresh = document.getElementById("btnRefresh");
const characterDetailModalElement = document.getElementById("characterDetailModal");
const characterDetailModal = characterDetailModalElement ? new bootstrap.Modal(characterDetailModalElement) : null;
const characterDetailContent = document.getElementById("characterDetailContent");

const cargarDatos = async (url) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Error en la API");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

const verDetalles = async (id) => {
  // Verificación de si el modal y su contenido existen antes de usarlos
  if (!characterDetailModal || !characterDetailContent) {
    console.error("Error: Elementos del modal no encontrados o modal no inicializado.");
    alert("Hubo un problema al intentar mostrar los detalles del personaje.");
    return; // Detiene la ejecución si los elementos del modal no están listos
  }

  try {
    const data = await cargarDatos(`${URL_DRAGON_BALL_BASE}/${id}`); // Reutilizamos cargarDatos

    characterDetailContent.innerHTML = `
       <img src="${data.image}" class="img-fluid mb-3" alt="${data.name}" id="modal">
       <h5>Nombre: ${data.name}</h5>
       <p><strong>Raza:</strong> ${data.race}</p>
       <p><strong>Género:</strong> ${data.gender}</p>
       <p><strong>Descripción:</strong> ${
       data.description || "No hay descripción disponible."
      }</p>
      ${
        data.transformations && data.transformations.length > 0
           ? `<p><strong>Transformaciones:</strong> ${data.transformations
              .map((t) => t.name)
              .join(", ")}</p>`
            : ""
      }
      ${
        data.originPlanet
          ? `<p><strong>Planeta de Origen:</strong> ${data.originPlanet}</p>`
          : ""
      }
      <p><strong>Ki:</strong> ${data.ki}</p>
      <p><strong>Máximo Ki:</strong> ${data.maxKi}</p>
    `;
    characterDetailModal.show(); // Mostrar el modal
  } catch (error) {
    console.error("Error en verDetalles:", error);
    alert("Error al cargar los detalles del personaje, por favor, intenta de nuevo");
  }
};
//FUNCIONESS
const limpiarResultados = () => {
  contenedorPadre.innerHTML = "";
};

const mostrarMensaje = (mensaje) => {
  limpiarResultados(); // limpia antes de mostrar el mensaje
  contenedorPadre.innerHTML = `<p class="text-white">${mensaje}</p>`;
};

const renderizarPersonajes = (characters) => {
  limpiarResultados(); // Limpiar resultados anteriores

  if (!Array.isArray(characters) || characters.length === 0) {
    mostrarMensaje("No se encontraron resultados para tu búsqueda.");
    return;
  }

  characters.forEach((personaje) => {
    contenedorPadre.innerHTML += `
      <div class="col-lg-3 col-md-4 col-sm-6 pb-3 mt-3 mb-2 d-flex justify-content-center" data-id="${personaje.id}">
        <div class="card">
          <img class="card-img-top" id="imagenP" src="${personaje.image}" alt="${personaje.name}"/>
          <div class="card-body">
            <h5 class="card-title">${personaje.name}</h5>
            <p class="card-text">${personaje.race} - ${personaje.gender}</p>
            <button class="btn btn-success btn-ver-detalles">Ver más</button>
          </div>
        </div>
      </div>
    `;
  });
};

// Función principal para buscar personajes
const buscarPersonajes = async () => {
  const nombreBusqueda = searchInput.value.trim(); //valor inputt

  limpiarResultados(); 

  // verificar campo de busqueda vacio
  if (nombreBusqueda === "") {
    mostrarMensaje("Por favor, escribe el nombre de un personaje para buscar");
    return;
  }

  mostrarMensaje("Cargando personajes..."); // Indicador visual de carga

  try {
    const data = await cargarDatos(
      `${URL_DRAGON_BALL_BASE}?name=${nombreBusqueda}`
    );

    if (!Array.isArray(data) || data.length === 0) {
      mostrarMensaje("No se encontraron personajes con ese nombre"); 
      return;
    }

    renderizarPersonajes(data); // Mostrar los personajes encontrados 
  } catch (error) {
    console.error("Error en buscarPersonajes:", error);
  }
};
const mostrarTodosLosPersonajes = async () => {
  contenedorPadre.innerHTML = ""; // Limpiar resultados anteriores

  const data = await cargarDatos(urlDragonBall);
  const dataPersonajes = data.items;

  dataPersonajes.forEach((personaje) => {
    contenedorPadre.innerHTML += `
      <div class="col-3 pb-3 mt-3 mb-2 d-flex justify-content-center" data-id=${personaje.id}>
        <div class="card">
          <img class="card-img-top" id="imagenP" src=${personaje.image} />
          <div class="card-body">
            <h5 class="card-title">${personaje.name}</h5>
            <p class="card-text">${personaje.race}  ${personaje.gender}</p>
            <button class="btn btn-success btn-ver-detalles">Ver más</button>
          </div>
        </div>
      </div>
    `;
  });
};

contenedorPadre.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-ver-detalles")) {
    // accediendo al padre mas cercano
    const cardPadre = e.target.closest(".col-3");
    const id = cardPadre.dataset.id;
    verDetalles(id);
  }
});
// eventos (boton refresh y buscar)
btnRefresh.addEventListener("click", mostrarTodosLosPersonajes);
btnBuscar.addEventListener("click", buscarPersonajes); 
// Mostrar todos los personajes automáticamente al cargar la página

window.addEventListener("DOMContentLoaded", mostrarTodosLosPersonajes);
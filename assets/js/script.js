const searchInput = document.getElementById("search-input");
const btnBuscar = document.getElementById("btnBuscar");
const contenedorPadre = document.getElementById("contenedor-data");
const urlDragonBall = "https://dragonball-api.com/api/characters?limit=58";
const URL_DRAGON_BALL_BASE = "https://dragonball-api.com/api/characters"; // URL base, este sin límites
const btnRefresh = document.getElementById("btnRefresh");

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
  try {
    const response = await fetch(`${URL_DRAGON_BALL_BASE}/${id}`);

    if (!response.ok) { 
      throw new Error("Error en la API AL OBTENER DETALLES"); 
    }

    const data = await response.json(); 

  } catch (error) {
    console.log(error);
    // Mostrar un mensaje si ocurrE un error al consultar la API
    contenedorPadre.innerHTML = `<p class="text-white">Ocurrió un error al cargar los personajes ¡Intenta nuevamente más tarde!</p>`;
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
    mostrarMensaje("Por favor, escribe el nombre de un personaje para buscar.");
    return;
  }

  mostrarMensaje("Cargando personajes..."); // Indicador visual de carga

  try {
    const data = await cargarDatos(
      `${URL_DRAGON_BALL_BASE}?name=${nombreBusqueda}`
    );

    if (!Array.isArray(data) || data.length === 0) {
      mostrarMensaje("No se encontraron personajes con ese nombre."); 
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
// fetch("https://dragonball-api.com/api/characters")
//   .then((response) => {
//     if (!response.ok) {
//       throw new Error("Error en la API");
//     }
//     return response.json();
//   })
//   .then((data) => console.log(data.items))
//   .catch((error) => console.log(error));

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

    alert(data.description); 
  } catch (error) {
    console.log(error);
  }
};
const buscarPersonajes = async () => {
  const input = searchInput.value.trim().toLowerCase();
  contenedorPadre.innerHTML = ""; // Limpiar resultados anteriores

  if (input === "") {
    contenedorPadre.innerHTML = `<p class="text-white">Escribí un personaje que desees buscar...</p>`;
    return;
  }

  try {
    const response = await fetch(`${URL_DRAGON_BALL_BASE}?name=${input}`); 

    if (!response.ok) {
      throw new Error("Error en la API al buscar personajes");
    }

    const data = await response.json(); // 'data' (un ARRAY de personajes si hay resultados)

    if (!data || data.length === 0) {
      contenedorPadre.innerHTML = `<p class="text-white">Personaje no encontrado</p>`;
    } else {
      renderizarPersonajes(data); 
    }
  } catch (error) {
    contenedorPadre.innerHTML = `<p class="text-white">Error al buscar personajes</p>`;
    console.log(error);
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
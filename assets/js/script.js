// fetch("https://dragonball-api.com/api/characters")
//   .then((response) => {
//     if (!response.ok) {
//       throw new Error("Error en la API");
//     }
//     return response.json();
//   })
//   .then((data) => console.log(data.items))
//   .catch((error) => console.log(error));

const btnBuscar = document.getElementById("btn-buscar");
const contenedorPadre = document.getElementById("contenedor-data");
const urlDragonBall = "https://dragonball-api.com/api/characters?limit=58";
const urlHarryPotter = "https://hp-api.onrender.com/api/characters";
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
    const response = await fetch(`${urlDragonBall}/${id}`);

    if (!response.ok) {
      throw new Error("Error en la API");
    }

    const data = await response.json();

    alert(data.description);
  } catch (error) {
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

// boton refesh para volver a cargar a todos los personajes (llama a la API nuevamente)
btnRefresh.addEventListener("click", mostrarTodosLosPersonajes);

contenedorPadre.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-ver-detalles")) {
    // accediendo al padre mas cercano
    const cardPadre = e.target.closest(".col-3");
    const id = cardPadre.dataset.id;
    verDetalles(id);
  }
});

const buscarPersonaje = async () => {
  const input = document.getElementById("search-input").value.trim().toLowerCase();
  contenedorPadre.innerHTML = ""; // Limpiar resultados anteriores

  if (input === "") {
    contenedorPadre.innerHTML = `<p class="text-white"> escribe un personaje a buscar</p>`;
    return;
  }

  try {
    const response = await fetch(`https://dragonball-api.com/api/characters?name=${input}`);

    if (!response.ok) {
      throw new Error("Error en la API");
    }

    const data = await response.json();

    if (data.items.length === 0) {
      contenedorPadre.innerHTML = `<p class="text-white"> Personaje no encontrado.</p>`;
    } else {
      const personaje = data.items[0];
      contenedorPadre.innerHTML = `
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
    }
  } catch (error) {
    contenedorPadre.innerHTML = `<p class="text-white">🚫 Error al conectar con la API.</p>`;
    console.log(error);
  }
};
// Mostrar todos los personajes automáticamente al cargar la página

window.addEventListener("DOMContentLoaded", mostrarTodosLosPersonajes);
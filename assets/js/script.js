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
      throw new error("Error en la API");
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
    // const response2 = await fetch(
    //   `https://dragonball-api.com/api/characters/${id}`
    // );

    if (!response.ok) {
      throw new error("Error en la API");
    }

    const data = await response.json();

    alert(data.description);
  } catch (error) {
    console.log(error);
  }
};
// boton refesh para volver a cargar a todos los personajes
btnRefresh.addEventListener("click", async () => {
  const data = await cargarDatos(urlDragonBall);
  const dataPersonajes = data.items;

  console.log(dataPersonajes);

  dataPersonajes.forEach((personaje) => {   //carta de los personajes
    contenedorPadre.innerHTML += `
          <div class="col-3 pb-3 mt-3 mb-2 d-flex justify-content-center" data-id=${personaje.id}>
            <div class="card">
              <img
                class="card-img-top" id="imagenP"
                src=${personaje.image}
              />
              <div class="card-body">
                <h5 class="card-title">${personaje.name}</h5>
                <p class="card-text">${personaje.race}  ${personaje.gender}</p>
                <button class="btn btn-success btn-ver-detalles">Ver más</button>
              </div>
            </div>
          </div>
      `;
  });
});

contenedorPadre.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-ver-detalles")) {
    // accediendo al padre mas cercano
    const cardPadre = e.target.closest(".col-3");
    const id = cardPadre.dataset.id;
    verDetalles(id);
  }
});
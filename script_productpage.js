// Ottieni l'ID del prodotto dalla query string nell'URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('productId');

// API
// URL dell'API per ottenere i dettagli del prodotto
const apiUrl = `http://localhost:5050/api/products/${productId}`;
// Token di autorizzazione per l'API
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDdmODk4M2I5YcBnNzAwMTQ0ODUwNTQiLCJpYXQiOjE2ODYwNzk4NzUsImV4cCI6MTY4NzI4OTQ3NX0.rUudpnckoFxoSB1xIqgCj3b3fIqvRgcxHtwMPt4Jm50';

// Funzione per ottenere il prodotto
async function getProductDetails() {
  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    if (response.ok) {
      const product = await response.json();
      displayProductDetails(product);
      // Aggiungi il gestore di eventi per il voto
      handleVoteClick(product._id);
    } else {
      console.error('Errore durante il recupero dei dettagli del prodotto:', response.status);
    }
  } catch (error) {
    console.error('Errore durante il recupero dei dettagli del prodotto:', error);
  }
}

// Carica la pagina e chiama la funzione getProductDetails()
document.addEventListener('DOMContentLoaded', getProductDetails);

// Funzione per visualizzare i dettagli del prodotto nella pagina
function displayProductDetails(product) {
  const productContainer = document.getElementById('productDetails');
  const productImageContainer = document.getElementById('productImage');

  // Dichiarazione della variabile coverImageTemplate
  let coverImageTemplate = '';

  // Determina il template dell'immagine di copertina in base al brand del prodotto
  switch (product.brand) {
    case 'Category // Playstation':
      coverImageTemplate = 'ps5_cover_template';
      break;
    case 'Category // Xbox':
      coverImageTemplate = 'xbox_cover_template';
      break;
    case 'Category // Nintendo':
      coverImageTemplate = 'nintendo_cover_template';
      break;
    case 'Category // PC':
      coverImageTemplate = 'pc_cover_template';
      break;
    default:
      coverImageTemplate = '';
      break;
  }

  // Costruzione elemento prodotto HTML
  const productElement = document.createElement('div');
  productElement.classList.add('mb-4');
  productElement.innerHTML = `
    <div class="container">
      <div class="row">
        <div class="col-md-8 col-sm-8 col-xs-8">
          <h1 class="my-3">${product.name}</h1>
          <h3 class="my-3">${product.price}.99€</h3>
          <p class="my-3">${product.description}</p>
          <a href="#" class="btn btn-outline-warning my-1"><small>${product.author}</small><i class="fa-solid fa-user ms-2"></i></a>
          <p class="card-text ${getBrandClass(product.brand)} text-white rounded p-2 my-3">
            <small>${product.brand}</small>
          </p>
        </div>
        <div class="col-md-4 col-sm-4 col-xs-4 text-center">
        <button id="vote-button-${product._id}" class="btn btn-outline-dark border-3 px-4 pt-3">
        <i class="h2 fa-solid fa-sort-up"><br><p id="upvote-count-${product._id}" class="upvote-count mb-1">${product.voteCount}</p><h5 class="my-2">Desires</h5></i>
      </button>
        </div>
      </div>
    </div>
  `;

  const productImage = document.createElement('div');
  productImage.classList.add('position-relative', 'shadow-hover');
  productImage.innerHTML = `
    <div class="position-relative shadow-hover mx-3">
      <img src="${product.imageUrl}" class="img-fluid" alt="${product.name}">
      <img src="assets/cover/${coverImageTemplate}.png" class="img-fluid position-absolute top-0 start-0" alt="${product.name}">
    </div>
  `;

  // Aggiunge l'elemento prodotto al container dei prodotti nell'HTML
  productContainer.appendChild(productElement);
  productImageContainer.appendChild(productImage);
}

// Funzione per restituire la classe di stile in base al brand del prodotto
function getBrandClass(brand) {
  switch (brand) {
    case 'Category // Playstation':
      return 'bg-primary';
    case 'Category // Nintendo':
      return 'bg-danger';
    case 'Category // Xbox':
      return 'bg-success';
    case 'Category // PC':
      return 'bg-secondary';
    default:
      return 'bg-primary';
  }
}

// Funzione per gestire il click sul pulsante di voto
function handleVoteClick(productId) {
  const voteButton = document.querySelector(`#vote-button-${productId}`);
  const upvoteCount = document.querySelector(`#upvote-count-${productId}`);
  
  voteButton.addEventListener("click", async () => {
    try {
      // Invia una richiesta al server per registrare il voto
      const response = await fetch(`http://localhost:5050/api/products/vote/${productId}`, {
        method: "POST",
        headers: {
          'Authorization': 'Bearer ' + token
        },
      });

      if (response.ok) {
        const data = await response.json();
        upvoteCount.textContent = data.voteCount;
        voteButton.disabled = true;
        voteButton.classList.remove("btn-outline-dark");
        voteButton.classList.add("btn-outline-dar-active");
      } else {
        console.error("Errore durante il voto:", response.status);
        alert("Errore durante il voto. Riprova più tardi.");
      }
    } catch (error) {
      console.error("Errore durante il voto:", error);
      alert("Errore durante il voto. Riprova più tardi.");
    }
  });
}

// Funzione per gestire l'ombra del menu
window.addEventListener("scroll", function () {
  var navbar = document.querySelector(".sticky-top");

  if (window.scrollY > 0) {
    navbar.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
  } else {
    navbar.style.boxShadow = "none";
  }
});
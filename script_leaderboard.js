// API
// URL dell'API per ottenere i dettagli del prodotto
const apiUrl = 'http://localhost:5050/api/products';
// Token di autorizzazione per l'API
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDdmODk4M2I5YzBmNzAwMTQ0ODUwNTQiLCJpYXQiOjE2ODYwNzk4NzUsImV4cCI6MTY4NzI4OTQ3NX0.rUudpnckoFxoSB1xIqgCj3b3fIqvRgcxHtwMPt4Jm50';

// Funzione per ottenere i prodotti
async function getProducts() {
    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        if (response.ok) {
            const products = await response.json();
            if (Array.isArray(products)) {
                const sortedProducts = sortProductsByVoteCount(products); // Ordina i prodotti
                displayProducts(sortedProducts); // Visualizza i prodotti ordinati
            } else {
                console.error('Dati non validi restituiti dall\'API');
            }
        } else {
            console.error('Errore durante il recupero dei prodotti:', response.status);
        }
    } catch (error) {
        console.error('Errore durante il recupero dei prodotti:', error);
    }
}

// Carica la pagina e chiama la funzione getProducts()
document.addEventListener('DOMContentLoaded', getProducts);

// Funzione per ordinare i prodotti in base al numero di voti (ordine decrescente)
function sortProductsByVoteCount(products) {
    return products.sort((a, b) => b.voteCount - a.voteCount);
}

// Funzione per visualizzare tutti i prodotti nella pagina
function displayProducts(products) {
    // Ottiene il riferimento al contenitore dei prodotti
    const productsContainer = document.getElementById('productList');

    // Svuota completamente il contenitore dei prodotti
    productsContainer.innerHTML = '';

    // Cicla attraverso la lista dei prodotti e aggiunge ciascun prodotto al contenitore productList
    products.forEach((product, index) => {
        // Generazione degli elementi HTML per visualizzare i dettagli del prodotto
        const productElement = document.createElement('div');
        productElement.classList.add('mb-5');
        productElement.innerHTML = `
        <div class="container">
        <div class="row">
        <div class="col-md-1 col-sm-1 col-xs-1 align-self-center justify-content-center">
    <div class="d-flex align-items-center justify-content-center">
        <h1 class="p-0">${index + 1}</h1>
    </div>
</div>
            <div class="col-md-3 col-sm-6 col-xs-12">
                <div class="position-relative shadow-hover mx-3">
                    <img src="${product.imageUrl}" class="img-fluid" alt="${product.name}">
                    <img src="assets/cover/${getCoverImageTemplate(product.brand)}.png" class="img-fluid position-absolute top-0 start-0" alt="${product.name}">
                </div>
            </div>
            <div class="col-md-4 col-sm-6 col-xs-12">
                <div class="mb-4">
                    <h3 class="my-3">${product.name}</h3>
                    <h3 class="my-3">${product.price}.99€</h3>
                    <p class="my-3">${product.description}</p>
                    <p class="card-text ${getBrandClass(product.brand)} text-white rounded p-2 my-3">
                        <small>${product.brand}</small>
                    </p>
                    <div class="mb-4">
                        <a href="#" class="btn btn-outline-warning my-1"><small>${product.author}</small><i class="fa-solid fa-user ms-2"></i></a>
                        <a href="productpage.html?productId=${product._id}" class="btn btn-secondary"><small>View</small><i class="fa-solid fa-eye ms-2"></i></a>
                    </div>
                </div>
            </div>
            <div class="col-md-4 col-sm-12 col-xs-12 align-self-center justify-content-center">
               <div class="d-flex align-self-center justify-content-center">
               <button id="vote-button-${product._id}" class="btn btn-outline-dark border-3 px-4 pt-3">
               <i class="h2 fa-solid fa-sort-up"><br><p id="upvote-count-${product._id}" class="upvote-count mb-1">${product.voteCount}</p><h5 class="my-2">Desires</h5></i>
             </button>
                </div>
            </div>
        </div>
        <div>
                <hr>
            </div>
    </div>
`;

        // Aggiunge l'elemento prodotto al container dei prodotti nell'HTML
        productsContainer.appendChild(productElement);
        // Aggiungi il gestore di eventi per il voto
        handleVoteClick(product._id);
    });
}

// Determina il template dell'immagine di copertina in base al brand del prodotto
function getCoverImageTemplate(brand) {
    switch (brand) {
        case 'Category // Playstation':
            return 'ps5_cover_template';
        case 'Category // Xbox':
            return 'xbox_cover_template';
        case 'Category // Nintendo':
            return 'nintendo_cover_template';
        case 'Category // PC':
            return 'pc_cover_template';
        default:
            return '';
    }
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

// Funzione per ombra menu
window.addEventListener("scroll", function () {
    var navbar = document.querySelector(".sticky-top");

    if (window.scrollY > 0) {
      navbar.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    } else {
      navbar.style.boxShadow = "none";
    }
  });



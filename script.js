// API
// URL dell'API per ottenere i dettagli del prodotto
const apiUrl = 'http://localhost:5050/api/products';
// Token di autorizzazione per l'API
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDdmODk4M2I5YzBmNzAwMTQ0ODUwNTQiLCJpYXQiOjE2ODYwNzk4NzUsImV4cCI6MTY4NzI4OTQ3NX0.rUudpnckoFxoSB1xIqgCj3b3fIqvRgcxHtwMPt4Jm50';
let productId = ''; // Dichiarazione della variabile productId
let products = []; // Dichiarazione dell'array products

// Funzione per ottenere i prodotti
async function getProducts() {
    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        if (response.ok) {
            // Ottiene i prodotti dalla risposta
            products = await response.json();

            // Seleziona il container dei prodotti nell'HTML
            const productsContainer = document.getElementById('productsContainer');

            // Resetta il contenuto del container dei prodotti
            productsContainer.innerHTML = '';

            // Genera gli elementi HTML dei prodotti
            products.forEach(product => {
                const productElement = document.createElement('div');
                productElement.classList.add('col-md-4', 'col-sm-6', 'col-xs-12');

                // Determina il template dell'immagine di copertina in base al brand del prodotto
                let coverImageTemplate = '';

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
                productElement.innerHTML = `
          <div class="card border-0 mt-5">
            <div class="d-none text-center mb-3" id="manageButtons">
            <a href="#" class="btn btn-warning me-3" onclick="openUpdateForm('${product._id}', products, event)"><i class="fa-solid fa-pen-to-square"></i></a>
              <a href="#" class="btn btn-danger me-3" onclick="deleteProduct('${product._id}')"><i class="fa-solid fa-trash"></i></a>
            </div>
            <div class="position-relative shadow-hover mx-3">
              <img src="${product.imageUrl}" class="img-fluid" alt="${product.name}">
              <img src="assets/cover/${coverImageTemplate}.png" class="img-fluid position-absolute top-0 start-0" alt="${product.name}">
            </div>
            <div class="card-body p-0 mt-3">
              <h4 class="card-title">${product.price}.99€</h4>
              <p class="card-text m-0">${product.name}</p>
              <p class="card-text"><small>${product.description}</small></p>
              <p class="card-text ${getBrandClass(product.brand)} text-white rounded p-2 m-0">
                <small>${product.brand}</small> </p>
              <div class="d-flex flex-md-wrap flex-sm-wrap justify-content-between">
                <a href="#" class="btn btn-outline-warning mt-3"><small>${product.author}</small><i class="fa-solid fa-user ms-2"></i></a>
                <a href="productpage.html?productId=${product._id}" class="btn btn-secondary mt-3"><small>View</small><i class="fa-solid fa-eye ms-2"></i></a>
              </div>
            </div>
          </div>
        `;

                // Aggiunge l'elemento prodotto al container dei prodotti nell'HTML
                productsContainer.appendChild(productElement);
            });
        } else {
            console.error('Errore durante il recupero dei prodotti:', response.status);
        }
    } catch (error) {
        console.error('Errore durante il recupero dei prodotti:', error);
    }
}

// Carica la pagina e chiama la funzione getProducts()
document.addEventListener('DOMContentLoaded', getProducts);

// Aggiunta prodotti
async function addProduct() {
    // Ottiene i valori dai campi di input
    const imageProduct = document.getElementById('imageProduct').value;
    const priceProduct = document.getElementById('priceProduct').value;
    const nameProduct = document.getElementById('nameProduct').value;
    const descriptionProduct = document.getElementById('descriptionProduct').value;
    const categoryProduct = document.getElementById('exampleFormControlSelect1').value;
    const authorProduct = document.getElementById('authorProduct').value;

    // Costruisce l'oggetto prodotto
    const product = {
        imageUrl: imageProduct,
        price: priceProduct,
        name: nameProduct,
        description: descriptionProduct,
        brand: `Category // ${categoryProduct}`,
        author: authorProduct
    };

    try {
        // Effettua la richiesta di aggiunta all'API
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });

        if (response.ok) {
            // Prodotto aggiunto con successo all'API
            console.log('Prodotto aggiunto:', product);

            // Chiude la form e ripristina i valori inseriti
            closeForm();
            document.getElementById('imageProduct').value = '';
            document.getElementById('priceProduct').value = '';
            document.getElementById('nameProduct').value = '';
            document.getElementById('descriptionProduct').value = '';
            document.getElementById('exampleFormControlSelect1').value = '';
            document.getElementById('authorProduct').value = '';

            // Aggiorna l'array dei prodotti con i nuovi dati
            await getProducts();
        } else {
            // Gestisce la risposta non valida
            console.error('Errore durante l\'aggiunta del prodotto:', response.status);
        }
    } catch (error) {
        // Gestisce gli errori di rete o altre eccezioni
        console.error('Errore durante l\'aggiunta del prodotto:', error);
    }
}

// Funzione per l'aggiornamento del prodotto
async function updateProduct() {
    // Ottiene i valori dai campi di input
    const updateImageProduct = document.getElementById('updateImageProduct').value;
    const updatePriceProduct = document.getElementById('updatePriceProduct').value;
    const updateNameProduct = document.getElementById('updateNameProduct').value;
    const updateDescriptionProduct = document.getElementById('updateDescriptionProduct').value;
    const updateCategoryProduct = document.getElementById('updateExampleFormControlSelect1').value;
    const updateAuthorProduct = document.getElementById('updateAuthorProduct').value;

    // Costruisce l'oggetto prodotto aggiornato
    const updatedProduct = {
        imageUrl: updateImageProduct,
        price: updatePriceProduct,
        name: updateNameProduct,
        description: updateDescriptionProduct,
        brand: `Category // ${updateCategoryProduct}`,
        author: updateAuthorProduct
    };

    try {
        // Effettua la richiesta di aggiornamento all'API
        const response = await fetch(apiUrl + '/' + productId, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedProduct)
        });

        if (response.ok) {
            // Prodotto aggiornato con successo
            console.log('Prodotto aggiornato:', updatedProduct);

            // Chiude la form di aggiornamento e aggiorna l'elenco dei prodotti
            closeForm();
            await getProducts();
        } else {
            // Gestisce la risposta non valida
            console.error('Errore durante l\'aggiornamento del prodotto:', response.status);
        }
    } catch (error) {
        // Gestisce gli errori di rete o altre eccezioni
        console.error('Errore durante la richiesta di aggiornamento del prodotto:', error);
    }
}


// Funzione per aprire la form di modifica
function openUpdateForm(id, products) {
    // Recupera il prodotto corrispondente all'id
    const product = products.find(p => p._id === id);

    // Verifica se il prodotto è stato trovato
    if (product) {
        // Imposta i valori dei campi della form di aggiornamento con i valori del prodotto
        document.getElementById('updateImageProduct').value = product.imageUrl;
        document.getElementById('updatePriceProduct').value = product.price;
        document.getElementById('updateNameProduct').value = product.name;
        document.getElementById('updateDescriptionProduct').value = product.description;
        document.getElementById('updateAuthorProduct').value = product.author;

        // Imposta il valore predefinito per il campo "Categoria"
        const categorySelect = document.getElementById('updateExampleFormControlSelect1');
        for (let i = 0; i < categorySelect.options.length; i++) {
            if (categorySelect.options[i].value === product.brand.replace('Category // ', '')) {
                categorySelect.selectedIndex = i;
                break;
            }
        }

        // Assegna il valore di productId alla variabile globale
        productId = id;

        // Nasconde la form di gestione e mostra la form di aggiornamento
        document.getElementById('updateForm').classList.add('d-none');
        document.getElementById('updateForm').classList.remove('d-none');
    } else {
        console.error('Prodotto non trovato');
    }

    // Impedisce l'evento di default del link
    event.preventDefault();
}

// Funzione per l'eliminazione del prodotto
async function deleteProduct(productId) {
    try {
        // Effettua la richiesta di eliminazione all'API
        const response = await fetch(apiUrl + '/' + productId, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        if (response.ok) {
            // Prodotto eliminato con successo
            console.log('Prodotto eliminato');

            // Chiude la form di aggiornamento e aggiorna l'elenco dei prodotti
            closeForm();
            await getProducts();
        } else {
            // Gestisce la risposta non valida
            console.error('Errore durante l\'eliminazione del prodotto:', response.status);
        }
    } catch (error) {
        // Gestisce gli errori di rete o altre eccezioni
        console.error('Errore durante l\'eliminazione del prodotto:', error);
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


// Funzione per aprire un modulo specifico
function openForm(formName) {
    if (formName === 'add') {
        // Se il nome del modulo è 'add'
        document.getElementById('joinForm').classList.add('d-none');
        document.getElementById('myForm').classList.remove('d-none');
        document.getElementById('updateForm').classList.add('d-none');
        // Se il nome del modulo è 'manage'
    } else if (formName === 'manage') {
        document.getElementById('joinForm').classList.add('d-none');
        document.getElementById('myForm').classList.add('d-none');
        document.getElementById('updateForm').classList.remove('d-none');

        // Mostra i bottoni di gestione
        const manageButtons = document.querySelectorAll('#manageButtons');
        manageButtons.forEach(button => button.classList.remove('d-none'));
    }
}

// Funzione per chiudere il modulo
function closeForm() {
    document.getElementById('joinForm').classList.remove('d-none');
    document.getElementById('myForm').classList.add('d-none');
    document.getElementById('updateForm').classList.add('d-none');

    // Mostra i bottoni di gestione
    const manageButtons = document.querySelectorAll('#manageButtons');
    manageButtons.forEach(button => button.classList.add('d-none'));
}

// Funzione per filtrare i prodotti in base alla ricerca
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', filterProducts);

function filterProducts() {
    // Ottieni il valore di ricerca
    const searchValue = searchInput.value.toLowerCase();
    // Ottieni tutti gli elementi con classe 'card'
    const cards = document.getElementsByClassName('card');

    // Itera su ogni elemento 'card'
    Array.from(cards).forEach(card => {
        // Ottieni il testo del nome del prodotto all'interno della 'card' e convertilo in minuscolo
        const productName = card.querySelector('.card-text').textContent.toLowerCase();

        // Se il nome del prodotto include il valore di ricerca, mostra l'elemento 'card'
        if (productName.includes(searchValue)) {
            card.parentNode.style.display = 'block';
        } else {
            // Altrimenti, nascondi l'elemento 'card'
            card.parentNode.style.display = 'none';
        }
    });
}

// Funzione per filtrare i prodotti in base a ciascun bottone di filtro
const cards = document.getElementsByClassName('card');

// Aggiungi un listener di evento a ciascun bottone di filtro
document.getElementById('playstationButton').addEventListener('click', function () {
    filterProductsByBrand('Category // Playstation', this);
});

document.getElementById('nintendoButton').addEventListener('click', function () {
    filterProductsByBrand('Category // Nintendo', this);
});

document.getElementById('xboxButton').addEventListener('click', function () {
    filterProductsByBrand('Category // Xbox', this);
});

document.getElementById('pcButton').addEventListener('click', function () {
    filterProductsByBrand('Category // PC', this);
});

function filterProductsByBrand(brand, clickedButton) {
    // Controllo se il bottone è già attivo
    const isActive = clickedButton.classList.contains('active');

    Array.from(cards).forEach(card => {
        const brandElement = card.querySelector('.card-text.text-white.rounded.p-2.m-0 small');
        const cardBrand = brandElement ? brandElement.textContent.trim() : '';

        // Verifica se il brand corrisponde al filtro selezionato
        if (isActive || cardBrand === brand) {
            // Mostra la colonna se il brand corrisponde al filtro o se il bottone è già attivo
            card.parentNode.style.display = 'block';
        } else {
            // Nascondi la colonna se il brand non corrisponde al filtro
            card.parentNode.style.display = 'none';
        }
    });

    // Disattiva tutti gli altri bottoni di filtro
    const filterButtons = document.getElementsByClassName('btn-toggle');
    Array.from(filterButtons).forEach(button => {
        if (button !== clickedButton) {
            button.classList.remove('active');
            button.setAttribute('aria-pressed', 'false');
        }
    });

    // Attiva o disattiva il bottone di filtro selezionato
    clickedButton.classList.toggle('active');
    clickedButton.setAttribute('aria-pressed', clickedButton.classList.contains('active') ? 'true' : 'false');
}

// Funzione per la validazione dell'URL dell'immagine
function validateImageProduct() {
    const imageInput = document.getElementById("imageProduct"); // Per il modulo di aggiunta prodotto
    const imageInputUpdate = document.getElementById("updateImageProduct"); // Per il modulo di modifica prodotto
    const imageError = document.getElementById("imageProductError");
    const imageValue = imageInput ? imageInput.value : imageInputUpdate.value;

    // Validazione con le regole definite nella convalida Express
    if (!imageValue.match(/^(http|https):\/\/[^ "]+$/)) {
        imageError.textContent = "Image URL must be a valid URL string";
    } else {
        imageError.textContent = "";
    }
}

// Funzione per la validazione dell'URL dell'immagine nel modulo di aggiornamento
function validateUpdateImageProduct() {
    const imageInputUpdate = document.getElementById("updateImageProduct");
    const imageErrorUpdate = document.getElementById("updateImageProductError");
    const imageValueUpdate = imageInputUpdate.value;

    // Validazione con le regole definite nella convalida Express
    if (!imageValueUpdate.match(/^(http|https):\/\/[^ "]+$/)) {
        imageErrorUpdate.textContent = "Image URL must be a valid URL string";
    } else {
        imageErrorUpdate.textContent = "";
    }
}

// Funzione per la validazione del campo "Price" nel modulo di aggiunta prodotto
function validatePriceProduct() {
    const priceInput = document.getElementById("priceProduct");
    const priceError = document.getElementById("priceProductError");
    const priceValue = priceInput.value;

    // Validazione con le regole definite nella convalida Express
    if (isNaN(parseFloat(priceValue)) || parseFloat(priceValue) < 0.01 || parseFloat(priceValue) > 9999.99) {
        priceError.textContent = "Price must be a valid positive number with a maximum of 9999.99";
    } else {
        priceError.textContent = "";
    }
}

// Funzione per la validazione del campo "Name" nel modulo di aggiunta prodotto
function validateNameProduct() {
    const nameInput = document.getElementById("nameProduct");
    const nameError = document.getElementById("nameProductError");
    const nameValue = nameInput.value;

    // Validazione con le regole definite nella convalida Express
    if (nameValue.length > 50) {
        nameError.textContent = "Name must be less than or equal to 50 characters";
    } else {
        nameError.textContent = "";
    }
}

// Funzione per la validazione del campo "Description" nel modulo di aggiunta prodotto
function validateDescriptionProduct() {
    const descriptionInput = document.getElementById("descriptionProduct");
    const descriptionError = document.getElementById("descriptionProductError");
    const descriptionValue = descriptionInput.value;

    // Validazione con le regole definite nella convalida Express
    if (descriptionValue.length > 30) {
        descriptionError.textContent = "Description must be less than or equal to 30 characters";
    } else {
        descriptionError.textContent = "";
    }
}

// Funzione per la validazione del campo "Author" nel modulo di aggiunta prodotto
function validateAuthorProduct() {
    const authorInput = document.getElementById("authorProduct");
    const authorError = document.getElementById("authorProductError");
    const authorValue = authorInput.value;

    // Validazione con le regole definite nella convalida Express
    if (authorValue.length > 8) {
        authorError.textContent = "Author must be less than or equal to 8 characters";
    } else {
        authorError.textContent = "";
    }
}

// Funzione per la validazione del campo "Price" nel modulo di aggiornamento
function validateUpdatePriceProduct() {
    const priceInputUpdate = document.getElementById("updatePriceProduct");
    const priceErrorUpdate = document.getElementById("updatePriceProductError");
    const priceValueUpdate = priceInputUpdate.value;

    // Validazione con le regole definite nella convalida Express
    if (isNaN(parseFloat(priceValueUpdate)) || parseFloat(priceValueUpdate) < 0.01 || parseFloat(priceValueUpdate) > 9999.99) {
        priceErrorUpdate.textContent = "Price must be a valid positive number with a maximum of 9999.99";
    } else {
        priceErrorUpdate.textContent = "";
    }
}

// Funzione per la validazione del campo "Name" nel modulo di aggiornamento
function validateUpdateNameProduct() {
    const nameInputUpdate = document.getElementById("updateNameProduct");
    const nameErrorUpdate = document.getElementById("updateNameProductError");
    const nameValueUpdate = nameInputUpdate.value;

    // Validazione con le regole definite nella convalida Express
    if (nameValueUpdate.length > 50) {
        nameErrorUpdate.textContent = "Name must be less than or equal to 50 characters";
    } else {
        nameErrorUpdate.textContent = "";
    }
}

// Funzione per la validazione del campo "Description" nel modulo di aggiornamento
function validateUpdateDescriptionProduct() {
    const descriptionInputUpdate = document.getElementById("updateDescriptionProduct");
    const descriptionErrorUpdate = document.getElementById("updateDescriptionProductError");
    const descriptionValueUpdate = descriptionInputUpdate.value;

    // Validazione con le regole definite nella convalida Express
    if (descriptionValueUpdate.length > 30) {
        descriptionErrorUpdate.textContent = "Description must be less than or equal to 30 characters";
    } else {
        descriptionErrorUpdate.textContent = "";
    }
}

// Funzione per la validazione del campo "Author" nel modulo di aggiornamento
function validateUpdateAuthorProduct() {
    const authorInputUpdate = document.getElementById("updateAuthorProduct");
    const authorErrorUpdate = document.getElementById("updateAuthorProductError");
    const authorValueUpdate = authorInputUpdate.value;

    // Validazione con le regole definite nella convalida Express
    if (authorValueUpdate.length > 8) {
        authorErrorUpdate.textContent = "Author must be less than or equal to 8 characters";
    } else {
        authorErrorUpdate.textContent = "";
    }
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
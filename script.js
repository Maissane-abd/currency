// Clé API pour accéder aux taux de conversion (à sécuriser côté backend en production)
const API_KEY = 'f58ee34a4246d251508423b9';

// Récupération des éléments du DOM
const selectSource = document.getElementById('select-source'); // Menu déroulant pour la devise source
const selectCible = document.getElementById('select-devise');  // Menu déroulant pour la devise cible
const amount = document.getElementById('montant');             // Champ de saisie du montant à convertir

// Objet global qui contiendra les taux de conversion récupérés
let exchangerate = {};

/**
 * Fonction asynchrone pour récupérer la liste des devises et les taux de change
 * depuis l'API ExchangeRate. Elle remplit dynamiquement les deux sélecteurs.
 */
async function fetchCurrencies() {
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`);
    const data = await response.json();

    const currencies = Object.keys(data.conversion_rates); // Récupère les codes devises (ex : USD, EUR, JPY)

    // Remplissage dynamique des menus déroulants avec les devises
    currencies.forEach(currency => {
        const option1 = document.createElement("option");
        option1.value = currency;
        option1.textContent = currency;
        selectSource.appendChild(option1);

        const option2 = document.createElement("option");
        option2.value = currency;
        option2.textContent = currency;
        selectCible.appendChild(option2);
    });

    exchangerate = data.conversion_rates; // Stockage local des taux de change

    // Valeurs par défaut pour les champs
    selectCible.value = "USD";
    selectSource.value = "EUR";
    amount.value = 10;
}

/**
 * Fonction de conversion appelée à chaque changement de valeur ou de devise.
 * Elle effectue la conversion à partir des taux récupérés.
 */
function convert() {
    const source = selectSource.value;
    const cible = selectCible.value;
    const montant = parseFloat(amount.value);
    const result = document.getElementById("result");

    // Vérifie si le montant saisi est bien un nombre
    if (isNaN(montant)) {
        result.textContent = "...";
        return;
    }

    // Vérifie que les taux pour les deux devises existent, puis effectue la conversion
    if (exchangerate[source] && exchangerate[cible]) {
        const usdAmount = montant / exchangerate[source];      // Conversion vers USD comme base intermédiaire
        const converted = usdAmount * exchangerate[cible];     // Conversion du montant en devise cible
        result.textContent = `${converted.toFixed(2)} ${cible}`; // Affichage du résultat formaté
    }
}

// Ajout des écouteurs d'événements pour déclencher la conversion en temps réel
selectSource.addEventListener('change', convert);
selectCible.addEventListener('change', convert);
amount.addEventListener('input', convert);

// Initialisation : récupération des devises puis première conversion
fetchCurrencies().then(convert);



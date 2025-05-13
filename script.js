const API_KEY = 'f58ee34a4246d251508423b9';
const selectSource = document.getElementById('select-source');
const selectCible = document.getElementById('select-devise');
const amount = document.getElementById('montant');

let exchangerate = {};




async function fetchCurrencies() {
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`);
    const data = await response.json();

    const currencies = Object.keys(data.conversion_rates);
    currencies.forEach(currency => {
        const option1 = document.createElement("option")
        option1.value = currency;
        option1.textContent = currency;
        selectSource.appendChild(option1);

        const option2 = document.createElement("option")
        option2.value = currency;
        option2.textContent = currency;
        selectCible.appendChild(option2);        
    })

    exchangerate = data.conversion_rates;
    selectCible.value = "USD";
    selectSource.value = "EUR";
    amount.value = 10;
  
}

function convertir (){
    const source = selectSource.value;
    const cible = selectCible.value;
    const montant = parseFloat(amount.value);
    const result = document.getElementById("result")

    if(isNaN(montant)){
        result.textContent = "...";
        return;
    }

    if (exchangerate[source] && exchangerate[cible]){
        const usdAmount = montant / exchangerate[source];
        const converted = usdAmount * exchangerate[cible];
        result.textContent = `${converted.toFixed(2)} ${cible}`;
        return;
    }

    
}

selectSource.addEventListener('change', convertir);
    selectCible.addEventListener('change', convertir);
    amount.addEventListener('input', convertir);

fetchCurrencies().then(convertir);


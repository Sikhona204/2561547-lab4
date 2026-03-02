
const countryInput = document.getElementById('country-input');
const searchBtn = document.getElementById('search-btn');
const spinner = document.getElementById('loading-spinner');
const countryInfo = document.getElementById('country-info');
const borderingCountries = document.getElementById('bordering-countries');
const errorMessage = document.getElementById('error-message');


async function searchCountry(countryName) {
    if (!countryName) return;


    countryInfo.innerHTML = '';
    borderingCountries.innerHTML = '';
    errorMessage.textContent = '';
    spinner.classList.remove('hidden');

    try {
        
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?FullText=true`);
        if (!response.ok) throw new Error('Country not found');
        const data = await response.json();
        const country = data[0];

        
        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag" width="150">
        `;

        
        if (country.borders && country.borders.length > 0) {
            const bordersResponse = await fetch(`https://restcountries.com/v3.1/alpha?codes=${country.borders.join(',')}`);
            const bordersData = await bordersResponse.json();

            bordersData.forEach(borderCountry => {
                const borderDiv = document.createElement('div');
                borderDiv.classList.add('country-card');
                borderDiv.innerHTML = `
                    <h3>${borderCountry.name.common}</h3>
                    <img src="${borderCountry.flags.svg}" alt="${borderCountry.name.common} flag" width="100">
                `;
                borderingCountries.appendChild(borderDiv);
            });
        } else {
            borderingCountries.innerHTML = '<p>No bordering countries.</p>';
        }

    } catch (error) {
    
        errorMessage.textContent = error.message;
    } finally {
        
        spinner.classList.add('hidden');
    }
}

searchBtn.addEventListener('click', () => {
    const country = countryInput.value.trim();
    searchCountry(country);
});

countryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const country = countryInput.value.trim();
        searchCountry(country);
    }
});
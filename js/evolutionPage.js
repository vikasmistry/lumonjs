// Hide the loader once the page has fully loaded
window.addEventListener('load', function() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = 'none';
    }
});

// async function fetchPokemonData(pokemonId) {
//     const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
//     const data = await response.json();
//     return data;
// }

async function displayPokemon(pokemonId) {
    const data = await fetchNameDescription(pokemonId);
    const iconUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;

    const pokemonIcon = document.querySelector("#pokemon-icon-display img");
    const pokemonNameDisplay = document.getElementById("pokemon-name-display");
    const pokemonDescriptionDisplay = document.getElementById("pokemon-description-display");

    pokemonIcon.src = iconUrl;
    pokemonNameDisplay.textContent = data.name.toUpperCase();
    pokemonDescriptionDisplay.textContent = `A ${data.name} is preparing to evolve!`;
    pokemonIcon.style.display = "block";
    


    return data;
}

async function displayEvolvedPokemon(pokemonId, categoryId) {
    const data = await fetchNameDescription(pokemonId);
    const iconUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;

    //const data = await fetchPokemonData(pokemonId);
    //console.log(data);
    const pokemonIcon = document.querySelector("#pokemon-icon-display img");
    const pokemonNameDisplay = document.getElementById("pokemon-name-display");
    const pokemonDescriptionDisplay = document.getElementById("pokemon-description-display");
    const evolutionMessage = document.getElementById("evolution-message");


          // Find the first English flavor text entry
    // const englishEntry = data.flavor_text_entries.find(
    // (entry) => entry.language.name === "en"
    // );
    // let description = englishEntry ? englishEntry.flavor_text : "No description available.";
    // // Replace newline and form feed characters
    // description = description.replace(/\n/g, " ").replace(/\f/g, " ");

    pokemonIcon.src = iconUrl;
    pokemonIcon.style.animation = 'none';
    pokemonNameDisplay.textContent = data.name.toUpperCase();
    //pokemonDescriptionDisplay.textContent = "";
    pokemonDescriptionDisplay.textContent = `Congratulations! Your Pokemon has been evolved to ${data.name.toUpperCase()}`;
    evolutionMessage.style.display = "block";
    url = await addItemToLifeUpAndRedirect(data.name, data.description, pokemonId, categoryId, iconUrl)
    window.location.href = url;

}

window.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    let pokemonId = parseInt(urlParams.get('id'), 10);
    const categoryId = parseInt(urlParams.get('cid'), 10); // This variable is unused

    if (pokemonId) {
       // const previousPokemonId = parseInt(pokemonId) ;
        await displayPokemon(pokemonId);
        setTimeout(async () => {
            const evolvedPokemonId = parseInt(pokemonId) + 1;
            await displayEvolvedPokemon(evolvedPokemonId, categoryId);
        }, 3000);

    } else {
        const pokemonIcon = document.querySelector("#pokemon-icon-display img");
        pokemonIcon.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Pokebola-pokeball-png-0.png/640px-Pokebola-pokeball-png-0.png";
    }

    const returnButton = document.getElementById('returnButton');
    returnButton.addEventListener('click', () => {
        window.location.href = 'lifeup://api/goto?page=main&sub_page=shop';
    });
});

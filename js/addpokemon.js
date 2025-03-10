/**
 * Handles adding a Pokémon item to the LifeUp shop based on URL parameters and displays Pokémon info, then redirects.
 */
document.addEventListener('DOMContentLoaded', async () => {
    const addButton = document.getElementById('addPokemonButton');
    const resultDisplay = document.getElementById('addItemResult'); 
    const pokemonNameDisplay = document.getElementById('pokemon-name-display');
    const pokemonDescriptionDisplay = document.getElementById('pokemon-description-display');
    const pokemonIconDisplay = document.getElementById('pokemon-icon-display');

    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);

    // Get pokemonId; if not provided or invalid, assign a random id from 1 to 1025
    let pokemonId = parseInt(urlParams.get('id'), 10);
    if (isNaN(pokemonId)) {
        pokemonId = Math.floor(Math.random() * 1025) + 1;
    }

    // Get category id; if invalid, show error
    const categoryId = parseInt(urlParams.get('cid'), 10);
    if (isNaN(categoryId)) {
        pokemonNameDisplay.textContent = "Invalid URL parameters.";
        pokemonDescriptionDisplay.textContent = "Please provide a valid 'cid' parameter in the URL.";
        return; // Exit if categoryId parameter is invalid
    }

    try {
        // Fetch Pokémon data and display it
        const data = await fetchNameDescription(pokemonId);
        const iconUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;

        pokemonNameDisplay.textContent = data.name;
        pokemonDescriptionDisplay.textContent = data.description;
        pokemonIconDisplay.innerHTML = `<img src="${iconUrl}" alt="Icon for ${data.name}" class="pokemon-icon" onerror="this.onerror=null;this.src='assets/images/default-pokemon.png';">`;
        addButton.disabled = false; // Enable the button once Pokémon data is loaded

        addButton.addEventListener('click', async () => {
            try{
            url = await addItemToLifeUpAndRedirect(data.name, data.description, pokemonId, categoryId, iconUrl);
            window.location.href = url;
            window.location.href = "lifeup://api/goto?page=main&sub_page=shop";
        }
        catch (error) {
            console.error("Error adding Pokémon item:", error);
            resultDisplay.textContent = `Error adding Pokémon item: ${error.message}`;
        }

        });

    } catch (error) {
        console.error("Error fetching Pokémon data:", error);
        pokemonNameDisplay.textContent = "Error loading Pokémon data.";
        pokemonDescriptionDisplay.textContent = `Failed to fetch Pokémon details.`;
    }
});


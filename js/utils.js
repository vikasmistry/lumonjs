/**
 * Fetches a Pokémon's name and description (flavor text) asynchronously.
 * @param {number} pokemonId - The Pokémon ID.
 * @returns {Promise<Object>} A promise that resolves to a JSON object { name: string, description: string }.
 */
async function fetchNameDescription(pokemonId) {
    try {
        const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
        if (!speciesResponse.ok) {
            throw new Error(`Failed to fetch Pokémon species data: ${speciesResponse.status} ${speciesResponse.statusText}`);
        }
        const speciesData = await speciesResponse.json();

        const name = speciesData.name.charAt(0).toUpperCase() + speciesData.name.slice(1);

        const englishEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === "en");
        let description = englishEntry ? englishEntry.flavor_text : "No description available.";
        description = description.replace(/\n/g, " ").replace(/\f/g, " ");

        return { name, description }; // Return as a JSON object
    } catch (error) {
        console.error("Error in fetchNameDescription:", error);
        return { name: "", description: "Error fetching Pokémon data" }; // Return an object with error message
    }
}


/**
 * Generates a LifeUp API URL to add an item to the shop.
 * @param {string} name - The name of the item.
 * @param {string} desc - The item description.
 * @param {number} price - The item price.
 * @param {string} action_text - The action text.
 * @param {string} icon - Icon URL.
 * @param {boolean} disable_purchase - Purchase disabled flag.
 * @param {number} category - The category ID.
 * @param {string} effects - Effects data.
 * @param {boolean} disable_use - Use disabled flag.
 * @returns {string} - The constructed URL.
 */
function lifeUp_api_add_item(name, desc, price, action_text, icon, disable_purchase, category, effects, disable_use) {
    const url = `lifeup://api/add_item?name=${encodeURIComponent(name)}` +
        `&desc=${encodeURIComponent(desc)}` +
        `&price=${price}` +
        `&action_text=${encodeURIComponent(action_text)}` +
        `&icon=${icon}` +
        `&disable_purchase=${disable_purchase}` +
        `&category=${category}` +
        `&effects=${effects}` +
        `&disable_use=${disable_use}`;
    return url;
}

async function addItemToLifeUpAndRedirect(name, desc, pokemonId, categoryId, iconUrl) {
        const price = pokemonId;
        const action_text = "Evolve";
        const disable_purchase = "true";
        let disable_use = "false";

        const evolution = await nextEvolutionAsync(name);
        console.log("Next evolution:", evolution);
        let effects;
        if (evolution !== null) {
            const edit_url = window.location.origin + `/edit-evolution-box.html?cid=${categoryId}&id=${pokemonId}`;
            const encodedEditUrl = encodeURIComponent(edit_url);
            effects = [{ type: 9, info: { url: encodedEditUrl, use_web_view: true } }];
        } else {
            effects = [{ type: 1 }];
            disable_use = "true";
        }
        const effects_str = JSON.stringify(effects);

        const lifeUpApiUrl = lifeUp_api_add_item(
            name,
            desc,
            price,
            action_text,
            iconUrl,
            disable_purchase,
            categoryId,
            effects_str,
            disable_use
        );
        console.log("LifeUp API URL:", lifeUpApiUrl);
        return lifeUpApiUrl;
        

    
}

/**
 * Recursively searches the evolution chain for the node corresponding to the given Pokémon.
 * @param {Object} chain - The evolution chain node.
 * @param {string} pokemonName - The Pokémon name (lowercase).
 * @returns {Object|null} The node corresponding to the Pokémon or null if not found.
 */
function findPokemonNode(chain, pokemonName) {
    if (chain.species.name.toLowerCase() === pokemonName.toLowerCase()) {
      return chain;
    }
    for (const evo of chain.evolves_to) {
      const found = findPokemonNode(evo, pokemonName);
      if (found) {
        return found;
      }
    }
    return null;
  }
  
  /**
   * Asynchronously fetches the next evolution for a given Pokémon.
   * Returns the name of the next evolution if available, or null otherwise.
   * @param {string} pokemonName - The name of the Pokémon.
   * @returns {Promise<string|null>}
   */
  async function nextEvolutionAsync(pokemonName) {
    const lowerName = pokemonName.toLowerCase();
    try {
      // Fetch species data to get the evolution chain URL.
      const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${lowerName}`);
      if (!speciesRes.ok) throw new Error(`Species fetch error: ${speciesRes.status}`);
      const speciesData = await speciesRes.json();
  
      // Fetch evolution chain data.
      const evoChainRes = await fetch(speciesData.evolution_chain.url);
      if (!evoChainRes.ok) throw new Error(`Evolution chain fetch error: ${evoChainRes.status}`);
      const evoChainData = await evoChainRes.json();
      const chain = evoChainData.chain;
  
      // Find the node corresponding to the current Pokémon.
      const currentNode = findPokemonNode(chain, lowerName);
      if (currentNode && currentNode.evolves_to.length > 0) {
        // Return the name of the first next evolution.
        return currentNode.evolves_to[0].species.name;
      }
      console.log("No evolution available.");
      return null;
    } catch (error) {
      console.error("Error in nextEvolutionAsync:", error);
      return null;
    }
  }
  
  
  // Optionally attach to the global object for testing:
  //window.nextEvolutionAsync = nextEvolutionAsync;
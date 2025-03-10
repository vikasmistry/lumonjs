/**
 * Fetches a Pokémon's name and description (flavor text) asynchronously using only the species endpoint.
 * @param {number} pokemonId - The Pokémon ID.
 * @returns {Promise<[string, string]>} A promise that resolves to an array with [name, description].
 */
async function fetchDescriptionAsync(pokemonId) {
  try {
    // Fetch species data which contains both the name and flavor text
    const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
    if (!speciesResponse.ok) throw new Error("Failed to fetch Pokémon species data");
    const speciesData = await speciesResponse.json();

    // Get the name and capitalize it
    const name = speciesData.name.charAt(0).toUpperCase() + speciesData.name.slice(1);

    // Find the first English flavor text entry
    const englishEntry = speciesData.flavor_text_entries.find(
      (entry) => entry.language.name === "en"
    );
    let description = englishEntry ? englishEntry.flavor_text : "No description available.";
    // Replace newline and form feed characters
    description = description.replace(/\n/g, " ").replace(/\f/g, " ");

    return [name, description];
  } catch (error) {
    console.error("Error in fetchDescriptionAsync:", error);
    return ["", ""];
  }
}

/**
 * Fetches the Pokémon icon URL asynchronously.
 * @param {number} pokemonId - The Pokémon ID.
 * @returns {Promise<string>} A promise that resolves to the icon URL.
 */
function fetchIconUrlAsync(pokemonId) {
  //const dreamWorldSvgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg`;
  const officialArtworkPngUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
  //https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/shiny/1.gif
  //http://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/1.gif
  // try {
  //   const response = await fetch(dreamWorldSvgUrl);
  //   if (response.ok && response.headers.get('Content-Type') === 'image/svg+xml') {
  //     return dreamWorldSvgUrl; // Return SVG if found and is actually an SVG
  //   } else {
  //     // Dream World SVG not found or not an SVG, fallback to official artwork PNG
    return officialArtworkPngUrl;
  //   }
  // } catch (error) {
  //   // Error fetching Dream World SVG, fallback to official artwork PNG
  //   console.error("Error fetching Dream World SVG:", error);
  //   return officialArtworkPngUrl;
  // }
}

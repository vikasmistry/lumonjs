// pokemon-detail.js
let currentPokemonId = null;
const MAX_POKEMONS = 1025;
const urlParams = new URLSearchParams(window.location.search);
const pokemonID = urlParams.get("id");
const cid = urlParams.get("cid");
const pokeidListParam = urlParams.get('pokeidList');
let pokeid_list = [];
const url = "192.168.1.100";
const base = `http://${url}:13276/api/contentprovider?url=`;

// Parse and decode pokeidList.  Handle potential errors.
if (pokeidListParam) {
    try {
        pokeid_list = JSON.parse(decodeURIComponent(pokeidListParam));
    } catch (error) {
        console.error("Error parsing pokeidList:", error);
        // If parsing fails, provide a default or handle the error appropriately
        pokeid_list = [];  
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const id = parseInt(pokemonID, 10);

    // Validate the Pokemon ID. Redirect if invalid.
    if (isNaN(id) || id < 1 || id > MAX_POKEMONS) {
      window.location.href = `./index.html${cid ? `?cid=${cid}` : ''}`;
      return;
    }

    currentPokemonId = id;
    loadPokemon(currentPokemonId);
    setupNavigation(); // Attach navigation event listeners ONCE

    // Set up the back button
    const backToIndex = document.getElementById('back-to-index');
    if(backToIndex){
        backToIndex.href = `./index.html${cid ? `?cid=${cid}` : ''}`;
    }else{
        console.error("Element with id 'back-to-index' not found.")
    }
});

async function loadPokemon(id) {
  const notFoundMessage = document.getElementById('not-found-message');
  if (notFoundMessage) { notFoundMessage.style.display = 'none'; }

  //Check if pokemon ID is valid.  Handle case where it's not found
  if (!pokeid_list.includes(id)) {
    console.warn(`Pokemon ID ${id} not found in the list.`);
    if (notFoundMessage) { notFoundMessage.style.display = 'block'; }
    return;
  }

  try {
      console.log(id);
      const pokemonData = await fetchPokemonData(id);
      if(!pokemonData || !pokemonData.pokemon || !pokemonData.pokemonSpecies){
          console.error("Invalid Pokemon Data",pokemonData)
          if (notFoundMessage) { notFoundMessage.style.display = 'block'; }
           return;
      }
      console.log(pokemonData);
      displayPokemonDetails(pokemonData.pokemon); // i remove pokemonSpecies here
      
      window.history.pushState({}, "", `./pokemon-detail.html?id=${id}`);
  } catch (error) {
      console.error("Error fetching Pokémon data:", error);
      if (notFoundMessage) { notFoundMessage.style.display = 'block'; }
  }
}



async function fetchPokemonData(id) {
    // Fetch pokemon and species data concurrently
    const [pokemon, pokemonSpecies] = await Promise.all([
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json()),
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then(res => res.json())
    ]);
    return { pokemon, pokemonSpecies };
}

function setupNavigation() {
    const leftArrow = document.getElementById("leftArrow");
    const rightArrow = document.getElementById("rightArrow");

    //Check if elements exist.  Handle the case where they don't.
    if(!leftArrow || !rightArrow){
        console.error("Left or Right Arrow elements not found.");
        return;
    }

    const updateNavigationButtons = () => {
        const currentIndex = pokeid_list.indexOf(currentPokemonId);
        leftArrow.style.display = currentIndex > 0 ? 'block' : 'none';
        rightArrow.style.display = currentIndex < pokeid_list.length - 1 ? 'block' : 'none';
    };

    updateNavigationButtons(); // Initial update

    leftArrow.addEventListener("click", () => {
        const currentIndex = pokeid_list.indexOf(currentPokemonId);
        if (currentIndex > 0) { navigatePokemon(pokeid_list[currentIndex - 1]); }
    });

    rightArrow.addEventListener("click", () => {
        const currentIndex = pokeid_list.indexOf(currentPokemonId);
        if (currentIndex < pokeid_list.length - 1) { navigatePokemon(pokeid_list[currentIndex + 1]); }
    });
}

async function navigatePokemon(id) {
    currentPokemonId = id;
    await loadPokemon(id);
}





const typeColors = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  dark: "#EE99AC",
};

function setElementStyles(elements, cssProperty, value) {
  elements.forEach((element) => {
    element.style[cssProperty] = value;
  });
}

function rgbaFromHex(hexColor) {
  return [
    parseInt(hexColor.slice(1, 3), 16),
    parseInt(hexColor.slice(3, 5), 16),
    parseInt(hexColor.slice(5, 7), 16),
  ].join(", ");
}

function setTypeBackgroundColor(pokemon) {
  const mainType = pokemon.types[0].type.name;
  const color = typeColors[mainType];

  if (!color) {
    console.warn(`Color not defined for type: ${mainType}`);
    return;
  }

  const detailMainElement = document.querySelector(".detail-main");
  setElementStyles([detailMainElement], "backgroundColor", color);
  setElementStyles([detailMainElement], "borderColor", color);

  setElementStyles(
    document.querySelectorAll(".power-wrapper > p"),
    "backgroundColor",
    color
  );

  setElementStyles(
    document.querySelectorAll(".stats-wrap p.stats"),
    "color",
    color
  );

  setElementStyles(
    document.querySelectorAll(".stats-wrap .progress-bar"),
    "color",
    color
  );

  const rgbaColor = rgbaFromHex(color);
  const styleTag = document.createElement("style");
  styleTag.innerHTML = `
    .stats-wrap .progress-bar::-webkit-progress-bar {
        background-color: rgba(${rgbaColor}, 0.5);
    }
    .stats-wrap .progress-bar::-webkit-progress-value {
        background-color: ${color};
    }
  `;
  document.head.appendChild(styleTag);
}

function capitalizeFirstLetter(string) {
  if (!string || typeof string !== 'string') {
    console.error("Invalid input to capitalizeFirstLetter:", string);
    return ""; // Return an empty string or handle the error as needed
  }
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}



//error
//pokemon-detail.js:196 Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'charAt')
// at capitalizeFirstLetter (pokemon-detail.js:196:17)
// at displayPokemonDetails (pokemon-detail.js:213:33)
// at loadPokemon (pokemon-detail.js:57:9)

function createAndAppendElement(parent, tag, options = {}) {
  const element = document.createElement(tag);
  Object.keys(options).forEach((key) => {
    element[key] = options[key];
  });
  parent.appendChild(element);
  return element;
}




async function displayPokemonDetails(pokemon) {
  const { name, id, types, weight, height, stats } = pokemon;
    if(!name){
      console.error("pokemon.name is undefined",pokemon)
      return;
    }
  const capitalizePokemonName = capitalizeFirstLetter(name);

  document.querySelector("title").textContent = capitalizePokemonName;

  const detailMainElement = document.querySelector(".detail-main");
  detailMainElement.classList.add(name.toLowerCase());

  document.querySelector(".name-wrap .name").textContent =
    capitalizePokemonName;

  document.querySelector(
    ".pokemon-id-wrap .body2-fonts"
  ).textContent = `#${String(id).padStart(3, "0")}`;

  const imageElement = document.querySelector(".detail-img-wrapper img");
  imageElement.src = await fetchIconUrlAsync(id);
  imageElement.alt = name;

  const typeWrapper = document.querySelector(".power-wrapper");
  typeWrapper.innerHTML = "";
  types.forEach(({ type }) => {
    createAndAppendElement(typeWrapper, "p", {
      className: `body3-fonts type ${type.name}`,
      textContent: type.name,
    });
  });

  document.querySelector(
    ".pokemon-detail-wrap .pokemon-detail p.body3-fonts.weight"
  ).textContent = `${weight / 10}kg`;
  document.querySelector(
    ".pokemon-detail-wrap .pokemon-detail p.body3-fonts.height"
  ).textContent = `${height / 10}m`;


  // const abilitiesWrapper = document.querySelector(
  //   ".pokemon-detail-wrap .pokemon-detail.move"
  // );

  // abilitiesWrapper.innerHTML = "";
  // abilities.forEach(({ ability }) => {
  //   createAndAppendElement(abilitiesWrapper, "p", {
  //     className: "body3-fonts",
  //     textContent: ability.name,
  //   });
  // });


//url for gif 
  //https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/1.gif
  const statsWrapper = document.querySelector(".stats-wrapper");
  statsWrapper.innerHTML = "";

  const statNameMapping = {
    hp: "HP",
    attack: "ATK",
    defense: "DEF",
    "special-attack": "SATK",
    "special-defense": "SDEF",
    speed: "SPD",
  };

  stats.forEach(({ stat, base_stat }) => {
    const statDiv = document.createElement("div");
    statDiv.className = "stats-wrap";
    statsWrapper.appendChild(statDiv);

    createAndAppendElement(statDiv, "p", {
      className: "body3-fonts stats",
      textContent: statNameMapping[stat.name],
    });

    createAndAppendElement(statDiv, "p", {
      className: "body3-fonts",
      textContent: String(base_stat).padStart(3, "0"),
    });

    createAndAppendElement(statDiv, "progress", {
      className: "progress-bar",
      value: base_stat,
      max: 100,
    });
  });

  setTypeBackgroundColor(pokemon);
}

function getEnglishFlavorText(pokemonSpecies) {
  for (let entry of pokemonSpecies.flavor_text_entries) {
    if (entry.language.name === "en") {
      let flavor = entry.flavor_text.replace(/\f/g, " ");
      return flavor;
    }
  }
  return "";
}

function getGenusName(pokemonSpecies) {
  for (let entry of pokemonSpecies.genera) {
    if (entry.language.name === "en") {
      let genus = entry.genus.replace(/Pokémon/g, " ");
      return genus;
    }
  }
  return "";
}

async function fetchIconUrlAsync(pokemonId) {
  const dreamWorldSvgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg`;
  const officialArtworkPngUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;

  try {
    const response = await fetch(dreamWorldSvgUrl);
    if (response.ok && response.headers.get('Content-Type') === 'image/svg+xml') {
      return dreamWorldSvgUrl; // Return SVG if found and is actually an SVG
    } else {
      // Dream World SVG not found or not an SVG, fallback to official artwork PNG
      return officialArtworkPngUrl;
    }
  } catch (error) {
    // Error fetching Dream World SVG, fallback to official artwork PNG
    console.error("Error fetching Dream World SVG:", error);
    return officialArtworkPngUrl;
  }
}

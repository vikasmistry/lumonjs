//const MAX_POKEMON = 1;
const listWrapper = document.querySelector(".list-wrapper");
const searchInput = document.querySelector("#search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector("#not-found-message");
//const cid = 6; // Remove the hardcoded cid
const url = "192.168.1.100";
//const url = "localhost"
const base = `http://${url}:13276/api/contentprovider?url=`;
//const base = "http://localhost:13276/api/contentprovider?url="; // Default base URL - adjust if needed
const MAX_POKEMONS = 1025;
const pokemonID = new URLSearchParams(window.location.search).get("id");
const cid = new URLSearchParams(window.location.search).get("cid");
// pokemon.js
// ... (other code) ...

allPokemons = [];
let item_ids_list = []; // List of LifeUp item IDs
let pokeid_list = [];    // List of Pokemon IDs (stored in 'price')

async function fetchAllItemDataAsync(cid) {
    try {
        const items_url = `lifeup://api/query?key=item_id_list&category_id=${cid}`;
        const encodedEditUrl = encodeURIComponent(items_url);
        const fullUrl = base + encodedEditUrl;
        const items_response = await fetch(fullUrl);

        if (!items_response.ok) {
            throw new Error("Failed to fetch item IDs");
        }

        const data = await items_response.json();
        const item_ids_str =
            (data.data &&
                data.data[0] &&
                data.data[0].result &&
                data.data[0].result.item_ids) ||
            "";

        if (item_ids_str) {
            item_ids_list = item_ids_str.split(",").map((x) => parseInt(x, 10));
        }

        // 1. Create an array of Promises
        const itemDetailPromises = item_ids_list.map(async (id) => {
            const itemInfoUrl = `lifeup://api/query?key=item&item_id=${id}`;
            const encodedEditUrl2 = encodeURIComponent(itemInfoUrl);
            const item_detail_url = base + encodedEditUrl2;
            const detail_response = await fetch(item_detail_url);
            if (!detail_response.ok) {
                console.warn(
                    `Failed to fetch details for item ID ${id}, status: ${detail_response.status}`
                );
                return null; // Return null for failed fetches
            }
            const detail_data = await detail_response.json();
            const result = detail_data.data && detail_data.data[0] && detail_data.data[0].result
                ? detail_data.data[0].result
                : null; // Return null if no result

            // Add Pokemon ID to pokeid_list if details are successfully fetched
            if(result) {
                pokeid_list.push(result.price);
            }

            return result;
        });

        // 2. Use Promise.all to wait for all Promises to resolve in parallel
        const all_items_detail = await Promise.all(itemDetailPromises);

        // 3. Filter out any null values (failed fetches)
        const valid_items_detail = all_items_detail.filter((item) => item !== null);

        allPokemons = valid_items_detail;
        displayPokemons(allPokemons, cid, pokeid_list); // Pass pokeid_list to displayPokemons
    } catch (error) {
        console.error("Error fetching all items:", error);
    }
}

async function displayPokemons(pokemon, cid, pokeid_list) {
    listWrapper.innerHTML = "";
    pokemon.forEach((pokemon) => {
      const pokemonID = pokemon.price;
      const listItem = document.createElement("div");
      listItem.className = "list-item";
      listItem.innerHTML = `
          <div class="number-wrap">
              <p class="caption-fonts">#${pokemonID}</p>
          </div>
          <div class="img-wrap">
              <img src="${pokemon.icon}" alt="${pokemon.name}" />
          </div>
          <div class="name-wrap">
              <p class="body3-fonts">${pokemon.name} (${pokemon.own_number})</p>
          </div>
      `;

      listItem.addEventListener("click", async () => {
        const pokeidListParam = encodeURIComponent(JSON.stringify(pokeid_list)); // Serialize pokeid_list to JSON string
        window.location.href = `./pokemon-detail.html?cid=${cid}&id=${pokemonID}&pokeidList=${pokeidListParam}`; // Pass pokeidList as URL parameter
      });

      listWrapper.appendChild(listItem);
    });
}

// ... (rest of your code - fetchPokemonDataBeforeRedirect, handleSearch, clearSearch) ...

function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase();
  let filteredPokemons;

  if (numberFilter.checked) {
    filteredPokemons = allPokemons.filter((pokemon) => {
      const pokemonID = pokemon.price.toString();
      return pokemonID.startsWith(searchTerm);
    });
  } else if (nameFilter.checked) {
    filteredPokemons = allPokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().startsWith(searchTerm)
    );
  } else {
    filteredPokemons = allPokemons;
  }

  // Pass item_ids_list to displayPokemons
  displayPokemons(filteredPokemons, cid, pokeid_list);

  if (filteredPokemons.length === 0) {
    notFoundMessage.style.display = "block";
  } else {
    notFoundMessage.style.display = "none";
  }
}

searchInput.addEventListener("keyup", handleSearch);

const closeButton = document.querySelector(".search-close-icon");
closeButton.addEventListener("click", clearSearch);

function clearSearch() {
  searchInput.value = "";
    // Pass item_ids_list to displayPokemons
  displayPokemons(allPokemons, cid, pokeid_list);
  notFoundMessage.style.display = "none";
}

// Get cid from URL when the page loads and launch the fetch
if (cid) {
  fetchAllItemDataAsync(cid)
}else{
  fetchAllItemDataAsync(1) // default cid
}

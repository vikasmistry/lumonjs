/**
 * lifeup_fetch.js: Functions to interact with the LifeUp API for item data.
 */

const base = "http://192.168.1.100:13276/api/contentprovider?url="; // Default base URL - adjust if needed

/**
 * (Renamed) Asynchronously fetches ALL item data for a given category ID from LifeUp API.
 * (This function now fetches all items at once, for potential future use if needed)
 * @param {number} cid - The category ID.
 * @returns {Promise<Array>} A promise that resolves to an array of item objects.
 */
async function fetchAllItemDataAsync(cid) {
    try {
        const items_url = `lifeup://api/query?key=item_id_list&category_id=${cid}`; // Assuming this endpoint lists item IDs
        const encodedEditUrl = encodeURIComponent(items_url);
        const fullUrl = base + encodedEditUrl;
        const items_response = await fetch(fullUrl);
        console.log("Fetching all items from URL:", fullUrl);

        if (!items_response.ok) {
            console.error(`HTTP error! status: ${items_response.status} at URL: ${items_url}`);
            return []; // Return empty array on error
        }

        const items_data = await items_response.json();
        if (!Array.isArray(items_data)) {
            console.error("Unexpected data format: items_data is not an array", items_data);
            return []; // Return empty array for unexpected format
        }

        let item_ids_list = [];
        for (let item of items_data) {
            item_ids_list.push(item.item_id);
        }

        let all_items_detail = [];
        for (let id of item_ids_list) {
            const itemInfoUrl = `lifeup://api/query?key=item&item_id=${id}`;
            const encodedEditUrl2 = encodeURIComponent(itemInfoUrl);
            const item_detail_url = base + encodedEditUrl2;
            const detail_response = await fetch(item_detail_url);
            if (!detail_response.ok) {
                console.warn(`Failed to fetch details for item ID ${id}, status: ${detail_response.status}`);
                continue; // Skip to the next item if detail fetch fails
            }
            const detail_data = await detail_response.json();
            if (detail_data && detail_data.data && detail_data.data[0] && detail_data.data[0].result) {
                all_items_detail.push(detail_data.data[0].result); // Extract result part
            }
        }
        return all_items_detail;

    } catch (error) {
        console.error("Fetch error in fetchAllItemDataAsync:", error);
        return []; // Return empty array on fetch error
    }
}


/**
 * Asynchronously fetches data for a single item from a category by index using LifeUp API.
 * @param {number} cid - The category ID.
 * @param {number} itemIndex - Index of the item in the category's item list (0-based).
 * @returns {Promise<object|null>} A promise that resolves to item data object, or null if not found or error.
 */
async function getItemDataAsync(itemId) {
    try {

        //const itemId = item_ids_list[itemIndex];
        const itemInfoUrl = `lifeup://api/query?key=item&item_id=${itemId}`;
        const fullUrl2 = base + encodeURIComponent(itemInfoUrl);
        const itemResponse = await fetch(fullUrl2);
        console.log("Fetching item details from URL:", itemId);


        if (!itemResponse.ok) {
            console.warn(`Failed to fetch details for item ID ${itemId}, status: ${itemResponse.status}`);
            return null; // Indicate error fetching item detail
        }

        const itemData = await itemResponse.json();
        const result = itemData.data && itemData.data[0] && itemData.data[0].result;
        return result || null; // Return single item detail, or null if no result

    } catch (error) {
        console.error("Fetch error in getItemDataAsync:", error);
        return null; // Indicate fetch error
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
    const url = `lifeup://api/add_item?name=${name}` +
        `&desc=${desc}` +
        `&price=${price}` +
        `&action_text=${action_text}` +
        `&icon=${icon}` +
        `&disable_purchase=${disable_purchase}` +
        `&category=${category}` +
        `&effects=${effects}` +
        `&disable_use=${disable_use}`;
    return url;
}

/**
 * Generates a LifeUp API URL to edit the evolution box.
 * @param {string} name - The item name.
 * @param {string} effects - New effects data.
 * @returns {string} - The constructed URL.
 */
function lifeup_edit_evolution_box(name, effects) {
    const url = `lifeup://api/item?name=${name}` +
        `&effects=${effects}`;
    return url;
}
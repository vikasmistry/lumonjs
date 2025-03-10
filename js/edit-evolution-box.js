document.addEventListener('DOMContentLoaded', async () => { // Note the 'async' here
  const urlParams = new URLSearchParams(window.location.search);
  const cid = parseInt(urlParams.get('cid'), 10);
  const id = parseInt(urlParams.get('id'), 10);

  // Wait for editEvolutionBox to finish before using url
  const url = await editEvolutionBox(cid, id);  // Added 'await'

  document.getElementById('openShopButton').addEventListener('click', () => {
    window.location.href = url;
   // window.location.href = "lifeup://api/goto?page=synthesis"
   window.location.href = 'lifeup://api/goto?page=main&sub_page=shop';
    
  });
});


// function openLifeUpApp() {
//   const schemeUrl = "lifeup://api/goto?page=synthesis";
//   const iframe = document.createElement("iframe");
//   iframe.style.display = "none";
//   iframe.src = schemeUrl;
//   document.body.appendChild(iframe);
//   setTimeout(() => {
//     document.body.removeChild(iframe);
//   }, 2000);
// }


/**
 * Replicates change_evolution_box logic:
 * - Creates a new LifeUp API URL for editing the evolution box.
 *
 * @param {number} cid - Category ID.
 * @param {number} id - Pokemon ID.
 * @returns {Promise<string>} - A URL string.
 */
async function editEvolutionBox(cid, id) {

    const edit_url = window.location.origin + "/evolutionPage.html?cid=" + cid + "&id=" + (id);
    const evolve_url = encodeURIComponent(edit_url);

    const effects_str = JSON.stringify([{ type: 9, info: { url: evolve_url, use_web_view: true } }]);
    const name_evolution_box = "Evolution Box";
    // lifeup_edit_evolution_box is assumed to be defined in lifeup_fetch.js
    const url = `lifeup://api/item?name=${name_evolution_box}&effects=${effects_str}`;
    return url;
}








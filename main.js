const listaPokemon = document.getElementById("listaPokemon");
const buttons = document.querySelectorAll(".btn-header");
const modal = document.getElementById("pokemonModal");
const modalContent = document.getElementById("modalContent");
const closeModal = document.getElementById("closeModal");

const API_URL = "https://pokeapi.co/api/v2/pokemon?limit=151";
let allPokemon = [];

// Fetch Pokémon Data
async function fetchPokemon() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const pokemonList = data.results;

        const promises = pokemonList.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            return res.json();
        });

        allPokemon = await Promise.all(promises);
        displayPokemon(allPokemon);
    } catch (error) {
        console.error("Error fetching Pokémon data:", error);
    }
}

// Display Pokémon
function displayPokemon(pokemonArray) {
    listaPokemon.innerHTML = "";

    pokemonArray.forEach((pokemon) => {
        const types = pokemon.types.map(type => type.type.name);
        const typeClasses = types.map(type => `<p class="${type} tipo">${type.toUpperCase()}</p>`).join("");

        const pokemonCard = document.createElement("div");
        pokemonCard.classList.add("pokemon");
        pokemonCard.innerHTML = `
            <p class="pokemon-id-back">#${String(pokemon.id).padStart(3, "0")}</p>
            <div class="pokemon-imagen">
                <img src="${pokemon.sprites.other["official-artwork"].front_default}" 
                    alt="${pokemon.name}" 
                    data-id="${pokemon.id}">
            </div>
            <div class="pokemon-info">
                <div class="nombre-contenedor">
                    <p class="pokemon-id">#${String(pokemon.id).padStart(3, "0")}</p>
                    <h2 class="pokemon-nombre">${capitalize(pokemon.name)}</h2>
                </div>
                <div class="pokemon-tipos">${typeClasses}</div>
                <div class="pokemon-stats">
                    <p class="stat">${pokemon.height / 10}m</p>
                    <p class="stat">${pokemon.weight / 10}kg</p>
                </div>
            </div>
        `;

        pokemonCard.querySelector(".pokemon-imagen img").addEventListener("click", () => showPokemonDetails(pokemon));
        listaPokemon.appendChild(pokemonCard);
    });
}

// Show Pokémon Details in Modal
function showPokemonDetails(pokemon) {
    const types = pokemon.types.map(type => type.type.name);
    const abilities = pokemon.abilities.map(ability => ability.ability.name).join(", ");
    const stats = pokemon.stats.map(stat => `<p><strong>${stat.stat.name}:</strong> ${stat.base_stat}</p>`).join("");

    modalContent.innerHTML = `
        <h2>#${String(pokemon.id).padStart(3, "0")} ${capitalize(pokemon.name)}</h2>
        <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}">
        <p><strong>Type:</strong> ${types.join(", ")}</p>
        <p><strong>Height:</strong> ${pokemon.height / 10}m</p>
        <p><strong>Weight:</strong> ${pokemon.weight / 10}kg</p>
        <p><strong>Abilities:</strong> ${abilities}</p>
        <div class="stats-container">
            <h3>Stats</h3>
            ${stats}
        </div>
    `;

    modal.style.display = "block";
}

// Close Modal
closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

// Capitalize First Letter
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Filter Pokémon by Type
buttons.forEach(button => {
    button.addEventListener("click", (event) => {
        const type = event.target.id;
        if (type === "ver-todos") {
            displayPokemon(allPokemon);
        } else {
            const filteredPokemon = allPokemon.filter(pokemon =>
                pokemon.types.some(t => t.type.name === type)
            );
            displayPokemon(filteredPokemon);
        }
    });
});

// Fetch Pokémon Data on Load
fetchPokemon();
const pokedex = async (pokeName) => {
  try{
    const res = await fetch(`https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/${pokeName.toLowerCase()}`);
    if(!res.ok){
      throw new Error("Thats not a pokemon you @#$%^&*!");
    }
    const data = await res.json();
    console.log(data);
    displayPokemon(data);
  } catch(error){
    alert("Pokémon not found")
    console.error('Error', error)
  }
};

const typeColors = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD"
};

const typeIcons = {
  normal: `<img class="type-icon" src="icons/normal.svg" alt="Normal">`,
  fire: `<img class="type-icon" src="icons/fire.svg" alt="Fire">`,
  water: `<img class="type-icon" src="icons/water.svg" alt="Water">`,
  electric: `<img class="type-icon" src="icons/electric.svg" alt="Electric">`,
  grass: `<img class="type-icon" src="icons/grass.svg" alt="Grass">`,
  ice: `<img class="type-icon" src="icons/ice.svg" alt="Ice">`,
  fighting: `<img class="type-icon" src="icons/fighting.svg" alt="Fighting">`,
  poison: `<img class="type-icon" src="icons/poison.svg" alt="Poison">`,
  ground: `<img class="type-icon" src="icons/ground.svg" alt="Ground">`,
  flying: `<img class="type-icon" src="icons/flying.svg" alt="Flying">`,
  psychic: `<img class="type-icon" src="icons/psychic.svg" alt="Psychic">`,
  bug: `<img class="type-icon" src="icons/bug.svg" alt="Bug">`,
  rock: `<img class="type-icon" src="icons/rock.svg" alt="Rock">`,
  ghost: `<img class="type-icon" src="icons/ghost.svg" alt="Ghost">`,
  dragon: `<img class="type-icon" src="icons/dragon.svg" alt="Dragon">`,
  dark: `<img class="type-icon" src="icons/dark.svg" alt="Dark">`,
  steel: `<img class="type-icon" src="icons/steel.svg" alt="Steel">`,
  fairy: `<img class="type-icon" src="icons/fairy.svg" alt="Fairy">`
};


const showDefaultScreen = () => {
  document.querySelectorAll(".stat").forEach(p => p.style.display = "none");
  document.getElementById("sprite").style.display = "none";
  document.getElementById("weight").style.display = "none";
  document.getElementById("height").style.display = "none";
  document.getElementById("types").style.display = "none";
};

const displayPokemon = (pokemon) => {
  flashScreen();
  document.querySelectorAll(".stat").forEach(p => p.style.display = "block");
  document.getElementById("sprite").style.display = "block";
  document.getElementById("weight").style.display = "block";
  document.getElementById("height").style.display = "block";
  document.getElementById("types").style.display = "flex";
  
  document.getElementById("pokemon-name").textContent = pokemon.name.toUpperCase();
  document.getElementById("sprite").src = pokemon.sprites.front_default;
  document.getElementById("pokemon-id").textContent = pokemon.id;
  document.getElementById("weight").textContent = `Weight: ${pokemon.weight}`;
  document.getElementById("height").textContent = `Height: ${pokemon.height}`;
  
  const typesContainer = document.getElementById("types");
  typesContainer.innerHTML = ''; 
  
  pokemon.types.forEach(typeObj => {
    const typeName = typeObj.type.name;
    const typeElement = document.createElement('div');
    typeElement.className = 'type-badge';
    
    const icon = typeIcons[typeName] || typeIcons.normal;
    
    typeElement.innerHTML = `
      ${icon}
      <span>${typeName.toUpperCase()}</span>
    `;
    
    typeElement.style.backgroundColor = typeColors[typeName] || "#777";
    
    typesContainer.appendChild(typeElement);
  });
  
  const hp = pokemon.stats.find(st => st.stat.name === 'hp').base_stat;
  document.getElementById("hp").textContent = hp;
  
  const attack = pokemon.stats.find(st => st.stat.name === 'attack').base_stat;
  document.getElementById("attack").textContent = attack;
  
  const defense = pokemon.stats.find(st => st.stat.name === 'defense').base_stat;
  document.getElementById("defense").textContent = defense;
  
  const specialAttack = pokemon.stats.find(st => st.stat.name === 'special-attack').base_stat;
  document.getElementById("special-attack").textContent = specialAttack;
  
  const specialDefense = pokemon.stats.find(st => st.stat.name === 'special-defense').base_stat;
  document.getElementById("special-defense").textContent = specialDefense;
  
  const speed = pokemon.stats.find(st => st.stat.name === 'speed').base_stat;
  document.getElementById("speed").textContent = speed;
};

// Search button click
document.getElementById("search-button").addEventListener("click", () => {
  const pokemonName = document.getElementById("search-input").value;
  if (pokemonName) {
    pokedex(pokemonName);
  } 
});

document.getElementById("search-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const pokemonName = document.getElementById("search-input").value;
    if (pokemonName) {
      pokedex(pokemonName);
    }
  }
});

const flashScreen = () => {
  const flash = document.getElementById("flash");
  flash.style.opacity = 1;
  setTimeout(() => {
    flash.style.opacity = 0;
  }, 100);
};

showDefaultScreen();
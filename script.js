const API_BASE = "https://pokeapi.co/api/v2";

let currentRequestId = 0; // cancel stale requests when user searches rapidly

const typeColors = {
  normal: "#A8A77A", fire: "#EE8130", water: "#6390F0", electric: "#F7D02C",
  grass: "#7AC74C", ice: "#96D9D6", fighting: "#C22E28", poison: "#A33EA1",
  ground: "#E2BF65", flying: "#A98FF3", psychic: "#F95587", bug: "#A6B91A",
  rock: "#B6A136", ghost: "#735797", dragon: "#6F35FC", dark: "#705746",
  steel: "#B7B7CE", fairy: "#D685AD"
};

const typeIcons = {
  normal:   `<img class="type-icon" src="icons/normal.svg"   alt="Normal">`,
  fire:     `<img class="type-icon" src="icons/fire.svg"     alt="Fire">`,
  water:    `<img class="type-icon" src="icons/water.svg"    alt="Water">`,
  electric: `<img class="type-icon" src="icons/electric.svg" alt="Electric">`,
  grass:    `<img class="type-icon" src="icons/grass.svg"    alt="Grass">`,
  ice:      `<img class="type-icon" src="icons/ice.svg"      alt="Ice">`,
  fighting: `<img class="type-icon" src="icons/fighting.svg" alt="Fighting">`,
  poison:   `<img class="type-icon" src="icons/poison.svg"   alt="Poison">`,
  ground:   `<img class="type-icon" src="icons/ground.svg"   alt="Ground">`,
  flying:   `<img class="type-icon" src="icons/flying.svg"   alt="Flying">`,
  psychic:  `<img class="type-icon" src="icons/psychic.svg"  alt="Psychic">`,
  bug:      `<img class="type-icon" src="icons/bug.svg"      alt="Bug">`,
  rock:     `<img class="type-icon" src="icons/rock.svg"     alt="Rock">`,
  ghost:    `<img class="type-icon" src="icons/ghost.svg"    alt="Ghost">`,
  dragon:   `<img class="type-icon" src="icons/dragon.svg"   alt="Dragon">`,
  dark:     `<img class="type-icon" src="icons/dark.svg"     alt="Dark">`,
  steel:    `<img class="type-icon" src="icons/steel.svg"    alt="Steel">`,
  fairy:    `<img class="type-icon" src="icons/fairy.svg"    alt="Fairy">`
};

// e.g. turn "venusaur-mega" into "MEGA"
const getFormLabel = (baseName, fullName) => {
  if (fullName === baseName) return "BASE";
  const suffix = fullName.replace(`${baseName}-`, "");
  return suffix
    .replace(/-/g, " ")
    .toUpperCase();
};

const formColors = {
  "mega":       "#8e44ad",
  "mega-x":     "#2471a3",
  "mega-y":     "#c0392b",
  "gmax":       "#d35400",
  "alola":      "#f1c40f",
  "alolan":     "#f1c40f",
  "galar":      "#1a5276",
  "galarian":   "#1a5276",
  "hisui":      "#b7950b",
  "hisuian":    "#b7950b",
  "paldea":     "#6d4c41",
  "paldean":    "#6d4c41",
  "origin":     "#5d6d7e",
  "sky":        "#85c1e9",
  "therian":    "#52be80",
  "black":      "#212121",
  "white":      "#7f8c8d",
  "resolute":   "#e74c3c",
  "primal":     "#922b21",
};

const getFormColor = (fullName, baseName) => {
  const suffix = fullName.replace(`${baseName}-`, "").toLowerCase();
  // find color based on form keyword (mega, alola, galar, etc.)
  for (const [key, color] of Object.entries(formColors)) {
    if (suffix.includes(key)) return color;
  }
  return "#546e7a";
};

const showLoading = () => {
  document.getElementById("loading-overlay").style.display = "flex";
  hideError();
};

const hideLoading = () => {
  document.getElementById("loading-overlay").style.display = "none";
};

const showError = (msg = "Pokémon not found!") => {
  const el = document.getElementById("error-message");
  document.getElementById("error-text").textContent = msg;
  el.style.display = "block";
  el.style.animation = "none";
  el.offsetHeight;
  el.style.animation = "";
};

const hideError = () => {
  document.getElementById("error-message").style.display = "none";
};

const showDefaultScreen = () => {
  document.getElementById("sprite").style.display         = "none";
  document.getElementById("weight").style.display         = "none";
  document.getElementById("height").style.display         = "none";
  document.getElementById("types").style.display          = "none";
  document.getElementById("evolution-section").style.display = "none";
  document.getElementById("forms-section").style.display  = "none";
  document.querySelectorAll(".stat-row").forEach(r => r.style.display = "none");
  document.querySelectorAll("p.stat").forEach(p => p.style.display = "none");
};

const statColor = (value) => {
  if (value >= 90)  return "#27ae60";
  if (value >= 60)  return "#f39c12";
  if (value >= 35)  return "#e67e22";
  return "#e74c3c";
};

const setStatBar = (barId, valId, rowId, value, maxVal = 255) => {
  const row = document.getElementById(rowId);
  const bar = document.getElementById(barId);
  const val = document.getElementById(valId);

  row.style.display = "flex";
  val.textContent = value;
  bar.style.backgroundColor = statColor(value);

  bar.style.transition = "none";
  bar.style.width = "0%";
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      bar.style.transition = "width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
      bar.style.width = `${(value / maxVal) * 100}%`;
    });
  });
};

let currentBaseName = ""; // track base name for form labels

// grab all official variants from species data
const displayForms = async (pokemonId, currentFormName) => {
  const section  = document.getElementById("forms-section");
  const container = document.getElementById("forms-list");
  container.innerHTML = "";

  try {
    const speciesRes = await fetch(`${API_BASE}/pokemon-species/${pokemonId}`);
    if (!speciesRes.ok) throw new Error("Species fetch failed");
    const speciesData = await speciesRes.json();

    const varieties = speciesData.varieties || [];
    if (varieties.length <= 1) {
      section.style.display = "none";
      return;
    }

    currentBaseName = speciesData.name;

    section.style.display = "block";

    // only show actual game forms, no fan-made variants
    const officialMegas = new Set([
      "venusaur-mega", "charizard-mega-x", "charizard-mega-y", "blastoise-mega",
      "beedrill-mega", "pidgeot-mega", "slowbro-mega", "gengar-mega",
      "kangaskhan-mega", "pinsir-mega", "gyarados-mega", "aerodactyl-mega",
      "mewtwo-mega-x", "mewtwo-mega-y", "ampharos-mega", "steelix-mega",
      "scizor-mega", "heracross-mega", "houndoom-mega", "tyranitar-mega",
      "blaziken-mega", "gardevoir-mega", "mawile-mega", "aggron-mega",
      "medicham-mega", "manectric-mega", "banette-mega", "absol-mega",
      "garchomp-mega", "lucario-mega", "abomasnow-mega", "alakazam-mega",
      "audino-mega", "latias-mega", "latios-mega", "lopunny-mega",
      "gallade-mega", "diancie-mega", "sableye-mega", "swampert-mega",
      "sceptile-mega", "altaria-mega", "glalie-mega", "salamence-mega",
      "metagross-mega", "rayquaza-mega", "groudon-primal", "kyogre-primal",
      "sharpedo-mega", "camerupt-mega"
    ]);

    const isOfficialForm = (name) => {
      if (!name.includes("-mega") && !name.includes("-primal")) return true;
      return officialMegas.has(name);
    };

    varieties.filter(({ pokemon }) => isOfficialForm(pokemon.name)).forEach(({ pokemon, is_default }) => {
      const formName  = pokemon.name;
      const label     = getFormLabel(currentBaseName, formName);
      const color     = is_default ? "#2c3e50" : getFormColor(formName, currentBaseName);

      const badge = document.createElement("button");
      badge.className = "form-badge";
      badge.textContent = label;
      badge.style.backgroundColor = color;
      if (formName === currentFormName) {
        badge.classList.add("form-badge-active");
      }

      badge.addEventListener("click", () => {
        pokedexForm(formName, pokemonId);
      });

      container.appendChild(badge);
    });

  } catch (err) {
    console.warn("Could not load forms:", err);
    section.style.display = "none";
  }
};
// load alternate form, keep using the base species ID for consistency

const pokedexForm = async (formSlug, baseId) => {
  showLoading();
  try {
    const pokeRes = await fetch(`${API_BASE}/pokemon/${formSlug}`);
    if (!pokeRes.ok) throw new Error("Form not found");
    const data = await pokeRes.json();

    hideLoading();
    flashScreen();
    displayPokemon(data, baseId);

    displayForms(baseId, formSlug);

  } catch (err) {
    hideLoading();
    showError("Form data not available!");
    console.error("Form fetch error:", err);
  }
};

const buildChainTree = (chainNode) => ({
  name: chainNode.species.name,
  evolvesTo: (chainNode.evolves_to || []).map(buildChainTree)
});

const fetchEvolutionChain = async (pokemonId) => {
  const speciesRes = await fetch(`${API_BASE}/pokemon-species/${pokemonId}`);
  if (!speciesRes.ok) throw new Error(`Species fetch failed for id: ${pokemonId}`);
  const speciesData = await speciesRes.json();

  if (!speciesData.evolution_chain?.url) throw new Error("No evolution chain URL");

  const chainRes = await fetch(speciesData.evolution_chain.url);
  if (!chainRes.ok) throw new Error("Chain fetch failed");
  const chainData = await chainRes.json();

  if (!chainData.chain) throw new Error("Chain data malformed");

  return buildChainTree(chainData.chain);
};

const countNodes = (tree) =>
  1 + tree.evolvesTo.reduce((sum, child) => sum + countNodes(child), 0);

const makeEvoMember = (name, spriteUrl, currentPokemonName) => {
  const member = document.createElement("div");
  member.className = "evo-member";
  if (name === currentPokemonName) member.classList.add("current-pokemon");
  member.innerHTML = `
    ${spriteUrl ? `<img class="evo-sprite" src="${spriteUrl}" alt="${name}">` : ""}
    <span class="evo-name">${name.toUpperCase()}</span>
  `;
  member.addEventListener("click", () => {
    document.getElementById("search-input").value = name;
    pokedex(name);
  });
  return member;
};

const collectNames = (tree) => [
  tree.name,
  ...tree.evolvesTo.flatMap(collectNames)
];

// fetch all evolution sprites upfront to avoid waterfall effect
const displayEvolutionChain = async (currentPokemonId, currentPokemonName) => {
  const section   = document.getElementById("evolution-section");
  const container = document.getElementById("evolution-chain");
  container.innerHTML = "";

  try {
    const tree = await fetchEvolutionChain(currentPokemonId);

    if (countNodes(tree) <= 1) {
      section.style.display = "none";
      return;
    }

    const allNames = collectNames(tree);
    const spriteMap = {};
    await Promise.allSettled(
      allNames.map(async (name) => {
        try {
          const d = await resolvePokemon(name);
          spriteMap[name] = d.sprites.front_default || "";
        } catch (_) {
          spriteMap[name] = "";
        }
      })
    );

    // Render using prefetched sprites
    const renderNode = (tree, container) => {
      const member = document.createElement("div");
      member.className = "evo-member";
      if (tree.name === currentPokemonName) member.classList.add("current-pokemon");
      const spriteUrl = spriteMap[tree.name] || "";
      member.innerHTML = `
        ${spriteUrl ? `<img class="evo-sprite" src="${spriteUrl}" alt="${tree.name}">` : ""}
        <span class="evo-name">${tree.name.toUpperCase()}</span>
      `;
      member.addEventListener("click", () => {
        document.getElementById("search-input").value = tree.name;
        pokedex(tree.name);
      });
      container.appendChild(member);

      if (tree.evolvesTo.length === 0) return;

      const arrow = document.createElement("span");
      arrow.className = "evo-arrow";
      arrow.textContent = "→";
      container.appendChild(arrow);

      if (tree.evolvesTo.length === 1) {
        renderNode(tree.evolvesTo[0], container);
      } else {
        const splitCol = document.createElement("div");
        splitCol.className = "evo-split-col";
        for (const branch of tree.evolvesTo) {
          const row = document.createElement("div");
          row.className = "evo-split-row";
          renderNode(branch, row);
          splitCol.appendChild(row);
        }
        container.appendChild(splitCol);
      }
    };

    section.style.display = "block";
    renderNode(tree, container);

  } catch (err) {
    console.warn("Could not load evolution chain:", err);
    section.style.display = "none";
  }
};

// try direct fetch for most pokemon, fallback to species endpoint for edge cases
const resolvePokemon = async (slug, signal) => {
  let res = await fetch(`${API_BASE}/pokemon/${slug}`, { signal });
  if (res.ok) return res.json();

  const speciesRes = await fetch(`${API_BASE}/pokemon-species/${slug}`, { signal });
  if (speciesRes.ok) {
    const speciesData = await speciesRes.json();
    const defaultVariety = speciesData.varieties?.find(v => v.is_default);
    if (defaultVariety) {
      const varRes = await fetch(defaultVariety.pokemon.url, { signal });
      if (varRes.ok) return varRes.json();
    }
  }

  throw new Error("Not found");
};

// main search handler - cancel previous request if user searches again quickly
const pokedex = async (pokeName) => {
  currentRequestId++;
  const thisRequestId = currentRequestId;
  const controller = new AbortController();
  const { signal } = controller;

  showLoading();
  try {
    const slug = String(pokeName).toLowerCase().trim();
    const data = await resolvePokemon(slug, signal);

    if (thisRequestId !== currentRequestId) return;

    // use species ID so forms have consistent ID across variants
    const speciesUrl = data.species?.url || "";
    const speciesIdMatch = speciesUrl.match(/pokemon-species\/([\d]+)/);
    const speciesId = speciesIdMatch ? parseInt(speciesIdMatch[1]) : data.id;

    hideLoading();
    flashScreen();
    displayPokemon(data, speciesId);

    displayForms(speciesId, data.name);
    displayEvolutionChain(speciesId, data.name);

  } catch (error) {
    if (error.name === "AbortError") return;
    hideLoading();
    showError("Pokémon not found!");
    console.error("Error:", error);
  }
};

const displayPokemon = (pokemon, overrideId = null) => {
  document.getElementById("sprite").style.display  = "block";
  document.getElementById("weight").style.display  = "block";
  document.getElementById("height").style.display  = "block";
  document.getElementById("types").style.display   = "flex";
  document.querySelectorAll("p.stat").forEach(p => p.style.display = "block");

  document.getElementById("pokemon-name").textContent = pokemon.name.toUpperCase();
  document.getElementById("sprite").src = pokemon.sprites.front_default;
  // overrideId is the species ID, needed for forms to show correct number
  document.getElementById("pokemon-id").textContent = overrideId ?? pokemon.id;
  const weightKg = (pokemon.weight / 10).toFixed(1);
  const heightM  = (pokemon.height / 10).toFixed(1);
  document.getElementById("weight").textContent = `Weight: ${weightKg} kg`;
  document.getElementById("height").textContent = `Height: ${heightM} m`;

  const typesContainer = document.getElementById("types");
  typesContainer.innerHTML = "";
  pokemon.types.forEach(typeObj => {
    const typeName = typeObj.type.name;
    const typeElement = document.createElement("div");
    typeElement.className = "type-badge";
    typeElement.innerHTML = `${typeIcons[typeName] || typeIcons.normal}<span>${typeName.toUpperCase()}</span>`;
    typeElement.style.backgroundColor = typeColors[typeName] || "#777";
    typesContainer.appendChild(typeElement);
  });

  const getStat = (name) => pokemon.stats.find(st => st.stat.name === name).base_stat;
  setStatBar("bar-hp",         "val-hp",         "row-hp",         getStat("hp"));
  setStatBar("bar-attack",     "val-attack",     "row-attack",     getStat("attack"));
  setStatBar("bar-defense",    "val-defense",    "row-defense",    getStat("defense"));
  setStatBar("bar-sp-attack",  "val-sp-attack",  "row-sp-attack",  getStat("special-attack"));
  setStatBar("bar-sp-defense", "val-sp-defense", "row-sp-defense", getStat("special-defense"));
  setStatBar("bar-speed",      "val-speed",      "row-speed",      getStat("speed"));
};

const flashScreen = () => {
  const flash = document.getElementById("flash");
  flash.style.opacity = 1;
  setTimeout(() => { flash.style.opacity = 0; }, 100);
};

const randomBtn = document.getElementById("random-button");

randomBtn.addEventListener("click", async () => {
  randomBtn.disabled = true;
  randomBtn.textContent = "...";
  setTimeout(() => {
    randomBtn.disabled = false;
    randomBtn.textContent = "? Random";
  }, 2000);

  const randomId = Math.floor(Math.random() * 1025) + 1;
  document.getElementById("search-input").value = randomId;
  try {
    const data = await resolvePokemon(String(randomId));
    document.getElementById("search-input").value = data.name;
  } catch (_) {}
  pokedex(String(randomId));
});

document.getElementById("search-button").addEventListener("click", () => {
  const val = document.getElementById("search-input").value.trim();
  if (val) pokedex(val);
});

document.getElementById("search-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const val = document.getElementById("search-input").value.trim();
    if (val) pokedex(val);
  }
});


showDefaultScreen();
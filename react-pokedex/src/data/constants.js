export const API_BASE = "https://pokeapi.co/api/v2";

export const typeColors = {
  normal: "#A8A77A", fire: "#EE8130", water: "#6390F0", electric: "#F7D02C",
  grass: "#7AC74C", ice: "#96D9D6", fighting: "#C22E28", poison: "#A33EA1",
  ground: "#E2BF65", flying: "#A98FF3", psychic: "#F95587", bug: "#A6B91A",
  rock: "#B6A136", ghost: "#735797", dragon: "#6F35FC", dark: "#705746",
  steel: "#B7B7CE", fairy: "#D685AD",
};

export const formColors = {
  "mega":     "#8e44ad", "mega-x":  "#2471a3", "mega-y":   "#c0392b",
  "gmax":     "#d35400", "alola":   "#f1c40f", "alolan":   "#f1c40f",
  "galar":    "#1a5276", "galarian":"#1a5276", "hisui":    "#b7950b",
  "hisuian":  "#b7950b", "paldea":  "#6d4c41", "paldean":  "#6d4c41",
  "origin":   "#5d6d7e", "sky":     "#85c1e9", "therian":  "#52be80",
  "black":    "#212121", "white":   "#7f8c8d", "resolute": "#e74c3c",
  "primal":   "#922b21",
};

export const officialMegas = new Set([
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
  "sharpedo-mega", "camerupt-mega",
]);

export const getFormLabel = (baseName, fullName) => {
  if (fullName === baseName) return "BASE";
  return fullName.replace(`${baseName}-`, "").replace(/-/g, " ").toUpperCase();
};

export const getFormColor = (fullName, baseName) => {
  const suffix = fullName.replace(`${baseName}-`, "").toLowerCase();
  for (const [key, color] of Object.entries(formColors)) {
    if (suffix.includes(key)) return color;
  }
  return "#546e7a";
};

export const isOfficialForm = (name) => {
  if (!name.includes("-mega") && !name.includes("-primal")) return true;
  return officialMegas.has(name);
};

export const statColor = (value) => {
  if (value >= 90) return "#27ae60";
  if (value >= 60) return "#f39c12";
  if (value >= 35) return "#e67e22";
  return "#e74c3c";
};

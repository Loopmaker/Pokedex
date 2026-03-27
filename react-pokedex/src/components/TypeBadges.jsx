import { typeColors } from "../data/constants.js";

const typeIcons = {
  normal: "icons/normal.svg", fire: "icons/fire.svg", water: "icons/water.svg",
  electric: "icons/electric.svg", grass: "icons/grass.svg", ice: "icons/ice.svg",
  fighting: "icons/fighting.svg", poison: "icons/poison.svg", ground: "icons/ground.svg",
  flying: "icons/flying.svg", psychic: "icons/psychic.svg", bug: "icons/bug.svg",
  rock: "icons/rock.svg", ghost: "icons/ghost.svg", dragon: "icons/dragon.svg",
  dark: "icons/dark.svg", steel: "icons/steel.svg", fairy: "icons/fairy.svg",
};

const TypeBadges = ({ types }) => (
  <div id="types">
    {types.map(({ type }) => (
      <div
        key={type.name}
        className="type-badge"
        style={{ backgroundColor: typeColors[type.name] || "#777" }}
      >
        <img className="type-icon" src={typeIcons[type.name]} alt={type.name} />
        <span>{type.name.toUpperCase()}</span>
      </div>
    ))}
  </div>
);

export default TypeBadges;

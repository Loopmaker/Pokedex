import { getFormLabel, getFormColor, isOfficialForm } from "../data/constants.js";

const Forms = ({ varieties, baseName, activeForm, onSelectForm, speciesId }) => {
  const filtered = varieties.filter(({ pokemon }) => isOfficialForm(pokemon.name));
  if (filtered.length <= 1) return null;

  return (
    <div className="forms-section">
      <h3 className="forms-title">FORMS</h3>
      <div className="forms-list">
        {filtered.map(({ pokemon, is_default }) => {
          const label = getFormLabel(baseName, pokemon.name);
          const color = is_default ? "#2c3e50" : getFormColor(pokemon.name, baseName);
          const isActive = pokemon.name === activeForm;

          return (
            <button
              key={pokemon.name}
              className={`form-badge${isActive ? " form-badge-active" : ""}`}
              style={{ backgroundColor: color }}
              onClick={() => onSelectForm(pokemon.name, speciesId)}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Forms;

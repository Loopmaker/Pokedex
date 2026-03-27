import { useEffect, useRef } from "react";
import { statColor } from "../data/constants.js";

const STATS = [
  { key: "hp",              label: "HP"    },
  { key: "attack",          label: "ATK"   },
  { key: "defense",         label: "DEF"   },
  { key: "special-attack",  label: "SpATK" },
  { key: "special-defense", label: "SpDEF" },
  { key: "speed",           label: "SPD"   },
];

const StatBar = ({ label, value }) => {
  const barRef = useRef(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    // Reset then animate
    bar.style.transition = "none";
    bar.style.width = "0%";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bar.style.transition = "width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
        bar.style.width = `${(value / 255) * 100}%`;
      });
    });
  }, [value]);

  return (
    <div className="stat-row">
      <span className="stat-label">{label}</span>
      <div className="stat-bar-bg">
        <div
          ref={barRef}
          className="stat-bar"
          style={{ backgroundColor: statColor(value) }}
        />
      </div>
      <span className="stat-val">{value}</span>
    </div>
  );
};

const StatBars = ({ stats }) => {
  const getStat = (key) =>
    stats.find((s) => s.stat.name === key)?.base_stat ?? 0;

  return (
    <div className="stats-container">
      {STATS.map(({ key, label }) => (
        <StatBar key={key} label={label} value={getStat(key)} />
      ))}
    </div>
  );
};

export default StatBars;

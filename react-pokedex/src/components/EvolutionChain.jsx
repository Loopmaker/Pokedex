const countNodes = (tree) =>
  1 + tree.evolvesTo.reduce((sum, child) => sum + countNodes(child), 0);

const EvoNode = ({ tree, sprites, currentName, onSelect }) => {
  const spriteUrl = sprites[tree.name] || "";

  return (
    <>
      <div
        className={`evo-member${tree.name === currentName ? " current-pokemon" : ""}`}
        onClick={() => onSelect(tree.name)}
      >
        {spriteUrl && (
          <img className="evo-sprite" src={spriteUrl} alt={tree.name} />
        )}
        <span className="evo-name">{tree.name.toUpperCase()}</span>
      </div>

      {tree.evolvesTo.length > 0 && (
        <>
          <span className="evo-arrow">→</span>
          {tree.evolvesTo.length === 1 ? (
            <EvoNode
              tree={tree.evolvesTo[0]}
              sprites={sprites}
              currentName={currentName}
              onSelect={onSelect}
            />
          ) : (
            <div className="evo-split-col">
              {tree.evolvesTo.map((branch) => (
                <div key={branch.name} className="evo-split-row">
                  <EvoNode
                    tree={branch}
                    sprites={sprites}
                    currentName={currentName}
                    onSelect={onSelect}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
};

const EvolutionChain = ({ tree, sprites, currentName, onSelect }) => {
  if (!tree || countNodes(tree) <= 1) return null;

  return (
    <div className="evolution-section">
      <h3 className="evo-title">EVOLUTION</h3>
      <div className="evolution-chain">
        <EvoNode
          tree={tree}
          sprites={sprites}
          currentName={currentName}
          onSelect={onSelect}
        />
      </div>
    </div>
  );
};

export default EvolutionChain;

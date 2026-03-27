const LoadingOverlay = ({ visible }) => {
  if (!visible) return null;
  return (
    <div className="loading-overlay">
      <div className="pokeball">
        <div className="pokeball-top" />
        <div className="pokeball-mid" />
        <div className="pokeball-bottom" />
        <div className="pokeball-btn" />
      </div>
      <p className="loading-text">Searching...</p>
    </div>
  );
};

export default LoadingOverlay;

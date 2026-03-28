import { useState, useRef, useCallback } from "react";
import { API_BASE } from "../data/constants.js";

export const resolvePokemon = async (slug, signal) => {
  let res = await fetch(`${API_BASE}/pokemon/${slug}`, { signal });
  if (res.ok) return res.json();

  const speciesRes = await fetch(`${API_BASE}/pokemon-species/${slug}`, { signal });
  if (speciesRes.ok) {
    const speciesData = await speciesRes.json();
    const defaultVariety = speciesData.varieties?.find((v) => v.is_default);
    if (defaultVariety) {
      const varRes = await fetch(defaultVariety.pokemon.url, { signal });
      if (varRes.ok) return varRes.json();
    }
  }
  throw new Error("Not found");
};

const buildChainTree = (node) => ({
  name: node.species.name,
  evolvesTo: (node.evolves_to || []).map(buildChainTree),
});

const collectNames = (tree) => [
  tree.name,
  ...tree.evolvesTo.flatMap(collectNames),
];

export const usePokemon = () => {
  const [pokemon, setPokemon]         = useState(null);
  const [speciesId, setSpeciesId]     = useState(null);
  const [forms, setForms]             = useState([]);
  const [baseName, setBaseName]       = useState("");
  const [activeForm, setActiveForm]   = useState("");
  const [evoTree, setEvoTree]         = useState(null);
  const [evoSprites, setEvoSprites]   = useState({});
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");

  const requestIdRef = useRef(0);

  const fetchForms = useCallback(async (sid, currentFormName) => {
    try {
      const res = await fetch(`${API_BASE}/pokemon-species/${sid}`);
      if (!res.ok) return;
      const data = await res.json();
      setBaseName(data.name);
      setForms(data.varieties || []);
      setActiveForm(currentFormName);
    } catch (_) {}
  }, []);

  const fetchEvoChain = useCallback(async (sid) => {
    try {
      const speciesRes = await fetch(`${API_BASE}/pokemon-species/${sid}`);
      if (!speciesRes.ok) return;
      const speciesData = await speciesRes.json();
      if (!speciesData.evolution_chain?.url) return;

      const chainRes = await fetch(speciesData.evolution_chain.url);
      if (!chainRes.ok) return;
      const chainData = await chainRes.json();
      if (!chainData.chain) return;

      const tree = buildChainTree(chainData.chain);

      const names = collectNames(tree);
      const spriteMap = {};
      await Promise.allSettled(
        names.map(async (name) => {
          try {
            const d = await resolvePokemon(name);
            spriteMap[name] = d.sprites.front_default || "";
          } catch (_) {
            spriteMap[name] = "";
          }
        })
      );

      setEvoTree(tree);
      setEvoSprites(spriteMap);
    } catch (_) {}
  }, []);

  const search = useCallback(async (query) => {
    requestIdRef.current += 1;
    const thisId = requestIdRef.current;
    const controller = new AbortController();

    setLoading(true);
    setError("");

    try {
      const data = await resolvePokemon(String(query).toLowerCase().trim(), controller.signal);
      if (thisId !== requestIdRef.current) return;

      const speciesUrl = data.species?.url || "";
      const match = speciesUrl.match(/pokemon-species\/([\d]+)/);
      const sid = match ? parseInt(match[1]) : data.id;

      setPokemon(data);
      setSpeciesId(sid);
      setLoading(false);

      fetchForms(sid, data.name);
      fetchEvoChain(sid);
    } catch (err) {
      if (err.name === "AbortError") return;
      setLoading(false);
      setError("Pokémon not found!");
    }
  }, [fetchForms, fetchEvoChain]);

  const loadForm = useCallback(async (formSlug, sid) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/pokemon/${formSlug}`);
      if (!res.ok) throw new Error("Form not found");
      const data = await res.json();
      setPokemon(data);
      setSpeciesId(sid);
      setActiveForm(formSlug);
      setLoading(false);
      fetchForms(sid, formSlug);
    } catch (err) {
      setLoading(false);
      setError("Form data not available!");
    }
  }, [fetchForms]);

  return {
    pokemon, speciesId, forms, baseName, activeForm,
    evoTree, evoSprites, loading, error,
    search, loadForm,
  };
};

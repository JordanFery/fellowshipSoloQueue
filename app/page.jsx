"use client";

import { useEffect, useState } from "react";
import Header from "./components/header";

export default function PlayersPage() {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);

  // Filtres
  const [filterHero, setFilterHero] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterLoc, setFilterLoc] = useState("");
  const [filterKey, setFilterKey] = useState("");
  const [copyMessage, setCopyMessage] = useState('');



  const getRoleColor = (role) => {
    switch (role) {
      case "HEAL":
      case "Healer":
        return "bg-green-500/70 border-green-500";
      case "TANK":
      case "Tank":
        return "bg-blue-600/70 border-blue-500";
      case "DPS":
        return "bg-red-500/70 border-red-500";
      default:
        return "bg-gray-700/90 border-gray-500";
    }
  };


  const fetchPlayers = () => {
    fetch("/api/players")
      .then((res) => res.json())
      .then((data) => setPlayers(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    //   // 1) Chargement initial
    fetchPlayers();

    // 2) Mise à jour automatique toutes les 2 secondes
    const interval = setInterval(() => {
      fetchPlayers();
    }, 2000); // ← modifie ici si tu veux plus/moins fréquent

    // Nettoyage quand on quitte la page
    return () => clearInterval(interval);
  }, []);


  // Filtre appliqué automatiquement dès qu'un filtre change
  useEffect(() => {
    let result = players;

    if (filterHero) {
      result = result.filter((p) => p.hero.toLowerCase() === filterHero);
    }

    if (filterRole) {
      result = result.filter((p) => p.role.toLowerCase() === filterRole);
    }

    if (filterLoc) {
      result = result.filter((p) => p.localisation === filterLoc);
    }

    if (filterKey) {
      result = result.filter((p) => Number(p.highestKey) >= Number(filterKey));
    }

    setFilteredPlayers(result);
  }, [filterHero, filterRole, filterLoc, filterKey, players]);

  return (
    <div className="p-4">
      <Header />
      <h1 className="text-2xl font-bold mb-4 mt-40">Players searching for mates</h1>
      {copyMessage && (
        <div className="px-4 py-2 rounded shadow-md text-center">
          <p className="text-center text-green-400">
            {copyMessage}
          </p>
        </div>

      )}


      {/* --- FILTRES --- */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        {/* Filtre Hero */}
        <select
          value={filterHero}
          onChange={(e) => setFilterHero(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Tous les héros</option>
          <option value="ardeos">Ardeos</option>
          <option value="elarion">Elarion</option>
          <option value="helena">Helena</option>
          <option value="mara">Mara</option>
          <option value="meiko">Meiko</option>
          <option value="rime">Rime</option>
          <option value="sylvie">Sylvie</option>
          <option value="tariq">Tariq</option>
          <option value="vigour">Vigour</option>
        </select>

        {/* Filtre Role */}
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All roles</option>
          <option value="dps">DPS</option>
          <option value="tank">Tank</option>
          <option value="heal">Healer</option>
        </select>

        {/* Filtre Localisation */}
        <select
          value={filterLoc}
          onChange={(e) => setFilterLoc(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All around the wolrd</option>
          <option value="EU">Europe</option>
          <option value="NA">North America</option>
          <option value="ASIA">Asia</option>
        </select>

        {/* Filtre clé recherchée >= */}
        <input
          type="number"
          placeholder="Key minimum"
          min={0}
          value={filterKey}
          onChange={(e) => setFilterKey(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* --- TON RETURN NORMAL --- */}
      {filteredPlayers.length === 0 && <p>No player for the moment.</p>}

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {filteredPlayers.map((player) => (
          <li
            key={player.id}
            className={`border p-4 rounded shadow flex pl-10 gap-4 flex-col ${getRoleColor(player.role)}`}
          >
            <img
              src={player.imageHero}
              alt={player.hero}
              className="w-16 h-16 rounded"
            />
            <div>
              <p><strong>Localisation:</strong> {player.localisation}</p>
              <p><strong>Hero:</strong> {player.hero}</p>
              <p><strong>Role:</strong> {player.role}</p>
              <p><strong>Highest timed dungeon:</strong> {player.highestKey}</p>
              <p><strong>Reaserched difficulty:</strong> {player.keyResearched}</p>
              <p><strong>Rating:</strong> {player.rating}</p>
              <p>
                <button
                  onClick={() => {
                    if (player.invitationLink) {
                      navigator.clipboard.writeText(player.invitationLink);
                      setCopyMessage('Lien copié !');
                      setTimeout(() => setCopyMessage(''), 2000);
                    }
                  }}
                  className="bg-slate-800 text-white px-2 py-1 rounded-md hover:cursor-pointer mt-2"
                >
                  Copy Friendcode
                </button>
              </p>

            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}



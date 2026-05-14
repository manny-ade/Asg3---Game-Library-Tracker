import { useState } from "react";
import { supabase } from "./lib/supabaseClient";
import Card from "./components/Card";

export default function findGames({session}) {

  const [searchTerm, setSearchTerm] = useState("");
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the page from refreshing on 'Enter'
    if (!searchTerm) return;

    setLoading(true);


    const { data, error } = await supabase.functions.invoke("igdb-search", {
      body: { searchTerm },
    });


    if (error) {
      console.error("Error fetching games:", error);
    } else if (data) {
      const normalizedData = data.map((game: any) => 
    ({
        game_id: game.id, // Save the IGDB id 
        title: game.name,
        cover_url: game.cover?.url ? `https:${game.cover.url.replace('t_thumb', 't_cover_big')}` : null,
        summary: game.summary,
        rating: game.rating

    }));
      setGames(normalizedData);
      console.log(normalizedData); // for checking
    }
    
    setLoading(false);
  };

const handleAddToLibrary = async (game: any) => {
  console.log("Attempting to add:", game.title);

  const { error } = await supabase
    .from('collection')
    .insert([
      {
        game_id: game.game_id,
        title: game.title,
        cover_url: game.cover_url,
        summary: game.summary,
        rating: game.rating,
        user_id: session.user.id 
      }
    ]);

  if (error) {
    console.error("Supabase Insert Error:", error);
    alert("Error: " + error.message);
  } else {
    alert(`🎮 ${game.title} added to your library!`);
  }
};

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold text-white mb-8">Find New Games</h1>

      {/* THE SEARCH BAR */}
      <form onSubmit={handleSearch} className="w-full max-w-md flex gap-2 mb-10">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for Halo, Zelda..."
          className="flex-1 px-4 py-2 rounded bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-purple-500"
        />
        <button 
          type="submit" 
          className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded text-white font-semibold transition-colors"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* THE GRID (Using Tailwind for a nice responsive layout) */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {games.length > 0 ? (
          games.map((game) => (
            <Card 
              key={game.game_id} 
              game={game}
              onAdd={handleAddToLibrary} 
            />
          ))
        ) : (
          /* Empty state when no games have been searched yet */
          <div className="col-span-full text-center text-slate-400 mt-10">
            {loading ? "Searching..." : "Search for a game to add to your library."}
          </div>
        )}
      </div>
    </div>
  );
}

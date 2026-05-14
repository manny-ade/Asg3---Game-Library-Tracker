import { useState, useEffect } from "react";
import { supabase } from "./lib/supabaseClient";
import Card from "./components/Card";

export default function userLibrary({ session }) {

    const [myGames, setMyGames] = useState([]);

    //get library 
    const fetchLibrary = async () => {
    const { data, error } = await supabase
      .from('collection')
      .select('*')
      .eq('user_id', session.user.id); 
      
    if (data) setMyGames(data);
  };

  useEffect(() => {
    fetchLibrary();
  }, [session]); 

  //update game status
  const handleUpdateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from('collection')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      // Refresh the UI without making another database call
      setMyGames(myGames.map(game => 
        game.id === id ? { ...game, status: newStatus } : game
      ));
    }
  };

  //to delete from library
  const handleDeleteGame = async (id) => {
    const { error } = await supabase
      .from('collection')
      .delete()
      .eq('id', id);

    if (!error) {
       // Remove it from the screen immediately
      setMyGames(myGames.filter(game => game.id !== id));
    }
  };


  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold text-white mb-8">My Game Library</h1>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {myGames.length > 0 ? (
          myGames.map((game) => (
            <Card 
              key={game.id} 
              game={game} 
              // Notice we pass onDelete and onUpdate, NOT onAdd!
              onDelete={handleDeleteGame}
              onUpdate={handleUpdateStatus}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-slate-400 mt-10">
            Your library is empty. Go find some games!
          </p>
        )}
      </div>
    </div>
  );

}
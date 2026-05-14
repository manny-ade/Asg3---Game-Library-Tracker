import React from "react";
import controllerIcon from "../assets/controller.jpg";

const Card = (props) => {
  const { game, onAdd, onDelete, onUpdate } = props;
  const coverUrl = game.cover_url;
  // Check if rating exists first, then round it.
  const displayRating = game.rating ? Math.round(game.rating) : "N/A";
  const shortSummary =
    game.summary?.length > 100
      ? game.summary.substring(0, 100) + "..."
      : game.summary;

  return (
  <div className="group relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-purple-500 transition-all duration-300 hover:-translate-y-2 shadow-lg hover:shadow-purple-500/20 flex flex-col">
    
    {/* 1. IMAGE SECTION: Overlay stays here */}
    <div className="relative aspect-[3/4] overflow-hidden">
      <img 
        src={coverUrl || controllerIcon} 
        alt={game.title} 
        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" 
      />
      {/* The gradient only covers the image now */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
      
      {/* Rating Badge - pinned to the image area */}
      <div className="absolute top-2 right-2 bg-purple-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg">
        {displayRating}%
      </div>
    </div>

    {/* 2. CONTENT SECTION: Clean background for readability */}
    <div className="p-4 flex flex-col flex-1 gap-3">
      <div>
        <h3 className="text-lg font-bold text-white truncate">{game.title}</h3>
        <p className="text-slate-400 text-xs line-clamp-2 mt-1">{shortSummary}</p>
      </div>

      {/* 3. BUTTON SECTION: Using flex gap instead of <br> */}
      <div className="mt-auto flex flex-col gap-2">
        {onAdd && (
        <button 
          onClick={() => onAdd(game)}
          className="w-full text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 font-medium rounded-lg text-sm px-4 py-2 transition-all"
        >
          Add to Library
        </button>
        )}


        {onDelete && (
          <>
            {/* The "U" in CRUD */}
            <select title="status_select"
              value={game.status || 'Backlog'} 
              onChange={(e) => onUpdate(game.id, e.target.value)}
              className="w-full bg-slate-800 text-white text-sm rounded-lg border border-slate-700 p-2"
            >
              <option value="Backlog">Backlog</option>
              <option value="Currently Playing">Currently Playing</option>
              <option value="Completed">Completed</option>
            </select>

            {/* The "D" in CRUD */}
            <button onClick={() => onDelete(game.id)} className="w-full text-red-400 bg-red-950/30 hover:bg-red-900/50 border border-red-900/50 font-medium rounded-lg text-sm px-4 py-2 mt-1">
              Remove Game
            </button>
          </>
        )}
      </div>
    </div>
  </div>
);
};
export default Card;

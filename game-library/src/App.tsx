import { useState, useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "./lib/supabaseClient";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Components
import Nav from "./components/nav";
import UserLibrary from "./userlibrary"; // Changed to PascalCase
import FindGames from "./findGames";     // Changed to PascalCase

import "./App.css";

function App() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- 1. THE AUTH GATE ---
  // If no session, show ONLY the login screen. No router needed here.
  if (!session) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950 to-black">
       <Router> <Nav /></Router>
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-[400px] bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl">
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={["github"]}
            />
          </div>
        </main>
      </div>
    );
  }

  // --- 2. THE AUTHENTICATED APP ---
  // If we reach this point, the user is logged in.
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-950 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950 to-black">
        {/* Nav stays outside Routes so it's visible on every page */}
        <Nav session={session} /> 

        <main className="flex-1 p-6">
          <Routes>
            {/* The Library is your "Home" page */}
            <Route path="/" element={<UserLibrary session={session} />} />
            
            {/* The Search page */}
            <Route path="/search" element={<FindGames session={session} />} />

            {/* Catch-all: Redirect back to library if URL is wrong */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
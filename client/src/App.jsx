import { useState, useEffect } from "react";
import { auth } from "./services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { BrowserRouter as Router } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // 💡 FIXED: Always set the user if Firebase authenticates them successfully!
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-xs font-black tracking-wider uppercase text-slate-400 animate-pulse">
          Loading Application Environment...
        </p>
      </div>
    );
  }

  return (
    <Router>
      {/* If logged in, pass user to dashboard where it handles missing tokens gracefully */}
      {user ? <Dashboard user={user} /> : <Login />}
    </Router>
  );
}

export default App;
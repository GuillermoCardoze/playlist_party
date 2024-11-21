import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./NavBar";
import PlaylistParty from "./PlaylistParty";
import Playlists from "./Playlists";
import Songs from "./Songs";





function App() {
  const [songs, setSongs] = useState([])

  useEffect(()=>{
      fetch('/songs')
      .then(res => res.json())
      .then(res => setSongs(res))
  },[])





  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<PlaylistParty />} />
          <Route path="songs" element={<Songs songs={songs}/>} />
          <Route path="playlists" element={<Playlists />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

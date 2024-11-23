import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./NavBar";
import NewForm from "./SongForm";
import Playlists from "./Playlists";
import Songs from "./Songs";
import Home from "./Home";





function App() {
  // const [songs, setSongs] = useState([])

  // useEffect(()=>{
  //     fetch('/songs')
  //     .then(res => res.json())
  //     .then(res => setSongs(res))
  // },[])





  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="songs" element={<Songs />} />
          <Route path="playlists" element={<Playlists />} />
          <Route path="/form" element={<NewForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Navbar from "./NavBar";
// import Playlists from "./Playlists";
// import Songs from "./Songs";
// import Home from "./Home";







// function App() {
//    const [songs, setSongs] = useState([])

//    useEffect(()=>{
//        fetch('/songs')
//        .then(res => res.json())
//        .then(res => setSongs(res))
//    },[])





//   return (
//     <Router>
//       <div className="App">
//         <Navbar />
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="songs" element={<Songs songs={songs} setSongs={setSongs}/>} />
//           <Route path="playlists" element={<Playlists />} />

//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;


///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////




import React, { useState, useEffect } from 'react';
import Songs from './Songs';

function App() {
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch('/songs').then((res) => res.json()),
      fetch('/playlists').then((res) => res.json()),
      fetch('/party').then((res) => res.json()),
    ])
      .then(([songsData, playlistsData, partyData]) => {
        setPlaylists(playlistsData);

        const mergedSongs = songsData.map((song) => {
          const partyInfo = partyData.find((party) => party.song_id === song.id);
          return {
            ...song,
            playlist_id: partyInfo?.playlist_id || null,
            explicit: partyInfo?.explicit || false,
          };
        });

        setSongs(mergedSongs);
      })
      .catch((err) => console.error('Error fetching data:', err));
  }, []);

  return (
    <div>
      <h1>Music App</h1>
      <Songs songs={songs} playlists={playlists} setSongs={setSongs} />
    </div>
  );
}

export default App;


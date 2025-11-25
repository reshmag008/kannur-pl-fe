import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PlayerList from "./pages/PlayerList";
import PlayerRegistration from "./pages/PlayerRegistration";
import AuctionCenter from "./pages/AuctionCenter";
import PlayerDisplay from "./pages/PlayerDisplay";
import TeamList from "./pages/TeamList";
import TeamRegistration from "./pages/TeamRegistration";
function AppRouter() {
  return (
    <div>
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/player-list" element={<PlayerList />} />
            <Route path="/player-registration" element={<PlayerRegistration />} />
            <Route path="/auction-center" element={<AuctionCenter />} />
            <Route path="/player-display" element={<PlayerDisplay />} />
            <Route path="/team-list" element={<TeamList />} />
            <Route path="/team-registration" element={<TeamRegistration />} />
            
          </Routes>
        </div>
    </div>
  );
}

export default AppRouter;
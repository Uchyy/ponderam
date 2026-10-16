
import { createBrowserRouter } from "react-router-dom";

import Home from "./pages/Home.tsx";
import LeaderBoard from "./pages/LeaderBoard.tsx";
import Profile from "./pages/Profile.tsx";
import CreateAccount from "./pages/CreateAccount.tsx";
import GlobalLobby from "./pages/GlobalLobby.tsx";
import CreateGame from "./pages/GameFlow/CreateGame.tsx";
import WaitingRoom from "./pages/GameFlow/WaitingRoom.tsx";
import GameGateway from "./pages/GameFlow/GameGateway";
import GameUnavailable from "./pages/GameFlow/GameUnavailable";
import AuthCallback from "./pages/AuthCallback";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/leaderboard", element: <LeaderBoard /> },
  { path: "/profile", element: <Profile /> },
  { path: "/create-account", element: <CreateAccount /> },
  { path: "/lobby", element: <GlobalLobby /> },

  { path: "/create-game", element: <CreateGame /> }, 
  { path: "/game/:code", element: <GameGateway /> },
  { path: "/game/:code/waiting", element: <WaitingRoom /> },
  { path: "/game-unavailable", element: <GameUnavailable /> },
  
  { path: "/auth/callback", element: <AuthCallback />,},

]);

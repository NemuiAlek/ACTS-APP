import 'bootstrap/dist/css/bootstrap.min.css';
import './css/App.css';
import './css/monster.css';
import './css/combat.css';
import { Link, Route, Routes } from "react-router-dom";

//Home Page and Nav Bar
import Index from "./components/index"
import Nav from "./components/Nav"

// Monster Routes
import MonsterStandard from "./components/monster/monster"
import MonsterStandardDetail from "./components/monster/monsterDetail"
import MonsterCreateModify from "./components/monster/monsterCreate_Modify"

// Combat Routes
import CombatCreate from "./components/combat/combatCreate"
import CombatTrack from "./components/combat/combatTrack"

// About Screen
import About from "./components/about"

// User Routes
import SignUp from "./components/auth/signUp"
import LogIn from "./components/auth/logIn"
import Profile from "./components/auth/profile"
import { UserProvider } from "./contexts/UserContext";


function App() {

  return (
    <div className="main">
    <UserProvider>

    <Nav />

        <Routes>
        {/* Home Page */}
          <Route path="/" element={<Index />} />

        {/* Monster Routes */}
          <Route path="/Monster/:id" element={<MonsterStandard />} />
          <Route path="/Monster/detail/:id" element={<MonsterStandardDetail />} />
          <Route path="/Monster/create-modify/:id" element={<MonsterCreateModify />} />


        {/* Combat Routes */}
          <Route path="/combat" element={<CombatCreate />} />
          <Route path="/combattrack/:id" element={<CombatTrack />} />

        {/* About Screen */}
          <Route path="/About" element={<About />} />
        
        {/* User routes */}
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/LogIn" element={<LogIn />}/>
          <Route path="/Profile/:id" element={<Profile />}/>
          
        </Routes>
      </UserProvider>
    </div>
  );
}

export default App;

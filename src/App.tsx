import { invoke } from "@tauri-apps/api";
import "./App.css";
import MainPanel from "./components/app/main-panel";
import NavBar from "./components/app/nav-bar";

function App() {

  invoke("log", {log: 'Starting..'})

  return (
    <main id="main" className="flex flex-col gap-2">
      <NavBar />
      <MainPanel />
    </main>
  );
}

export default App;

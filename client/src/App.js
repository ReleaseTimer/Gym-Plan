import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Gymplan from "./components/Gymplan/Gymplan";
import Chat from "./components/Chat/Chat";
import PrTracker from "./components/PrTracker/PrTracker";
function App() {
  return (
    <div className="App">
      <Navbar />
      <Gymplan />
      <PrTracker />
      <Chat />
    </div>
  );
}

export default App;

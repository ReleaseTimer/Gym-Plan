import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Gymplan from "./components/Gymplan/Gymplan";
import Chat from "./components/Chat/Chat";
function App() {
  return (
    <div className="App">
      <Navbar />
      <Gymplan />
      <Chat />
    </div>
  );
}

export default App;

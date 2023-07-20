import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "../Landing/Landing";

import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

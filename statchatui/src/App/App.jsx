import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "../Landing/Landing";
import SignUp from "../SignUp/SignUp";
import SignIn from "../SignIn/SignIn";
import Home from "../Home/Home";

import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/Home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

import React from "react";
import "./App.css";
import { Link } from "react-router-dom";
import MainRoutes from "./Routes";
import Operations from "./Operations";

function App() {
  return (
    <div className="app">
      <div className="app__navigation">
        <Link to="/"></Link>
        
      </div>
      <MainRoutes />
      <Operations/>
    </div>
  );
}

export default App;

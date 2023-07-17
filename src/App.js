import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Login } from "./components/login"
import { Inicio } from "./components/inicio"
import { Trabajadores } from './components/trabajadores';

function App() {

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" Component={Login} />
          <Route path="/Inicio" Component={Inicio} />
          <Route path="/Empleados" Component={Trabajadores} />
        </Routes>
      </div>
    </Router>
  );
}
//className="container p-4"
export default App;
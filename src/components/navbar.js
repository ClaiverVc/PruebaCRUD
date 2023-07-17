import React from "react";
import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
  const nombreUsuario = localStorage.getItem("NombreUsuario");
  const rol = localStorage.getItem("Rol");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("NombreUsuario");
    localStorage.removeItem("Rol");
    localStorage.removeItem("subsidiaria_Id");
    localStorage.removeItem("access_token");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <Link className="navbar-brand px-4" to="/inicio">
          INICIO
        </Link>
        <div className="navbar-collapse justify-content-end">
          {nombreUsuario && (
            <div className="navbar-text px-5">
              <span className="text-white mr-4 px-4">Usuario: {nombreUsuario}</span>
              {rol && <span className="text-white mr-4 px-4">Rol: {rol}</span>}
              <button
                type="button"
                className="btn btn-warning"
                onClick={handleLogout}
              >
                Salir
              </button>
            </div>
          )}
        </div>
    </nav>
  );
};

export default Navbar;

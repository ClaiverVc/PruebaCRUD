import React, { useState, useEffect } from "react";
import { Navbar } from "./navbar";
import { Link } from "react-router-dom";

const API = "http://127.0.0.1:8000";

export const Inicio = () => {
  const [subsidiarias, setSubsidiarias] = useState([]);
  const [nombreSubsidiaria, setNombreSubsidiaria] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [editSubsidiariaId, setEditSubsidiariaId] = useState(null);
  const [subsidiariaId, setSubsidiariaId] = useState("");
  const [rol, setRol] = useState("");

  useEffect(() => {
    const rolUsuario = localStorage.getItem("Rol");
    setRol(rolUsuario);
    obtenerSubsidiarias();
  }, []);

  const obtenerSubsidiarias = async () => {
    try {
      const response = await fetch(`${API}/subsidiarias`, {
        method: "GET",
      });
      const data = await response.json();
      setSubsidiarias(data);
    } catch (error) {
      console.error(error);
    }
  };

  const crearSubsidiaria = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API}/subsidiarias`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ID: subsidiariaId,
          NombreSubsidiaria: nombreSubsidiaria,
          Ciudad: ciudad,
        }),
      });
      const data = await response.json();
      setSubsidiarias([...subsidiarias, data]);
      setNombreSubsidiaria("");
      setCiudad("");
      setSubsidiariaId("");
    } catch (error) {
      console.error(error);
    }
  };

  const editarSubsidiaria = async (id) => {
    try {
      const response = await fetch(`${API}/subsidiarias/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ID: subsidiariaId,
          NombreSubsidiaria: nombreSubsidiaria,
          Ciudad: ciudad,
        }),
      });
      const data = await response.json();
      setSubsidiarias(
        subsidiarias.map((subsidiaria) => {
          if (subsidiaria.ID === id) {
            return {
              ID: data.ID,
              NombreSubsidiaria: nombreSubsidiaria,
              Ciudad: ciudad,
            };
          }
          return subsidiaria;
        })
      );
      setEditSubsidiariaId("");
      setNombreSubsidiaria("");
      setCiudad("");
    } catch (error) {
      console.error(error);
    }
  };

  const eliminarSubsidiaria = async (id) => {
    try {
      await fetch(`${API}/subsidiarias/${id}`, {
        method: "DELETE",
      });
      setSubsidiarias(
        subsidiarias.filter((subsidiaria) => subsidiaria.ID !== id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const editarDatosSubsidiaria = (id, nombre, ciudad) => {
    setEditSubsidiariaId(id);
    setNombreSubsidiaria(nombre);
    setCiudad(ciudad);
  };

  const cancelarEdicion = () => {
    setEditSubsidiariaId(null);
    setNombreSubsidiaria("");
    setCiudad("");
  };

  const empleadosBySusidiaria = (id) => {
    localStorage.setItem("subsidiaria_Id", id);
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h1>Subsidiarias</h1>

        <form
          onSubmit={
            editSubsidiariaId
              ? () => editarSubsidiaria(editSubsidiariaId)
              : crearSubsidiaria
          }
          className="mb-3"
        >
          <div className="form-group">
            <label htmlFor="subsidiariaId">ID de la subsidiaria</label>
            <input
              type="text"
              className="form-control"
              id="subsidiariaId"
              value={subsidiariaId}
              onChange={(e) => setSubsidiariaId(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="nombre">Nombre de la subsidiaria</label>
            <input
              type="text"
              className="form-control"
              id="nombre"
              value={nombreSubsidiaria}
              onChange={(e) => setNombreSubsidiaria(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="ciudad">Ciudad</label>
            <input
              type="text"
              className="form-control"
              id="ciudad"
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              required
            />
          </div>

          <div className="btn-group">
            <button type="submit" className="btn btn-primary">
              {editSubsidiariaId ? "Guardar Cambios" : "Crear Subsidiaria"}
            </button>
            {editSubsidiariaId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={cancelarEdicion}
              >
                Cancelar Edición
              </button>
            )}
          </div>
        </form>

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre de la subsidiaria</th>
              <th>Ciudad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {subsidiarias.map((subsidiaria) => (
              <tr key={subsidiaria.ID}>
                <td>{subsidiaria.ID}</td>
                <td>{subsidiaria.NombreSubsidiaria}</td>
                <td>{subsidiaria.Ciudad}</td>
                <td>
                  <div className="btn-group">
                    {rol === "Admin" && (
                      <button
                        className="btn btn-primary"
                        onClick={() =>
                          editarDatosSubsidiaria(
                            subsidiaria.ID,
                            subsidiaria.NombreSubsidiaria,
                            subsidiaria.Ciudad
                          )
                        }
                      >
                        Editar
                      </button>
                    )}
                    {rol === "Admin" && (
                      <button
                        className="btn btn-danger"
                        onClick={() => eliminarSubsidiaria(subsidiaria.ID)}
                      >
                        Eliminar
                      </button>
                    )}
                    <Link
                      to={`/Empleados`}
                      className="btn btn-info"
                      onClick={() => empleadosBySusidiaria(subsidiaria.ID)}
                    >
                      Ver Empleados
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Inicio;

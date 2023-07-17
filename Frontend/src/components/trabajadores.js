import React, { useState, useEffect } from "react";
import { Navbar } from "./navbar";

const API = "http://localhost:8000";

export const Trabajadores = () => {
  const [empleados, setEmpleados] = useState([]);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [puesto, setPuesto] = useState("");
  const [nuevoID, setNuevoID] = useState("");
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoApellido, setNuevoApellido] = useState("");
  const [nuevoPuesto, setNuevoPuesto] = useState("");
  const [idSubsidiaria, setIdSubsidiaria] = useState("");
  const id_sub = localStorage.getItem("subsidiaria_Id");
  const [rol, setRol] = useState("");

  useEffect(() => {
    obtenerEmpleados(id_sub)
    const rolUsuario = localStorage.getItem("Rol");
    setRol(rolUsuario);
    ;
  }, [id_sub]);

  const obtenerEmpleados = async (id_sub) => {
    try {
      const response = await fetch(`${API}/subsidiarias/${id_sub}/empleados`, {
        method: "GET",
      });
      const data = await response.json();
      setEmpleados(data);
    } catch (error) {
      console.error(error);
    }
  };

  const eliminarEmpleado = async (id) => {
    try {
      await fetch(`${API}/empleados/${id}`, {
        method: "DELETE",
      });
      obtenerEmpleados();
    } catch (error) {
      console.error(error);
    }
  };

  const editarEmpleado = (empleado) => {
    setEmpleadoSeleccionado(empleado);
    setNombre(empleado.Nombre);
    setApellido(empleado.Apellido);
    setPuesto(empleado.Puesto);
    setIdSubsidiaria(empleado.ID_subsidiaria);
    setEditando(true);
  };

  const cancelarEdicion = () => {
    setEmpleadoSeleccionado(null);
    setNombre("");
    setApellido("");
    setPuesto("");
    setIdSubsidiaria("");
    setEditando(false);
  };

  const guardarCambios = async () => {
    try {
      const response = await fetch(`${API}/empleados/${empleadoSeleccionado.ID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Nombre: nombre,
          Apellido: apellido,
          Puesto: puesto,
          ID_subsidiaria: idSubsidiaria,
        }),
      });
      if (response.ok) {
        obtenerEmpleados();
        cancelarEdicion();
      } else {
        console.error("Error al actualizar el empleado");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const crearEmpleado = async () => {
    try {
      const response = await fetch(`${API}/nuevoempleado`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ID: nuevoID,
          Nombre: nuevoNombre,
          Apellido: nuevoApellido,
          Puesto: nuevoPuesto,
        }),
      });
      if (response.ok) {
        obtenerEmpleados();
        setNuevoID("");
        setNuevoNombre("");
        setNuevoApellido("");
        setNuevoPuesto("");
      } else {
        console.error("Error al crear el empleado");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h1>Lista de Empleados</h1>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Puesto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
          {empleados.map((empleado) => (
  <tr key={empleado.ID}>
    <td>{empleado.ID}</td>
    <td>{empleado.Nombre}</td>
    <td>{empleado.Apellido}</td>
    <td>{empleado.Puesto}</td>
    <td>
      {!editando && rol === "Admin" && (
        <button
          className="btn btn-primary mr-2"
          onClick={() => editarEmpleado(empleado)}
        >
          Editar
        </button>
      )}
      {rol === "Admin" && (
        <button
          className="btn btn-danger"
          onClick={() => eliminarEmpleado(empleado.ID)}
        >
          Eliminar
        </button>
      )}
    </td>
  </tr>
))}

          </tbody>
        </table>

        {empleadoSeleccionado && (
          <div className="mt-5">
            <h2>Detalles del Empleado</h2>
            <form>
              <div className="form-group">
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="apellido">Apellido</label>
                <input
                  type="text"
                  className="form-control"
                  id="apellido"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="puesto">Puesto</label>
                <input
                  type="text"
                  className="form-control"
                  id="puesto"
                  value={puesto}
                  onChange={(e) => setPuesto(e.target.value)}
                  required
                />
              </div>
              <div className="btn-group">
                <button type="button" className="btn btn-primary" onClick={guardarCambios}>
                  Guardar Cambios
                </button>
                <button type="button" className="btn btn-secondary" onClick={cancelarEdicion}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mt-5">
          <h2>Agregar Nuevo Empleado</h2>
          <form>
            <div className="form-group">
              <label htmlFor="nuevo-id">ID</label>
              <input
                type="text"
                className="form-control"
                id="nuevo-id"
                value={nuevoID}
                onChange={(e) => setNuevoID(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="nuevo-nombre">Nombre</label>
              <input
                type="text"
                className="form-control"
                id="nuevo-nombre"
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="nuevo-apellido">Apellido</label>
              <input
                type="text"
                className="form-control"
                id="nuevo-apellido"
                value={nuevoApellido}
                onChange={(e) => setNuevoApellido(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="nuevo-puesto">Puesto</label>
              <input
                type="text"
                className="form-control"
                id="nuevo-puesto"
                value={nuevoPuesto}
                onChange={(e) => setNuevoPuesto(e.target.value)}
                required
              />
            </div>
            <div className="btn-group">
              <button type="button" className="btn btn-primary" onClick={crearEmpleado}>
                Agregar Empleado
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Trabajadores;

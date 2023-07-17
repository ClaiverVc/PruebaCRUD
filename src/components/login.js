import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import "../styles/login.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API = "http://127.0.0.1:8000";


export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirectToHome, setRedirectToHome] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();

    // Validar si el correo y la contraseña están vacíos
    if (email.trim() === "" || password.trim() === "") {
      toast.error("Correo Electrónico o Contraseña Erroneos",{
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
      return;
    }

    try {
      const response = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CorreoElectronico: email,
          Contrasena: password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        const accessToken = data.access_token;
        const nombreUsuario = data.usuario.NombreUsuario;
        const rol = data.usuario.Rol;

        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("NombreUsuario", nombreUsuario);
        localStorage.setItem("Rol", rol);

        toast.success('Inicio de sesión exitoso', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          });
        setRedirectToHome(true);
      } else {
        toast.error("Credenciales inválidas", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          });
      }
    } catch (error) {
      console.log(error);
      toast.error("Ocurrió un error en el inicio de sesión, Credenciales inválidas", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
    }
  };

  if (redirectToHome) {
    return <Navigate to="/inicio" replace />;
  }

  return (
    <>
      <section className="vh-100 gradient-custom">
        <div className="container py-5 h-200">
          <div className="row d-flex justify-content-center align-items-center h-50">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div
                className="card bg-dark text-white"
                style={{ borderRadius: "1rem" }}
              >
                <div className="card-body p-2 text-center">
                  <div className="mb-md-5 mt-md-4 pb-2">
                    <h2 className="fw-bold mb-2 text-uppercase p-2">
                      Iniciar Sesión
                    </h2>
                    <p className="text-white-50 mb-5">
                      Por favor ingrese su usuario y contraseña
                    </p>
                    <div className="form-outline form-white mb-4 p-2">
                      <input
                        type="email"
                        id="typeEmailX"
                        className="form-control form-control-lg"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <label className="form-label pt-2" htmlFor="typeEmailX">
                        Correo Electrónico
                      </label>
                    </div>
                    <div className="form-outline form-white mb-4 p-2">
                      <input
                        type="password"
                        id="typePasswordX"
                        className="form-control form-control-lg"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <label
                        className="form-label pt-2"
                        htmlFor="typePasswordX"
                      >
                        Contraseña
                      </label>
                    </div>
                    <button
                      className="btn btn-outline-light btn-lg px-5"
                      type="submit"
                      onClick={handleLogin}
                    >
                      INGRESAR
                    </button>
                    <ToastContainer />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
--Scritps para la creacion de la tablas
--CREATE DATABASE
-- Tabla de Usuarios
CREATE TABLE Usuarios (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  NombreUsuario VARCHAR(100) NOT NULL,
  CorreoElectronico VARCHAR(100) NOT NULL,
  Contrasena VARCHAR(100) NOT NULL,
  Rol VARCHAR(20) NOT NULL
);

 -- Tabla de Subsidiarias
CREATE TABLE Subsidiarias (
  ID INT PRIMARY KEY,
  NombreSubsidiaria VARCHAR(100) NOT NULL,
  Ciudad VARCHAR(50) NOT NULL
);

 -- Tabla de Empleados
CREATE TABLE Empleados (
  ID INT PRIMARY KEY,
  Nombre VARCHAR(50) NOT NULL,
  Apellido VARCHAR(50) NOT NULL,
  Puesto VARCHAR(50) NOT NULL,
  ID_Subsidiaria INT,
  FOREIGN KEY (ID_Subsidiaria) REFERENCES Subsidiarias(ID)
);
--DROP TABLE sucursales

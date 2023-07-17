from fastapi import APIRouter
import mysql.connector
from pydantic import BaseModel
from typing import Optional

# conexion con la base de datos
conexion = mysql.connector.connect(
    host="127.0.0.1",
    user="root",
    password="revi123",
    database="pruebacrud"
)

router = APIRouter()

empleados_muestra = []

#  modelo de datos
class empleados(BaseModel):
    ID: Optional[int]
    Nombre: str
    Apellido: str
    Puesto: str

#  modelo de datos
class editar_empleados(BaseModel):
    Nombre: str
    Apellido: str
    Puesto: str

# Ruta para obtener todas las empleados
@router.get("/empleados")
async def get_empleados():
    cursor = conexion.cursor()
    cursor.execute("SELECT * FROM empleados")
    columns = cursor.column_names
    empleados = []
    for row in cursor.fetchall():
        empleado = dict(zip(columns, row))
        empleados.append(empleado)
    cursor.close()
    return empleados

# Ruta para obtener una empleados por su Id
@router.get("/empleados/{empleados_id}")
async def get_empleados(empleados_id: int):
    cursor = conexion.cursor()
    cursor.execute("SELECT * FROM empleados WHERE ID = %s", (empleados_id,))
    empleados = cursor.fetchone()
    cursor.close()
    return empleados

# Ruta para actualizar una empleados por su Id
@router.put("/empleados/{empleados_id}")
async def update_empleados(empleados_id: int, updated_empleado: editar_empleados):
    cursor = conexion.cursor()
    cursor.execute("UPDATE empleados SET Nombre = %s, Apellido = %s, Puesto = %s WHERE ID = %s",
                   (updated_empleado.Nombre, updated_empleado.Apellido, updated_empleado.Puesto, empleados_id))
    conexion.commit()
    cursor.close()
    return updated_empleado


# Ruta para crear una empleados
@router.post("/nuevoempleado")
async def create_empleados(empleados: empleados):
    cursor = conexion.cursor()
    cursor.execute("INSERT INTO empleados (ID, Nombre, Apellido, Puesto) VALUES (%s, %s, %s, %s)",
                   (empleados.ID, empleados.Nombre, empleados.Apellido, empleados.Puesto))
    conexion.commit()
    cursor.close()
    return empleados

# Ruta para eliminar una empleados por su Id
@router.delete("/empleados/{empleados_id}")
async def delete_subsidiaria(empleados_id: int):
    cursor = conexion.cursor()
    cursor.execute("DELETE FROM empleados WHERE id = %s", (empleados_id,))
    conexion.commit()
    cursor.close()
    return {"message": "Empleado eliminado"}


# Ruta para odtener empleados segun la subsidiaria 
@router.get("/subsidiarias/{subsidiaria_id}/empleados")
async def get_empleados_by_subsidiarias(subsidiaria_id: int):
    cursor = conexion.cursor()
    cursor.execute("SELECT * FROM empleados WHERE ID_subsidiaria = %s", (subsidiaria_id,))
    columns = cursor.column_names
    empleados = []
    for row in cursor.fetchall():
        empleado = dict(zip(columns, row))
        empleados.append(empleado)
    cursor.close()
    return empleados



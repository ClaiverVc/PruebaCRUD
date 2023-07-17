from fastapi import APIRouter
import mysql.connector
from pydantic import BaseModel
from typing import Optional, List

# conexion con la base de datos
conexion = mysql.connector.connect(
    host="127.0.0.1",
    user="root",
    password="revi123",
    database="pruebacrud"
)

router = APIRouter()

#  modelo de datos
class Subsidiaria(BaseModel):
    ID: Optional[int]
    NombreSubsidiaria: str
    Ciudad: str

# Ruta para obtener todas las subsidiarias
@router.get("/subsidiarias")
async def get_subsidiarias():
    cursor = conexion.cursor()
    cursor.execute("SELECT * FROM subsidiarias")
    columns = cursor.column_names
    subsidiarias = []
    for row in cursor.fetchall():
        subsidiaria = dict(zip(columns, row))
        subsidiarias.append(subsidiaria)
    cursor.close()
    return subsidiarias

# Ruta para obtener una subsidiaria por su Id
@router.get("/subsidiarias/{subsidiaria_id}")
async def get_subsidiaria(subsidiaria_id: int):
    cursor = conexion.cursor()
    cursor.execute("SELECT * FROM subsidiarias WHERE ID = %s", (subsidiaria_id,))
    subsidiaria = cursor.fetchone()
    cursor.close()
    return subsidiaria

# Ruta para crear una subsidiaria
@router.post("/subsidiarias")
async def create_subsidiaria(subsidiaria: Subsidiaria):
    cursor = conexion.cursor()
    cursor.execute("INSERT INTO subsidiarias (ID, nombreSubsidiaria, Ciudad) VALUES (%s, %s, %s)",
                   (subsidiaria.ID, subsidiaria.NombreSubsidiaria, subsidiaria.Ciudad))
    conexion.commit()
    cursor.close()
    return subsidiaria

# Ruta para actualizar una subsidiaria por su Id
@router.put("/subsidiarias/{subsidiaria_id}")
async def update_subsidiaria(subsidiaria_id: int, updated_subsidiaria: Subsidiaria):
    cursor = conexion.cursor()
    cursor.execute("UPDATE subsidiarias SET nombreSubsidiaria = %s, Ciudad = %s WHERE ID = %s",
                   (updated_subsidiaria.NombreSubsidiaria, updated_subsidiaria.Ciudad, subsidiaria_id))
    conexion.commit()
    cursor.close()
    return updated_subsidiaria

# Ruta para eliminar una subsidiaria por su Id
@router.delete("/subsidiarias/{subsidiaria_id}")
async def delete_subsidiaria(subsidiaria_id: int):
    cursor = conexion.cursor()
    cursor.execute("DELETE FROM subsidiarias WHERE id = %s", (subsidiaria_id,))
    conexion.commit()
    cursor.close()
    return {"message": "Subsidiaria eliminada"}



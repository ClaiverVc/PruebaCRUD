from fastapi import APIRouter,HTTPException, status
import mysql.connector
from pydantic import BaseModel
from passlib.context import CryptContext
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from datetime import timedelta, datetime
from jose import jwt, JWTError
import secrets

# Configuración de seguridad y tokens
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")
SECRET_KEY = secrets.token_urlsafe(32)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# conexion con la base de datos
conexion = mysql.connector.connect(
    host="127.0.0.1",
    user="root",
    password="revi123",
    database="pruebacrud"
)

router = APIRouter()

#  modelo de datos
class UsuarioDB(BaseModel):
    NombreUsuario: str
    CorreoElectronico: str
    Contrasena: str
    Rol: str

class Login_UsuarioDB(BaseModel):
    CorreoElectronico: str
    Contrasena: str

class Usuario(BaseModel):
    Id: int
    NombreUsuario: str
    CorreoElectronico: str
    Contrasena: str
    Rol: str

    class Config:
        orm_mode = True


# Ruta para obtener todos los usuarios
@router.get("/usuarios")
async def get_usuarios():
    cursor = conexion.cursor()
    cursor.execute("SELECT * FROM usuarios")
    usuarios = cursor.fetchall()
    cursor.close()
    return usuarios

 # Ruta para obtener un usuario por su Id
@router.get("/usuarios/{usuario_Id}")
async def get_usuario(usuario_Id: int):
    cursor = conexion.cursor()
    cursor.execute("SELECT * FROM usuarios WHERE Id = %s", (usuario_Id,))
    usuario = cursor.fetchone()
    cursor.close()
    return usuario

 # Ruta para crear un usuario
@router.post("/usuarios")
async def create_usuario(crearUsuario: UsuarioDB):
    hashed_password = pwd_context.hash(crearUsuario.Contrasena)
    cursor = conexion.cursor()
    cursor.execute("INSERT INTO usuarios (NombreUsuario, CorreoElectronico, Contrasena, Rol) VALUES (%s, %s, %s, %s)",
                   (crearUsuario.NombreUsuario, crearUsuario.CorreoElectronico, hashed_password, crearUsuario.Rol))
    conexion.commit()
    cursor.close()
    return crearUsuario

 # Ruta para actualizar un usuario por su Id
@router.put("/usuarios/{usuario_Id}")
async def update_usuario(usuario_Id: int, updated_usuario: UsuarioDB):
    hashed_password = pwd_context.hash(updated_usuario.Contrasena)
    cursor = conexion.cursor()
    cursor.execute("UPDATE usuarios SET NombreUsuario = %s, CorreoElectronico = %s, Contrasena = %s, Rol = %s WHERE Id = %s",
                   (updated_usuario.NombreUsuario, updated_usuario.CorreoElectronico, hashed_password, updated_usuario.Rol, usuario_Id))
    conexion.commit()
    cursor.close()
    return updated_usuario

 # Ruta para eliminar un usuario por su Id
@router.delete("/usuarios/{usuario_Id}")
async def delete_usuario(usuario_Id: int):
    cursor = conexion.cursor()
    cursor.execute("DELETE FROM usuarios WHERE Id = %s", (usuario_Id,))
    conexion.commit()
    cursor.close()
    return {"message": "Usuario eliminado"}


def usuario_actual(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        email = payload.get("sub")
        if email is None:
            raise ValueError("Correo electrónico no encontrado en el token")
        return email
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")

# Funciones de manejo de tokens
def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
    return encoded_jwt

# Ruta de inicio de sesión
@router.post("/login")
async def login(usuario: Login_UsuarioDB):
    cursor = conexion.cursor()
    cursor.execute("SELECT * FROM usuarios WHERE CorreoElectronico = %s", (usuario.CorreoElectronico,))
    db_usuario = cursor.fetchone()
    cursor.close()

    if db_usuario and pwd_context.verify(usuario.Contrasena, db_usuario[3]):
        # Crear el token de acceso
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": usuario.CorreoElectronico},
            expires_delta=access_token_expires
        )
        usuario_data = {
            "Id": db_usuario[0],
            "NombreUsuario": db_usuario[1],
            "CorreoElectronico": db_usuario[2],
            "Contrasena": "",
            "Rol": db_usuario[4]
        }
        usuario = Usuario(**usuario_data)
        return {"access_token": access_token, "token_type": "bearer", "usuario": usuario}
    else:
        return {"message": "Credenciales inválidas"}
     
# Ruta para cerrar sesión
@router.post("/logout")
async def logout():
    return {"message": "Cierre de sesión exitoso"}
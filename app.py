import mysql.connector
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
# CORS nos permite que React en el puerto 3000 hable con Flask
# CONEXION con la BBDD y la interfaz de usuario
CORS(app)

def conectar_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="glowcars_db",
        port=3307 
    )

# ENDPOINTS 
@app.route('/vehiculos', methods=['POST'])
def listar_vehiculos():
    try:
        datos = request.json
        idUser = datos.get('idUser')

        conexion = conectar_db()
        cursor = conexion.cursor(dictionary=True)

        cursor.execute("SELECT * FROM vehiculos WHERE id_usuario = %s ", (idUser,)) 
        resultado = cursor.fetchall()

        cursor.close()
        conexion.close()

        return jsonify(resultado), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/citas', methods=['POST'])
def listar_citas():
    try:
        datos = request.json
        idUser = datos.get('idUser')

        conexion = conectar_db()
        cursor = conexion.cursor(dictionary=True)

        cursor.execute("SELECT citas.*, vehiculos.marca, vehiculos.modelo, vehiculos.matricula FROM citas JOIN vehiculos ON " \
        "citas.id_vehiculo = vehiculos.id_vehiculo WHERE citas.id_usuario = %s", (idUser,)) 
        resultado = cursor.fetchall()

        cursor.close()
        conexion.close()

        return jsonify(resultado), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/createCita', methods=['POST'])
def create_cita():
    try:
        datos = request.json
        vehiculo = datos.get('vehiculo')
        fecha = datos.get('fecha')
        tipo = datos.get('tipo')
        motivo = datos.get('motivo')
        idUser = datos.get('idUser')

        conexion = conectar_db()
        cursor = conexion.cursor(dictionary=True)
        
        sql = "INSERT INTO citas (id_usuario, id_vehiculo, fecha_solicitud, tipo_cita, motivo) VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(sql, (idUser, vehiculo, fecha, tipo, motivo))
        conexion.commit()

        cursor.close()
        conexion.close()

        return jsonify({"mensaje": "¡Cita creada correctamente!"}), 201
       
    except Exception as e:
        print(f"Error en login: {e}")
        return jsonify({"error": ""}), 500
    
@app.route('/updateCita/<int:id_cita>', methods=['PUT'])
def update_cita(id_cita):
    try:
        datos = request.json
        fecha = datos.get('fecha')
        tipo = datos.get('tipo')
        motivo = datos.get('motivo')
        estado = datos.get('estado')

        conexion = conectar_db()
        cursor = conexion.cursor()

        sql = "UPDATE citas SET fecha_solicitud = %s, tipo_cita = %s, motivo = %s, estado_cita = %s WHERE id_cita = %s"
        valores = (fecha, tipo, motivo, estado, id_cita)
        
        cursor.execute(sql, valores)
        conexion.commit()

        cursor.close()
        conexion.close()

        return jsonify({"mensaje": "Cita actualizada correctamente"}), 200
    
    except Exception as e:
        print(f"Error en updateCita: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/login', methods=['POST'])
def login_usuario():
    try:
        datos = request.json
        email = datos.get('email')
        password = datos.get('password')

        conexion = conectar_db()
        cursor = conexion.cursor(dictionary=True)
        
        # Buscamos si existe un usuario con ese email y esa contraseña
        sql = "SELECT * FROM usuarios WHERE email = %s AND password = %s"
        cursor.execute(sql, (email, password))
        usuario = cursor.fetchone()
        
        cursor.close()
        conexion.close()

        if usuario:
            # Si lo encuentra, enviamos éxito
            return jsonify({"mensaje": "¡Login correcto!", 
            "id": usuario['id_usuario'],
            "email": usuario['email'],
            "apellidos": usuario['apellidos'],
            "nombre": usuario['nombre'],
            "rol": usuario['rol'],
            "fecha_registro": usuario['fecha_registro'],
            "telefono": usuario['telefono']}), 200
        else:
            # Si no coinciden, avisamos
            return jsonify({"error": "Email o contraseña incorrectos"}), 401
            
    except Exception as e:
        print(f"Error en login: {e}")
        return jsonify({"error": "Error en el servidor"}), 500

@app.route('/createUser', methods=['POST'])
def create_user():
    try:
        datos = request.json
        nombre = datos.get('nombre')
        apellidos = datos.get('apellidos')
        telefono = datos.get('telefono')
        email = datos.get('email')
        password = datos.get('password')
        rol = datos.get('rol')
        fecha_registro = datos.get('fecha_registro')

        conexion = conectar_db()
        cursor = conexion.cursor(dictionary=True)
        
        sql = "INSERT INTO usuarios (nombre, apellidos, telefono, email, password, rol, fecha_registro) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        cursor.execute(sql, (nombre, apellidos, telefono, email, password, rol, fecha_registro))
        conexion.commit()

        sql = "SELECT * FROM usuarios WHERE email = %s"
        cursor.execute(sql, (email,))
        nuevoUsuario = cursor.fetchone()

        cursor.close()
        conexion.close()

        if nuevoUsuario:
            return jsonify({"mensaje": "¡Login correcto!", 
            "id": nuevoUsuario['id_usuario'],}), 200
        else:
            return jsonify({"error": "ID no encotrado"}), 401
         
    except Exception as e:
        print(f"Error en login: {e}")
        return jsonify({"error": ""}), 500

@app.route('/createCar', methods=['POST'])
def create_car():
    try:
        datos = request.json
        matricula = datos.get('matricula')
        marca = datos.get('marca')
        modelo = datos.get('modelo')
        anio = datos.get('anio')
        bastidor = datos.get('bastidor')
        id_new_user = datos.get('id_new_user')

        conexion = conectar_db()
        cursor = conexion.cursor(dictionary=True)
        
        sql = "INSERT INTO vehiculos (id_usuario, matricula, marca, modelo, fc_mat, bastidor) VALUES (%s, %s, %s, %s, %s, %s)"
        cursor.execute(sql, (id_new_user, matricula, marca, modelo, anio, bastidor))
        conexion.commit()

        cursor.close()
        conexion.close()

        return jsonify({"mensaje": "¡Usuario y vehiculo dado de alta correctamente!"}), 201
       
    except Exception as e:
        print(f"Error en login: {e}")
        return jsonify({"error": ""}), 500
    
@app.route('/updateCar/<int:id_vehiculo>', methods=['PUT'])
def update_car(id_vehiculo):
    try:
        datos = request.json
        matricula = datos.get('matricula')
        marca = datos.get('marca')
        modelo = datos.get('modelo')
        fc_mat = datos.get('fc_mat')
        bastidor = datos.get('bastidor')

        conexion = conectar_db()
        cursor = conexion.cursor()

        sql = "UPDATE vehiculos SET matricula = %s, marca = %s, modelo = %s, fc_mat = %s, bastidor = %s WHERE id_vehiculo = %s"
        valores = (matricula, marca, modelo, fc_mat, bastidor, id_vehiculo)
        
        cursor.execute(sql, valores)
        conexion.commit()

        cursor.close()
        conexion.close()

        return jsonify({"mensaje": "Vehículo actualizado correctamente"}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500
    
@app.route('/deleteCar/<int:id_vehiculo>', methods=['DELETE'])
def delete_car(id_vehiculo):
    try:
        conexion = conectar_db()
        cursor = conexion.cursor(dictionary=True)

        cursor.execute("DELETE FROM vehiculos WHERE id_vehiculo = %s", (id_vehiculo,)) 
        conexion.commit()

        filas_borradas = cursor.rowcount

        cursor.close()
        conexion.close()

        if filas_borradas == 0:
            return jsonify({"mensaje": "No se encontró ningún vehículo con ese ID"}), 404

        return jsonify({"mensaje": "¡Vehículo eliminado correctamente!"}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/deleteCita/<int:id_cita>', methods=['DELETE'])
def delete_cita(id_cita):
    try:
        conexion = conectar_db()
        cursor = conexion.cursor(dictionary=True)

        cursor.execute("DELETE FROM citas WHERE id_cita = %s", (id_cita,)) 
        conexion.commit()

        filas_borradas = cursor.rowcount

        cursor.close()
        conexion.close()

        if filas_borradas == 0:
            return jsonify({"mensaje": "No se encontró ningún vehículo con ese ID"}), 404

        return jsonify({"mensaje": "Cita eliminada correctamente!"}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/deleteResena/<int:id_resena>', methods=['DELETE'])
def delete_resena(id_resena):
    try:
        conexion = conectar_db()
        cursor = conexion.cursor(dictionary=True)

        cursor.execute("DELETE FROM resenas WHERE id_resena = %s", (id_resena,)) 
        conexion.commit()

        filas_borradas = cursor.rowcount

        cursor.close()
        conexion.close()

        if filas_borradas == 0:
            return jsonify({"mensaje": "No se encontró ninguna reseña con ese ID"}), 404

        return jsonify({"mensaje": "Reseña eliminada correctamente!"}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/checkUser', methods=['GET'])
def check_user():
    try:
        email_user = request.args.get('email')

        conexion = conectar_db()
        cursor = conexion.cursor(dictionary=True)
        
        # Buscamos si existe un usuario con ese email
        sql = "SELECT * FROM usuarios WHERE email = %s "
        cursor.execute(sql, (email_user,))
        usuario = cursor.fetchall()
        
        cursor.close()
        conexion.close()

        if usuario:
            # Si lo encuentra, enviamos éxito
            return jsonify({"mensaje": "¡Email ya en uso!, por favor use otro email", 
            }), 200
        else:
            # Si no coinciden, avisamos
            return jsonify({"mensaje": "Email correcto"}), 201
            
    except Exception as e:
        print(f"Error en login: {e}")
        return jsonify({"error": "Error en el servidor"}), 500

@app.route('/readUser', methods=['GET'])
def read_user():
    try:
        idUser = request.args.get('user')

        conexion = conectar_db()
        cursor = conexion.cursor(dictionary=True)
        
        sql = "SELECT nombre, apellidos, telefono, email FROM usuarios WHERE id_usuario = %s "
        cursor.execute(sql, (idUser,))
        usuario = cursor.fetchone()
        
        cursor.close()
        conexion.close()

        return jsonify(usuario), 200
       
    except Exception as e:
        print(f"Error al devolver usuario: {e}")
        return jsonify({"error": "Error en el servidor"}), 500
    
@app.route('/updateUser/<int:id_user>', methods=['PUT'])
def update_user(id_user):
    try:
        datos = request.json
        nombre = datos.get('nombre')
        apellidos = datos.get('apellidos')
        telefono = datos.get('telefono')
        email = datos.get('email')

        conexion = conectar_db()
        cursor = conexion.cursor()

        sql = "UPDATE usuarios SET nombre = %s, apellidos = %s, telefono = %s, email = %s WHERE id_usuario = %s"
        valores = (nombre, apellidos, telefono, email, id_user)
        
        cursor.execute(sql, valores)
        conexion.commit()

        cursor.close()
        conexion.close()

        return jsonify({"mensaje": "Usuario actualizado correctamente"}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500
    
@app.route('/resena', methods=['GET'])
def listar_resenas():
    try:
        conexion = conectar_db()
        cursor = conexion.cursor(dictionary=True)

        cursor.execute("SELECT resenas.*, usuarios.nombre, usuarios.apellidos FROM resenas JOIN usuarios ON resenas.id_usuario = usuarios.id_usuario ORDER BY fecha DESC ")
        resultado = cursor.fetchall()

        cursor.close()
        conexion.close()

        return jsonify(resultado)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/createResena', methods=['POST'])
def create_resena():
    try:
        datos = request.json
        calificacion = datos.get('calificacion')
        titulo = datos.get('titulo')
        comentario = datos.get('comentario')
        fecha = datos.get('fecha')
        id_usuario = datos.get('id_usuario')

        conexion = conectar_db()
        cursor = conexion.cursor(dictionary=True)
        sql = "INSERT INTO resenas (id_usuario, calificacion, titulo, comentario, fecha) VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(sql, (id_usuario, calificacion, titulo, comentario, fecha))
        conexion.commit()

        cursor.close()
        conexion.close()

        return jsonify({"mensaje": "Reseña creada correctamente."}), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/updateResena/<int:id_resena>', methods=['PUT'])
def update_resena(id_resena):
    try:
        datos = request.json
        calificacion = datos.get('calificacion')
        titulo = datos.get('titulo')
        comentario = datos.get('comentario')

        conexion = conectar_db()
        cursor = conexion.cursor()

        sql = "UPDATE resenas SET calificacion = %s, titulo = %s, comentario = %s WHERE id_resena = %s"
        valores = (calificacion, titulo, comentario, id_resena)
        
        cursor.execute(sql, valores)
        conexion.commit()

        cursor.close()
        conexion.close()

        return jsonify({"mensaje": "Reseña modificada correctamente"}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Servidor GlowCars encendido en http://127.0.0.1:5000")
    app.run(debug=True, port=5000)
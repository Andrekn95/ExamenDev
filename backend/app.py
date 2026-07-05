from flask import Flask, request, jsonify
import os
import psycopg2
from psycopg2.extras import execute_values
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_NAME = os.getenv("DB_NAME", "hotel_db")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "12345")
DB_PORT = os.getenv("DB_PORT", "5432")


def get_db_connection():
    print("DEBUG: psycopg2.connect...")
    conn = psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        client_encoding='utf8',
        options="-c lc_messages=C"  # evita errores de decodificación en mensajes de Postgres
    )
    print("DEBUG: connect OK")
    return conn


@app.route('/api/huespedes', methods=['POST'])
def registrar_huesped():
    datos = request.get_json()
    nombres_completos = datos.get('nombres_completos')
    telefono = datos.get('telefono')
    correo_electronico = datos.get('correo_electronico')
    acompanantes = datos.get('acompanantes')

    if not all([nombres_completos, telefono, correo_electronico, acompanantes]):
        return jsonify({"error": "Faltan campos obligatorios"}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO huespedes (nombres_completos, telefono, correo_electronico, acompanantes) VALUES (%s, %s, %s, %s) RETURNING id;",
            (nombres_completos, telefono, correo_electronico, acompanantes)
        )
        nuevo_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"message": "Huésped registrado con éxito", "id": nuevo_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/restaurante', methods=['POST'])
def registrar_restaurante():
    datos = request.get_json()
    desayuno = datos.get('desayuno', [])
    bebida_desayuno = datos.get('bebida_desayuno', [])
    almuerzo = datos.get('almuerzo', [])
    bebida_almuerzo = datos.get('bebida_almuerzo', [])
    tiene_alergias = datos.get('tiene_alergias', False)
    detalle_alergia = datos.get('detalle_alergia', None)

    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO restaurante (desayuno, bebida_desayuno, almuerzo, bebida_almuerzo, tiene_alergias, detalle_alergia) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id;",
            (desayuno, bebida_desayuno, almuerzo, bebida_almuerzo, tiene_alergias, detalle_alergia)
        )
        nuevo_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"message": "Selección de restaurante guardada", "id": nuevo_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/tours', methods=['POST'])
def registrar_tour():
    datos = request.get_json()
    actividad = datos.get('actividad')
    tipo_alojamiento = datos.get('tipo_alojamiento')
    acepta_terminos = datos.get('acepta_terminos', False)

    if not acepta_terminos:
        return jsonify({"error": "Debe aceptar los términos y condiciones de turismo para registrar el tour"}), 400

    if not all([actividad, tipo_alojamiento]):
        return jsonify({"error": "Faltan campos obligatorios"}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO tours (actividad, tipo_alojamiento, acepta_terminos) VALUES (%s, %s, %s) RETURNING id;",
            (actividad, tipo_alojamiento, acepta_terminos)
        )
        nuevo_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"message": "Reserva de tour completada exitosamente", "id": nuevo_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/registro-completo', methods=['POST', 'OPTIONS'])
def registro_completo():
    if request.method == 'OPTIONS':
        return jsonify({"status": "CORS ok"}), 200

    datos = request.get_json()
    print(f"PAYLOAD RECIBIDO: {datos}")

    huesped = datos.get('huesped', {})
    restaurante = datos.get('restaurante', {})
    tour = datos.get('tour', {})

    conn = None
    try:
        print("DEBUG: antes de get_db_connection")
        conn = get_db_connection()
        print("DEBUG: antes de conn.cursor")
        cur = conn.cursor()
        print("DEBUG: cursor creado")

        try:
            cur.execute(
                "INSERT INTO huespedes (nombres_completos, telefono, correo_electronico, acompanantes) VALUES (%s, %s, %s, %s);",
                (huesped.get('nombres_completos'), huesped.get('telefono'),
                 huesped.get('correo_electronico'), huesped.get('acompanantes'))
            )
            print("OK: huesped insertado")
        except Exception as e1:
            print(f"FALLO en huespedes: {e1}")
            raise

        try:
            cur.execute(
                "INSERT INTO restaurante (desayuno, bebida_desayuno, almuerzo, bebida_almuerzo, tiene_alergias, detalle_alergia) VALUES (%s, %s, %s, %s, %s, %s);",
                (restaurante.get('desayuno'), restaurante.get('bebida_desayuno'),
                 restaurante.get('almuerzo'), restaurante.get('bebida_almuerzo'),
                 restaurante.get('tiene_alergias'), restaurante.get('detalle_alergia'))
            )
            print("OK: restaurante insertado")
        except Exception as e2:
            print(f"FALLO en restaurante: {e2}")
            raise

        try:
            cur.execute(
                "INSERT INTO tours (actividad, tipo_alojamiento, acepta_terminos) VALUES (%s, %s, %s);",
                (tour.get('actividad'), tour.get('tipo_alojamiento'), tour.get('acepta_terminos'))
            )
            print("OK: tour insertado")
        except Exception as e3:
            print(f"FALLO en tour: {e3}")
            raise

        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"message": "¡Todo el registro del hotel se guardó con éxito!"}), 201

    except Exception as e:
        print(f"ERROR en registro_completo: {e}")
        if conn:
            conn.rollback()
        return jsonify({"error": str(e)}), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "hotel-backend"}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
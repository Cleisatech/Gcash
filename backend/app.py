from flask import Flask, request, jsonify, render_template  # Import render_template
from flask_cors import CORS  # Import Flask-CORS
import sqlite3
import logging
import random

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

logging.basicConfig(level=logging.DEBUG)

# Initialize SQLite database
DATABASE = 'data.db'

def init_db():
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT,
                last_name TEXT,
                email TEXT UNIQUE,
                password TEXT,
                account_number TEXT UNIQUE
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS verifications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                phone TEXT,
                id_front TEXT,
                id_back TEXT,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                type TEXT,
                amount REAL,
                date TEXT,
                description TEXT,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
        ''')
        conn.commit()

init_db()

# Routes
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json

    # Validate input
    if not data or not data.get('first_name') or not data.get('last_name') or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'All fields are required'}), 400

    # Generate a unique account number (without "GC" prefix)
    account_number = random.randint(1000000000, 9999999999)  # 10-digit random number

    try:
        with sqlite3.connect(DATABASE) as conn:
            cursor = conn.cursor()
            cursor.execute('INSERT INTO users (first_name, last_name, email, password, account_number) VALUES (?, ?, ?, ?, ?)', 
                           (data['first_name'], data['last_name'], data['email'], data['password'], account_number))
            conn.commit()
        return jsonify({'message': 'Signup successful'}), 201
    except sqlite3.IntegrityError as e:
        if "UNIQUE constraint failed: users.email" in str(e):
            return jsonify({'error': 'Email already registered'}), 400
        elif "UNIQUE constraint failed: users.account_number" in str(e):
            return jsonify({'error': 'Account number generation failed. Please try again.'}), 500
        else:
            return jsonify({'error': 'An unexpected error occurred'}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.json

    # Validate input
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password are required'}), 400

    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT id, first_name, account_number FROM users WHERE email = ? AND password = ?', (data['email'], data['password']))
        user = cursor.fetchone()
        if user:
            return jsonify({'message': 'Login successful', 'user_id': user[0], 'first_name': user[1], 'account_number': user[2]}), 200
        else:
            return jsonify({'error': 'Invalid email or password'}), 401

@app.route('/verification', methods=['POST'])
def verification():
    data = request.json
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute('INSERT INTO verifications (user_id, phone, id_front, id_back) VALUES (?, ?, ?, ?)', 
                       (data['user_id'], data['phone'], data['id_front'], data['id_back']))
        conn.commit()
    return jsonify({'message': 'Verification submitted successfully'}), 201

@app.route('/admin/verifications', methods=['GET'])
def admin_verifications():
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT users.first_name, users.last_name, users.email, verifications.phone, verifications.id_front, verifications.id_back
            FROM verifications
            JOIN users ON verifications.user_id = users.id
        ''')
        verifications = cursor.fetchall()
    return jsonify({'verifications': verifications}), 200

@app.route('/delete-user', methods=['POST'])
def delete_user():
    data = request.json

    # Validate input
    if not data or not data.get('email'):
        return jsonify({'error': 'Email is required'}), 400

    try:
        with sqlite3.connect(DATABASE) as conn:
            cursor = conn.cursor()
            cursor.execute('DELETE FROM users WHERE email = ?', (data['email'],))
            conn.commit()
            if cursor.rowcount > 0:
                return jsonify({'message': 'User deleted successfully'}), 200
            else:
                return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        app.logger.error(f"Error deleting user: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@app.route('/')
def home():
    return render_template('index.html')  # Serve the index.html file

@app.route('/test')
def test():
    return "App is working!"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7860, debug=True)
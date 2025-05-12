import sqlite3

DATABASE = 'data.db'

def view_users():
    try:
        with sqlite3.connect(DATABASE) as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM users')
            users = cursor.fetchall()
            for user in users:
                print(user)
    except Exception as e:
        print(f"Error viewing users: {e}")

view_users()

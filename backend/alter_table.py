import sqlite3

DATABASE = 'data.db'

def add_account_number_column():
    try:
        with sqlite3.connect(DATABASE) as conn:
            cursor = conn.cursor()
            cursor.execute('ALTER TABLE users ADD COLUMN account_number TEXT UNIQUE')
            conn.commit()
            print("Column 'account_number' added successfully.")
    except sqlite3.OperationalError as e:
        print(f"Error: {e}")

add_account_number_column()

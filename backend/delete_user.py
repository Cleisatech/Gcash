import sqlite3
import sys

DATABASE = 'data.db'

def delete_user(email):
    try:
        with sqlite3.connect(DATABASE) as conn:
            cursor = conn.cursor()
            cursor.execute('DELETE FROM users WHERE email = ?', (email,))
            conn.commit()
            if cursor.rowcount > 0:
                print(f"User with email '{email}' deleted successfully.")
            else:
                print(f"User with email '{email}' not found.")
    except Exception as e:
        print(f"Error deleting user: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python delete_user.py <email>")
    else:
        email = sys.argv[1]
        delete_user(email)

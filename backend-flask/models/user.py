import bcrypt
from config.database import get_db, dict_from_row
from datetime import datetime


class User:
    @staticmethod
    def hash_password(password):
        """Hash a password using bcrypt"""
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    @staticmethod
    def check_password(password, hashed):
        """Verify a password against a hash"""
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

    @staticmethod
    def create(name, email, password):
        """Create a new user"""
        with get_db() as conn:
            cursor = conn.cursor()
            hashed_password = User.hash_password(password)

            cursor.execute('''
                INSERT INTO users (name, email, password)
                VALUES (?, ?, ?)
            ''', (name, email.lower(), hashed_password))

            conn.commit()
            user_id = cursor.lastrowid

            return User.find_by_id(user_id)

    @staticmethod
    def find_by_email(email):
        """Find a user by email"""
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                'SELECT * FROM users WHERE email = ?', (email.lower(),))
            row = cursor.fetchone()
            return dict_from_row(row) if row else None

    @staticmethod
    def find_by_id(user_id):
        """Find a user by ID"""
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
            row = cursor.fetchone()
            return dict_from_row(row) if row else None

    @staticmethod
    def update(user_id, **kwargs):
        """Update user fields"""
        with get_db() as conn:
            cursor = conn.cursor()

            # Build dynamic UPDATE query
            fields = []
            values = []
            for key, value in kwargs.items():
                if key not in ['id', 'password', 'created_at']:
                    fields.append(f"{key} = ?")
                    values.append(value)

            fields.append("updated_at = ?")
            values.append(datetime.utcnow().isoformat())
            values.append(user_id)

            query = f"UPDATE users SET {', '.join(fields)} WHERE id = ?"
            cursor.execute(query, values)
            conn.commit()

            return User.find_by_id(user_id)

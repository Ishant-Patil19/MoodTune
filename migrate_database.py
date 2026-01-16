"""
Add Google OAuth columns to existing database
"""
import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), 'backend', 'instance', 'moodmusic.db')

print(f"📁 Database path: {db_path}")

if not os.path.exists(db_path):
    print("❌ Database file not found!")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Check if columns already exist
cursor.execute("PRAGMA table_info(users)")
columns = [col[1] for col in cursor.fetchall()]

print(f"📋 Existing columns: {columns}")

# Add Google OAuth columns if they don't exist
columns_to_add = [
    ("google_id", "VARCHAR(120)"),
    ("google_name", "VARCHAR(120)"),
    ("google_email", "VARCHAR(120)"),
    ("google_picture", "TEXT"),
    ("google_access_token", "TEXT"),
    ("google_refresh_token", "TEXT"),
]

added = []
for col_name, col_type in columns_to_add:
    if col_name not in columns:
        try:
            cursor.execute(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}")
            added.append(col_name)
            print(f"✅ Added column: {col_name}")
        except Exception as e:
            print(f"❌ Error adding {col_name}: {e}")
    else:
        print(f"⏭️  Column {col_name} already exists")

conn.commit()
conn.close()

if added:
    print(f"\n✨ Successfully added {len(added)} columns!")
else:
    print("\n✅ All columns already exist!")

print("\n🔄 Please restart your backend server for changes to take effect.")

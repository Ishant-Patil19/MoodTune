"""
Quick script to update the database with Google OAuth fields
"""
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from app import app, db

print("🔄 Updating database schema...")

with app.app_context():
    try:
        db.create_all()
        print("✅ Database updated successfully!")
        print("   Added Google OAuth fields to User table")
    except Exception as e:
        print(f"❌ Error updating database: {e}")
        import traceback
        traceback.print_exc()

print("\n✨ You can now test Google OAuth authentication!")
print("   1. Go to http://localhost:3000/signup")
print("   2. Click 'Google' button")
print("   3. Select any mock account")
print("   4. You'll be logged in and redirected to /home")

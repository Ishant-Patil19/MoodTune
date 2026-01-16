#!/usr/bin/env python3
"""
Google OAuth Setup Script for MoodTune
This script helps you set up Google OAuth authentication
"""

import os
import sys

def main():
    print("=" * 60)
    print("🔐 Google OAuth Setup for MoodTune")
    print("=" * 60)
    print()
    
    # Check if .env file exists
    env_path = os.path.join(os.path.dirname(__file__), 'backend', '.env')
    
    if not os.path.exists(env_path):
        print("❌ Error: .env file not found in backend directory")
        print("Please create a .env file first")
        sys.exit(1)
    
    print("✅ Found .env file")
    print()
    
    # Read current .env
    with open(env_path, 'r') as f:
        env_content = f.read()
    
    # Check if Google OAuth is already configured
    if 'GOOGLE_CLIENT_ID' in env_content:
        print("⚠️  Google OAuth variables already exist in .env")
        response = input("Do you want to update them? (y/n): ")
        if response.lower() != 'y':
            print("Skipping Google OAuth setup")
            sys.exit(0)
    
    print()
    print("📋 You need to get Google OAuth credentials from:")
    print("   https://console.cloud.google.com/")
    print()
    print("Steps:")
    print("1. Create a new project or select existing")
    print("2. Enable Google+ API or People API")
    print("3. Create OAuth 2.0 Client ID (Web application)")
    print("4. Add authorized redirect URIs:")
    print("   - http://localhost:3000")
    print("   - http://localhost:5000/auth/google/callback")
    print()
    
    client_id = input("Enter your Google Client ID: ").strip()
    client_secret = input("Enter your Google Client Secret: ").strip()
    
    if not client_id or not client_secret:
        print("❌ Error: Client ID and Secret are required")
        sys.exit(1)
    
    # Add Google OAuth to .env
    google_config = f"""
# Google OAuth Configuration
GOOGLE_CLIENT_ID={client_id}
GOOGLE_CLIENT_SECRET={client_secret}
GOOGLE_REDIRECT_URI=http://localhost:5000/auth/google/callback
"""
    
    # Remove existing Google OAuth config if present
    lines = env_content.split('\n')
    filtered_lines = []
    skip_next = False
    
    for line in lines:
        if 'Google OAuth' in line or skip_next:
            skip_next = True
            if line.strip() == '':
                skip_next = False
            continue
        if not line.startswith('GOOGLE_'):
            filtered_lines.append(line)
    
    env_content = '\n'.join(filtered_lines)
    
    # Append new Google OAuth config
    with open(env_path, 'w') as f:
        f.write(env_content.rstrip() + '\n' + google_config)
    
    print()
    print("✅ Google OAuth configuration added to .env")
    print()
    
    # Create frontend .env.local
    frontend_env_path = os.path.join(os.path.dirname(__file__), 'frontend', '.env.local')
    
    with open(frontend_env_path, 'w') as f:
        f.write(f"NEXT_PUBLIC_GOOGLE_CLIENT_ID={client_id}\n")
    
    print("✅ Created frontend/.env.local with Google Client ID")
    print()
    
    # Update database
    print("🔄 Updating database schema...")
    try:
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
        from app import app, db
        
        with app.app_context():
            db.create_all()
            print("✅ Database updated successfully!")
    except Exception as e:
        print(f"⚠️  Could not update database automatically: {e}")
        print("Please run this manually:")
        print("  cd backend")
        print("  python")
        print("  >>> from app import app, db")
        print("  >>> with app.app_context(): db.create_all()")
    
    print()
    print("=" * 60)
    print("✨ Setup Complete!")
    print("=" * 60)
    print()
    print("Next steps:")
    print("1. Restart your backend server")
    print("2. Restart your frontend server")
    print("3. Navigate to http://localhost:3000/signup")
    print("4. Click 'Google' button to test")
    print()
    print("📚 See GOOGLE_OAUTH_IMPLEMENTATION.md for more details")
    print()

if __name__ == '__main__':
    main()

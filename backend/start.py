#!/usr/bin/env python3
"""
Start script for Railway deployment.
Reads PORT from environment and starts Gunicorn.
"""
import os
import sys

# Get PORT from environment, default to 5000
port = os.environ.get('PORT', '5000')

# Validate port is a number
try:
    port_int = int(port)
    if port_int < 1 or port_int > 65535:
        print(f"Error: PORT {port_int} is not a valid port number (1-65535)")
        sys.exit(1)
except ValueError:
    print(f"Error: PORT '{port}' is not a valid number")
    sys.exit(1)

# Start Gunicorn
os.execvp('gunicorn', [
    'gunicorn',
    '--bind', f'0.0.0.0:{port}',
    '--workers', '2',
    '--timeout', '120',
    'app:app'
])

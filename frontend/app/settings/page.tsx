'use client'

import React from 'react'

export default function Settings() {
    return (
        <div style={{ padding: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#B5C0F5' }}>
            <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '30px' }}>
                <h1 style={{ fontFamily: 'sans-serif' }}>Settings</h1>
                <p>Use "Share Your Feelings" for feedback!</p>
            </div>
        </div>
    )
}

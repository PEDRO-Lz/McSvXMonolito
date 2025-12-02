const express = require('express')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const mysql = require('mysql2/promise')
const app = express()

app.use(bodyParser.json())

// Configuração do pool MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'senha123',
    database: process.env.DB_NAME || 'usersdb'
})

app.post('/register', async (req, res) => {
    const { username, password } = req.body
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username])
        if (rows.length > 0)
            return res.status(400).json({ error: 'User exists' })

        await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password])
        res.json({ success: true })
    } catch (err) {
        console.error('Erro no register:', err)
        res.status(500).json({ error: 'Internal error' })
    }
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password])
        if (rows.length === 0)
            return res.status(401).json({ error: 'Invalid credentials' })

        const token = jwt.sign({ username }, 'secret', { expiresIn: '1h' })
        res.json({ token })
    } catch (err) {
        console.error('Erro no login:', err)
        res.status(500).json({ error: 'Internal error' })
    }
})

app.get('/profile', (req, res) => {
    const auth = req.headers.authorization
    if (!auth) return res.status(401).json({ error: 'No token' })    
            
    try {
        const token = auth.split(' ')[1]
        const decoded = jwt.verify(token, 'secret')
        res.json({ username: decoded.username })
    } catch (e) {
        res.status(401).json({ error: 'Invalid token' })
    }
})

app.listen(3000, () => console.log('API running on 3000'))
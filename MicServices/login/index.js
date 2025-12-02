const express = require('express')
const jwt = require('jsonwebtoken')
const mysql = require('mysql2/promise')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
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
    res.status(500).json({ error: 'Erro interno no login' })
  }
})

app.listen(3002, () => console.log('Login API rodando na porta 3002'))
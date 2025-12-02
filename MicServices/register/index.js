const express = require('express')
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
    res.status(500).json({ error: 'Erro interno no cadastro' })
  }
})

app.listen(3001, () => console.log('Register API rodando na porta 3001'))
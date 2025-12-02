const express = require('express')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())

const USERS_FILE = '/data/users.json'

app.post('/login', (req, res) => {
  const { username, password } = req.body
  let users = []

  try {
    if (fs.existsSync(USERS_FILE)) {
      users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'))
    }
  } catch (err) {
    console.error('Erro ao ler o arquivo de usuários:', err)
    return res.status(500).json({ error: 'Erro ao ler base de usuários' })
  
  }
  const user = users.find(u => u.username === username && u.password === password)
  
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })
  
    try {
    const token = jwt.sign({ username }, 'secret', { expiresIn: '1h' })
    res.json({ token })
  } catch (e) {
    console.error('Erro ao gerar token JWT:', e)
    res.status(500).json({ error: 'Erro interno no login' })
  }
})

app.listen(3002, () => console.log('Login API rodando na porta 3002'))
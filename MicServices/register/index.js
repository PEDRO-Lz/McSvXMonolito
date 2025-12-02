const express = require('express')
const fs = require('fs')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())

const USERS_FILE = '/data/users.json'

app.post('/register', (req, res) => {
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

  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'User exists' })
  }

  users.push({ username, password })

  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users))
  } catch (err) {
    console.error('Erro ao gravar o arquivo de usuários:', err)
    return res.status(500).json({ error: 'Erro ao salvar usuário' })
  }
  res.json({ success: true })
})

app.listen(3001, () => console.log('Register API rodando na porta 3001'))
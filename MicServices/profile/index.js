const express = require('express')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())

app.get('/profile', (req, res) => {
  const auth = req.headers.authorization

  if (!auth) return res.status(401).json({ error: 'No token' })
  
  try {
    const token = auth.split(' ')[1]
    const decoded = jwt.verify(token, 'secret')
    res.json({ username: decoded.username })
  } catch (e) {
    console.error('Erro ao verificar token JWT:', e)
    res.status(401).json({ error: 'Invalid token' })
  }
})

app.listen(3003, () => console.log('Profile API rodando na porta 3003'))
const express = require('express')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const fs = require('fs')
const app = express()

app.use(bodyParser.json())

const USERS_FILE = './data/users.json'

function readUsers() {
    if (!fs.existsSync(USERS_FILE)) return []
    
    try {
        return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'))
    } catch (err) {
        console.error('Erro ao ler arquivo de usuários:', err)
        return []
    }
}

function writeUsers(users) {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users))
    } catch (err) {
        console.error('Erro ao gravar arquivo de usuários:', err)
    }
}

app.post('/register', (req, res) => {
    try {
        const { username, password } = req.body
        let users = readUsers()
        if (users.find(u => u.username === username)) {
            return res.status(400).json({ error: 'User exists' })
        }
        users.push({ username, password })
        writeUsers(users)
        res.json({ success: true })
    } catch (err) {
        res.status(500).json({ error: 'Internal error' })
    }
})

app.post('/login', (req, res) => {
    try {
        const { username, password } = req.body
        let users = readUsers()
        const user = users.find(u => u.username === username && u.password === password)
        if (!user) return res.status(401).json({ error: 'Invalid credentials' })
        const token = jwt.sign({ username }, 'secret', { expiresIn: '1h' })
        res.json({ token })
    } catch (err) {
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
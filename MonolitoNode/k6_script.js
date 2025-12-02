import http from 'k6/http'

export let options = {
  vus: 1000,
  duration: '30s',
}

export default function () {
  let username = `user${__VU}_${Date.now()}_${Math.floor(Math.random() * 1000000)}`
  let password = 'senha123'

  let registerPayload = JSON.stringify({
    username: username,
    password: password
  })

  let regRes = http.post('http://localhost:3000/register', registerPayload, {
    headers: { 'Content-Type': 'application/json' }
  })

  if (regRes.status !== 200 && regRes.status !== 201) {
    console.error(`Falha ao registrar: ${regRes.status}`)
    return
  }

  let loginPayload = JSON.stringify({
    username: username,
    password: password
  })

  let loginRes = http.post('http://localhost:3000/login', loginPayload, {
    headers: { 'Content-Type': 'application/json' }
  })

  if (loginRes.status !== 200) {
    console.error(`Falha login: ${loginRes.status}`)
    return
  }

  let token
  try {
    token = loginRes.json('token')
  } catch (err) {
    console.error('Token não recebido')
    return
  }

  let getRes = http.get('http://localhost:3000/profile', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  if (getRes.status !== 200) {
    console.error(`Falha no GET /profile: ${getRes.status}`)
  }
}
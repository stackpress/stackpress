import { server as http } from 'stackpress/http'

const server = http()

server.get('/', (req, res) => {
  const name = req.data.path('name', 'guest')
  res.setBody('text/plain', `Hello ${name}`)
})

server.create().listen(3000, () => {
  console.log('Server is running on port 3000')
})
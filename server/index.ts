import { createServer } from 'vite'

async function startServer() {
  const server = await createServer({
    server: {
      host: true,
      port: 5000,
      allowedHosts: true
    }
  })
  await server.listen()
  console.log(`[vite] dev server running at http://localhost:5000`)
}

startServer().catch(console.error)
import express from 'express'
import { companiaRouter } from './src/Compania/compania.routes.js'
const app = express()
app.use(express.json())

app.use('/api/compania', companiaRouter)

app.use((_, res) => {
  res.status(404).send({ message: 'Resource not found' })
  return
})

app.listen(3000, () => {
  console.log('Server runnning on http://localhost:3000/')
})

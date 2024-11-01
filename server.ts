import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import conection from './utils/db'
import bodyParser from 'body-parser'
import authRoutes from './routes/authRoutes'
import productRoutes from './routes/productRoutes'
import cors from 'cors'

// Initialize dotenv
dotenv.config()

// Create Express Instance
const app:Express = express()

// Use Cors
app.use(cors(
    {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: ['Content-Type', 'Authorization'],
    }
))

// Parse incoming JSON requests
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Create URL Routing
app.get('/', (req:Request, res:Response) => {
    res.send('Hello, this is typescript nodejs project')
})

// Use Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)

// Test Connect Database MySQL
app.get('/testdb', (req:Request, res:Response) => {
    conection.connect((error: Error | unknown) => {
        if(error){
            res.send(`Error connecting to database: ${error}`)
        } else {
            res.send('Database is connected successfully')
        }
    })
})

// Start Server on port 4000
const port:string | number = process.env.PORT || 4000
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})
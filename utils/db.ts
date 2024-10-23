import mysql, { ConnectionOptions } from 'mysql2'
import dotenv from 'dotenv'

// Initialize dotenv
dotenv.config()

const dbConfig: ConnectionOptions = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '3307'),
    database: process.env.DB_DATABASE
}

const conection = mysql.createConnection(dbConfig)

conection.connect((error: Error | unknown) => {
    if(error){
        console.log('Error connecting to database:', error)
    } else {
        console.log('Database is connected successfully')
    }
})

export default conection
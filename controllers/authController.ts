import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { Request, Response } from "express"
import connection from "../utils/db"
import dotenv from "dotenv"

// Initialize dotenv
dotenv.config()

// Define Interface for User
interface User {
  firstname: string
  lastname: string
  email: string
  password: string
}

// Register function
async function register(req: Request, res: Response): Promise<void> {
  // Get data from body
  const { firstname, lastname, email, password }: User = req.body

  // Check if the user already exists
  try {
    connection.execute(
      "SELECT * FROM users WHERE email = ?",
      [email],
      function (error: any, results: any) {
        if (error) {
          results.json({ status: "error", message: error })
          return
        } else {
          if (results.length > 0) {
            res.json({ status: "error", message: "Email already exists" })
            return
          } else {
            // Hash password
            bcrypt.hash(password, 10, function (err, hash) {
              if (err) {
                res.json({ status: "error", message: "Error hashing password" })
                return
              } else {
                // Store user into database
                const sql =
                  "INSERT INTO users (firstname, lastname, email, password, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())"

                const values = [firstname, lastname, email, hash]

                // Insert user into database
                connection.execute(
                  sql,
                  values,
                  function (error: any, results: any, fields: any) {
                    if (error) {
                      res.json({ status: "error", message: error })
                      return
                    } else {
                      // Generate JWT token
                      const token = jwt.sign(
                        { email },
                        process.env.JWT_SECRET || ""
                      )

                      res.json({
                        status: "ok",
                        message: "User registered successfully",
                        token: token,
                        user: {
                          id: results.insertId,
                          firstname: firstname,
                          lastname: lastname,
                          email: email,
                        },
                      })
                    }
                  }
                )
              }
            })
          }
        }
      }
    )
  } catch (error) {
    console.log("Error registering user:", error)
    res.sendStatus(500)
  }
}

// Login function
async function login(req: Request, res: Response) {
  // Get data from body
  const { email, password }: User = req.body

  try {
    connection.execute(
      "SELECT * FROM users WHERE email = ?",
      [email],
      function (error: any, results: any) {
        if (error) {
          res.json({ status: "error", message: error })
          return
        } else {
          if (results.length > 0) { // พบ email ในฐานข้อมูล
            // Compare password with hashed password
            bcrypt.compare(
              password,
              results[0].password,
              function (err, result) {
                if (err) {
                  res.json({ status: "error", message: err })
                  return
                }else{
                  if (result) {
                    // Generate JWT token
                    const token = jwt.sign(
                        { email },
                        process.env.JWT_SECRET || ""
                    )

                    res.json({
                      status: "ok",
                      message: "User logged in successfully",
                      token: token,
                      user: {
                        id: results[0].id,
                        firstname: results[0].firstname,
                        lastname: results[0].lastname,
                        email: results[0].email,
                      },
                    })
                  } else {
                    res.json({ status: "error", message: "Invalid password" })
                    return
                  }
                }
              }
            )
          } else {
            res.json({ status: "error", message: "Email not found" })
            return
          }
        }
      }
    )
  } catch (error) {
    console.log("Error login user:", error)
    res.sendStatus(500)
  }
}

export { register, login }

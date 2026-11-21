
const http = require("http");
const bcrypt = require("bcryptjs");
const db = require("./db");

function signup(req, res) {
    let body = "";

    req.on("data", chunk => {
        body += chunk;
    });

    req.on("end", async () => {
        try {
            const { name, email, password } = JSON.parse(body);

            if (!name || !email || !password) {
                res.writeHead(400, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({
                    message: "All fields are required"
                }));
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            db.query(
                "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
                [name, email, hashedPassword],
                (err) => {
                    if (err) {
                        res.writeHead(400, { "Content-Type": "application/json" });
                        return res.end(JSON.stringify({
                            message: "Signup failed. Email may already exist."
                        }));
                    }

                    res.writeHead(201, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({
                        message: "Registration successful!"
                    }));
                }
            );
        } catch (error) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Invalid request" }));
        }
    });
}

module.exports = signup;

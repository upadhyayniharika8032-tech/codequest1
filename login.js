
const bcrypt = require("bcryptjs");
const db = require("./db");

function login(req, res) {
    let body = "";

    req.on("data", chunk => {
        body += chunk;
    });

    req.on("end", async () => {
        try {
            const { email, password } = JSON.parse(body);

            if (!email || !password) {
                res.writeHead(400, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({
                    message: "Email and password are required"
                }));
            }

            db.query(
                "SELECT * FROM users WHERE email = ?",
                [email],
                async (err, results) => {
                    if (err) {
                        res.writeHead(500, { "Content-Type": "application/json" });
                        return res.end(JSON.stringify({
                            message: "Database error"
                        }));
                    }

                    if (results.length === 0) {
                        res.writeHead(401, { "Content-Type": "application/json" });
                        return res.end(JSON.stringify({
                            message: "Invalid email or password"
                        }));
                    }

                    const user = results[0];

                    const isMatch = await bcrypt.compare(
                        password,
                        user.password_hash
                    );

                    if (!isMatch) {
                        res.writeHead(401, { "Content-Type": "application/json" });
                        return res.end(JSON.stringify({
                            message: "Invalid email or password"
                        }));
                    }

                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({
                        message: "Login successful!",
                        user: {
                            userid: user.userid,
                            name: user.name,
                            email: user.email
                        }
                    }));
                }
            );
        } catch (error) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({
                message: "Invalid request"
            }));
        }
    });
}

module.exports = login;
console.log("Login module loaded:", typeof module.exports);
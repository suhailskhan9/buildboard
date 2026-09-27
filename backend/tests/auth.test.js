import request from "supertest";
import app from "../src/app.js";
import pool from "../src/config/database.js";
import jwt from "jsonwebtoken";
import { config } from "../src/config/config.js";

let email;

test("user signup test", async() => {
    email = `test-${Date.now()}@example.com`;
    const username = `testuser-${Date.now()}`;
    const password = `testpass123`;

    const response = await request(app).post("/signup").send({ email, username, password });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({message: "User created successfully"});

    const result = await pool.query("SELECT * FROM users WHERE email=$1 AND username=$2", [email, username]);
    
    expect(result.rowCount).toBe(1);

});


test("signup rejects existing email", async() => {
    email = `test-${Date.now()}@example.com`;
    const username = `testuser-${Date.now()}`;
    const password = `testpass123`;

    const firstResponse = await request(app).post("/signup").send({ email, username, password });

    expect(firstResponse.status).toBe(201);
    expect(firstResponse.body).toEqual({message: "User created successfully"});

    // using existing email
    const secondResponse = await request(app).post("/signup").send({ email, username: `another-${Date.now()}`, password });

    expect(secondResponse.status).toBe(409);
    expect(secondResponse.body).toEqual({message: "Email already exists"});
});

test("signup rejects existing username", async() => {
    const email = `test-${Date.now()}@example.com`;
    const username = `testuser-${Date.now()}`;
    const password = `testpass123`;

    const firstResponse = await request(app).post("/signup").send({ email, username, password });

    expect(firstResponse.status).toBe(201);
    expect(firstResponse.body).toEqual({message: "User created successfully"});

    // using existing username
    const secondEmail = `testemail2-${Date.now()}@example.com`;
    const secondResponse = await request(app).post("/signup").send({ email: secondEmail, username, password });

    expect(secondResponse.status).toBe(409);
    expect(secondResponse.body).toEqual({message: "Username already exists"});
});

test("signup rejects wrong email type", async() => {
    const email = 12345
    const username = 'user1';
    const password = 'password123';

    const response = await request(app).post("/signup").send({ email, username, password });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
})

test("signup rejects invalid email format", async() => {
    const email = 'not-an-email'
    const username = 'user1';
    const password = 'password123';

    const response = await request(app).post("/signup").send({ email, username, password });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
})

test("signup rejects short password", async() => {
    const email = `test-${Date.now()}@example.com`;
    const username = `testuser-${Date.now()}`;
    const password = 'pass';

    const response = await request(app).post("/signup").send({ email, username, password });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
})

// login
test("user can login", async() => {
    email = `test-${Date.now()}@example.com`;
    const username = `testuser-${Date.now()}`;
    const password = `testpass123`;

    const signupResponse = await request(app).post("/signup").send({ email, username, password });
    expect(signupResponse.status).toBe(201);
    
    const result = await pool.query(
    "SELECT id FROM users WHERE email = $1",
        [email]
    );

    expect(result.rowCount).toBe(1);

    const userId = result.rows[0].id;

    const loginResponse = await request(app).post("/login").send({ email, password });
    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.message).toBe("Login successful");

    // verify token
    const decoded = jwt.verify(
        loginResponse.body.token,
        config.jwt.secret
    );

    expect(decoded.id).toBe(userId);
    expect(decoded.email).toBe(email);

})

test("login rejects wrong password", async() => {
    email = `test-${Date.now()}@example.com`;
    const username = `testuser-${Date.now()}`;
    const password = `testpass123`;

    const signupResponse = await request(app).post("/signup").send({ email, username, password });
    expect(signupResponse.status).toBe(201);

    const loginResponse = await request(app).post("/login").send({ email, password: "wrong password" });
    expect(loginResponse.status).toBe(401);
    expect(loginResponse.body.message).toBe("Invalid email or password");
})

test("login rejects non-existing email", async() => {
    const email = "email@abc.com";
    const password = "password123";

    const loginResponse = await request(app).post("/login").send({ email, password });
    expect(loginResponse.status).toBe(401);
    expect(loginResponse.body.message).toBe("Invalid email or password");
})

afterEach(async() => {
    if(email) {
        await pool.query(
            "DELETE FROM users WHERE email = $1", [email]
        )
    }
    email = undefined;
})

afterAll(async() => {
    await pool.end();
})
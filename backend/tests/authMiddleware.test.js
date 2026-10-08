import request from "supertest";
import app from "../src/app";
import pool from "../src/config/database.js";

let email;

test("rejects request without authorization header token", async() => {
    const response = await request(app).get("/projects");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Authorization token missing");
})

test("rejects malformed authorization header", async () => {
    const response = await request(app).get("/projects").set("Authorization", "InvalidToken");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Malformed authorization header");
})

test("rejects invalid JWT", async () => {
    const response = await request(app).get("/projects").set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Authentication failed");
})

test("allows request with valid JWT", async () => {
    email = `test-${Date.now()}@example.com`;
    const username = `testuser-${Date.now()}`;
    const password = "testpass123";

    await request(app).post("/signup").send({ email, username, password });

    const loginResponse = await request(app).post("/login").send({ email, password });

    expect(loginResponse.status).toBe(200);

    const token = loginResponse.body.token;

    const response = await request(app).get("/projects").set("Authorization", `Bearer ${token}`)

    expect(response.status).not.toBe(401);
})

afterEach(async () => {
    if(email) {
        await pool.query("DELETE FROM users WHERE email = $1", [email])
    }

    email = undefined;
})

afterAll(async() => {
    await pool.end();
})
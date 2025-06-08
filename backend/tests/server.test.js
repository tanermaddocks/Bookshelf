const mongoose = require("mongoose");
const request = require("supertest");

const app = require("../src/index");
const connectDB = require("../src/utils/database");


beforeAll(async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error(error);
  }
});

afterAll (async () => {
  await mongoose.connection.close();
});


describe("GET /health", () => {
  it("should return status OK and the database name", async() => {
    
    const response = await request(app).get("/dbHealth");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("OK");
    expect(response.body.name).toBeTruthy();
  });
})
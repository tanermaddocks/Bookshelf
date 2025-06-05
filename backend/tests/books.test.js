const mongoose = require("mongoose");
const request = require("supertest");

const app = require("../src");
const connectDB = require("../src/utils/database");


beforeAll(async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error(error);
  }
});

afterAll(async () => {
  // Clear test db
  await mongoose.connection.dropDatabase();
  // Close connection
  await mongoose.connection.close();
});


// Test object
const testBook = {
  title: "test-book",
  author: "test-author",
  genres: ["test-genre"]
}


describe("POST /books", () => {
  it("should create a book and return it", async () => {

    const response = await request(app)
      .post("/books")
      .send(testBook)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.operation).toBe("POST");
    expect(response.body.data).toMatchObject(testBook);
    expect(response.body.data._id).toBeTruthy();

  });
});


describe("GET /books/all", () => {
  it("should return success and all books in the database", async () => {

    const response = await request(app)
      .get("/books/all")
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.operation).toBe("GET");
    expect(response.body.data[0]).toMatchObject(testBook);
    expect(response.body.data[0]._id).toBeTruthy();

  });
});


describe("GET /books/:bookId", () => {
  it("should return success and one book", async () => {

    // Get testBook Id
    const testBooks = await request(app)
      .get("/books/all")
    const testBookId = testBooks.body.data[0]._id;

    const response = await request(app)
      .get("/books/" + testBookId)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.operation).toBe("GET");
    expect(response.body.data).toMatchObject(testBook);
    expect(response.body.data._id).toBeTruthy();

  })

})


describe("PATCH /books/bookId", () => {
  it("should update a book and return it", async () => {

    // Get testBook Id
    const testBooks = await request(app)
      .get("/books/all")
    const testBookId = testBooks.body.data[0]._id;

    const response = await request(app)
      .patch("/books/" + testBookId)
      .send({ author: "new-test-author" })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.operation).toBe("PATCH");
    expect(response.body.data.author).toBe("new-test-author");

  });
});


describe("DELETE /books/:bookId", () => {
  it("should delete a book and return it", async () => {

    // Get testBook Id
    const testBooks = await request(app)
      .get("/books/all")
    const testBookId = testBooks.body.data[0]._id;

    const response = await request(app)
      .delete("/books/" + testBookId)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.operation).toBe("DELETE");
    expect(response.body.data._id).toBeTruthy();

  });
});



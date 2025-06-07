import { afterAll, afterEach, beforeAll, expect, test, vi } from "vitest";
import { server } from "../mocks/node";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import Table from "../src/components/Table.astro";

// Before testing, run mock server
beforeAll(() => {
  server.listen();
});

// Before each test, reset handlers
afterEach(() => {
  server.resetHandlers();
});

// After testing, close mock server
afterAll(() => {
  server.close();
});

// Test Table component for retrieval of all books
test("Table component retrieves all book objects", async () => {
  const container = await AstroContainer.create();
  const tableComponent = await container.renderToString(Table);

  vi.waitFor(() => {
    expect(tableComponent).toContain("TestBook1");
    expect(tableComponent).toContain("TestAuthor")
    expect(tableComponent).toContain("TestBook2");
    expect(tableComponent).toContain("TestGenre1, TestGenre2");
  });
});


import { http, HttpResponse } from "msw";

const apiURL = import.meta.env.PUBLIC_API_URL

// Array of interceptors
export const handlers = [
  http.get(apiURL + "/books/all", () => {
    return HttpResponse.json({
      success: true,
      method: "GET",
      data: [
        {
          title: "TestBook1",
          author: "TestAuthor"
        },
        {
          title: "TestBook2",
          genres: ["TestGenre1", "TestGenre2"]
        },
      ]
    });
  }),

  http.post(apiURL + "/books", () => {
    return HttpResponse.json(
      {
        success: true,
        method: "POST",
        data: {
          _id: "testID123",
          title: "TestBook3",
          author: "TestAuthor",
          genres: ["TestGenre1", "TestGenre2"]
        }
      })
  }),

  http.delete(apiURL + "/books/testID123", () => {
    return HttpResponse.json(
      {
        success: true,
        method: "DELETE",
        data: {
          _id: "testID123",
          title: "TestBook3",
          author: "TestAuthor",
          genres: ["TestGenre1", "TestGenre2"]
        }
      }
    )
  })

];
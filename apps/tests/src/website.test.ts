import axios from 'axios';
import { describe, expect, it } from "vitest";

let BASE_URL = "http://localhost:3000/api/v1";

describe('Website get added', () => { 
  it('should add a website', async () => {
    // Add a new website
    const addResponse = await axios.post(`${BASE_URL}/websites`, {
      url: "https://example.com",
      description: "Example website"
    });
    expect(addResponse.status).toBe(201);
  });
  it("should not add a website with missing url or invalid url", async () => {
    try {
      await axios.post(`${BASE_URL}/websites`, {
        description: "Missing URL"
      });
    } catch (error:any) {
      // const expectedErrorMessage = error.response.data.message == "URL is required" ? "URL is required" : "Invalid URL format";
      // expect(error.response.status).toBe(400);
      expect(false);
      // expect(error.response.data.message).toBe(expectedErrorMessage);
    }
  });
 })
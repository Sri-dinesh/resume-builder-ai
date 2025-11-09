import { POST } from "../route";
import { NextResponse } from "next/server";

jest.mock('next/server');

describe("POST /api/contact", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    (NextResponse.json as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return 400 if email is invalid", async () => {
    const invalidEmail = "invalid-email";
    const req = {
      json: async () => ({
        firstName: "Test",
        email: invalidEmail,
        message: "Test message",
      }),
    } as Request;

    await POST(req);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Invalid email format" },
      { status: 400 }
    );
  });

  it("should return 200 if email is valid", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({ success: true }),
      ok: true,
    });

    const validEmail = "test@example.com";
    const req = {
      json: async () => ({
        firstName: "Test",
        email: validEmail,
        message: "Test message",
      }),
    } as Request;

    await POST(req);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: "Email sent successfully!" },
      { status: 200 }
    );
  });
});

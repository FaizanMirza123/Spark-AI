import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { Role } from "../src/models/role.js";
import { User } from "../src/models/user.js";
import { Category } from "../src/models/category.js";
import { Service } from "../src/models/service.js";

/* ------------------------------------------------------------------ */
/*  Shared state across describe blocks                                */
/* ------------------------------------------------------------------ */
let customerCookie: string;
let providerCookie: string;
let categoryId: string;
let serviceId: string;
let bookingId: string;

/* ================================================================== */
/*  AUTH                                                                */
/* ================================================================== */
describe("Auth API", () => {
  it("POST /api/auth/signup — creates a customer account", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "Test Customer",
      email: "customer@test.com",
      password: "Customer1!",
      confirmPassword: "Customer1!",
    });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe("customer@test.com");
    expect(res.body.role).toBe("customer");
    expect(res.body.password).toBeUndefined();

    const cookies: string[] = res.headers["set-cookie"];
    customerCookie = cookies.find((c) => c.startsWith("session-token="))!;
    expect(customerCookie).toBeDefined();
  });

  it("POST /api/auth/signup — rejects duplicate email", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "Dup",
      email: "customer@test.com",
      password: "Customer1!",
      confirmPassword: "Customer1!",
    });
    expect(res.status).toBe(409);
  });

  it("POST /api/auth/login — authenticates user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "customer@test.com",
      password: "Customer1!",
    });

    expect(res.status).toBe(200);
    expect(res.body.email).toBe("customer@test.com");

    const cookies: string[] = res.headers["set-cookie"];
    customerCookie = cookies.find((c) => c.startsWith("session-token="))!;;
  });

  it("POST /api/auth/login — rejects wrong password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "customer@test.com",
      password: "WrongPass1!",
    });
    expect(res.status).toBe(401);
  });

  it("GET /api/auth/me — returns current user", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Cookie", customerCookie);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe("customer@test.com");
    expect(res.body.role).toBe("customer");
  });

  it("GET /api/auth/me — rejects unauthenticated", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  it("POST /api/auth/logout — clears session", async () => {
    const res = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", customerCookie);

    expect(res.status).toBe(200);

    // Re-login so subsequent tests have a valid cookie
    const login = await request(app).post("/api/auth/login").send({
      email: "customer@test.com",
      password: "Customer1!",
    });
    const cookies: string[] = login.headers["set-cookie"];
    customerCookie = cookies.find((c) => c.startsWith("session-token="))!;
  });
});

/* ================================================================== */
/*  SERVICES                                                           */
/* ================================================================== */
describe("Services API", () => {
  beforeAll(async () => {
    // Create a provider user and log in
    const providerRole = await Role.findOne({ where: { name: "provider" } });
    await User.create({
      name: "Test Provider",
      email: "provider@test.com",
      password: "Provider1!",
      roleId: providerRole!.id,
    });
    const login = await request(app).post("/api/auth/login").send({
      email: "provider@test.com",
      password: "Provider1!",
    });
    const cookies: string[] = login.headers["set-cookie"];
    providerCookie = cookies.find((c) => c.startsWith("session-token="))!;

    // Seed a category
    const cat = await Category.create({
      name: "Cleaning",
      slug: "cleaning",
      description: "Cleaning services",
    });
    categoryId = cat.id;

    // Seed a service
    const svc = await Service.create({
      name: "Deep Clean",
      description: "Full deep cleaning",
      categoryId,
      providerId: (await User.findOne({ where: { email: "provider@test.com" } }))!.id,
      price: 100,
      duration: 60,
      imageUrl: "https://example.com/clean.jpg",
    });
    serviceId = svc.id;
  });

  it("GET /api/categories — lists categories", async () => {
    const res = await request(app).get("/api/categories");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].name).toBe("Cleaning");
  });

  it("GET /api/services — lists services with camelCase keys", async () => {
    const res = await request(app).get("/api/services");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    const svc = res.body[0];
    expect(svc.category).toBeDefined();
    expect(svc.categoryName).toBe("Cleaning");
    expect(svc.providerName).toBe("Test Provider");
  });

  it("GET /api/services?category=cleaning — filters by slug", async () => {
    const res = await request(app).get("/api/services?category=cleaning");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);

    const res2 = await request(app).get("/api/services?category=nonexistent");
    expect(res2.status).toBe(200);
    expect(res2.body.length).toBe(0);
  });

  it("GET /api/services/:id — returns single service", async () => {
    const res = await request(app).get(`/api/services/${serviceId}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Deep Clean");
    expect(res.body.category).toBeDefined();
    expect(res.body.categoryName).toBe("Cleaning");
    expect(res.body.providerName).toBe("Test Provider");
  });

  it("GET /api/services/:id — 404 for unknown id", async () => {
    const res = await request(app).get("/api/services/00000000-0000-0000-0000-000000000000");
    expect(res.status).toBe(404);
  });

  it("POST /api/services — provider can create service", async () => {
    const res = await request(app)
      .post("/api/services")
      .set("Cookie", providerCookie)
      .send({
        name: "Window Wash",
        description: "Professional window cleaning",
        categoryId,
        price: 60,
        duration: 45,
      });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("Window Wash");
  });

  it("POST /api/services — rejects unauthenticated", async () => {
    const res = await request(app).post("/api/services").send({
      name: "Fail",
      description: "Should fail",
      categoryId,
      price: 10,
      duration: 10,
    });
    expect(res.status).toBe(401);
  });
});

/* ================================================================== */
/*  BOOKINGS                                                           */
/* ================================================================== */
describe("Bookings API", () => {
  it("POST /api/bookings — customer creates booking", async () => {
    const res = await request(app)
      .post("/api/bookings")
      .set("Cookie", customerCookie)
      .send({
        serviceId,
        scheduledDate: "2026-06-15",
        scheduledTime: "10:00",
        address: "123 Test St",
        notes: "Integration test",
      });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("pending");
    expect(res.body.customer).toBeDefined();
    expect(res.body.service).toBeDefined();
    expect(res.body.provider).toBeDefined();
    expect(Number(res.body.totalAmount)).toBe(105); // 100 + 5% fee
    bookingId = res.body.id;
  });

  it("GET /api/bookings — lists customer bookings", async () => {
    const res = await request(app)
      .get("/api/bookings")
      .set("Cookie", customerCookie);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("GET /api/bookings/:id — returns booking detail", async () => {
    const res = await request(app)
      .get(`/api/bookings/${bookingId}`)
      .set("Cookie", customerCookie);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(bookingId);
    expect(res.body.customer).toBeDefined();
    expect(res.body.service).toBeDefined();
    expect(res.body.provider).toBeDefined();
  });

  it("PATCH /api/bookings/:id/status — valid transition (pending → confirmed)", async () => {
    // Provider or admin can confirm. Let's use provider:
    const res = await request(app)
      .patch(`/api/bookings/${bookingId}/status`)
      .set("Cookie", providerCookie)
      .send({ status: "confirmed" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("confirmed");
  });

  it("PATCH /api/bookings/:id/status — invalid transition (confirmed → pending)", async () => {
    const res = await request(app)
      .patch(`/api/bookings/${bookingId}/status`)
      .set("Cookie", providerCookie)
      .send({ status: "pending" });

    expect(res.status).toBe(400);
  });

  it("PATCH /api/bookings/:id/status — confirmed → cancelled", async () => {
    const res = await request(app)
      .patch(`/api/bookings/${bookingId}/status`)
      .set("Cookie", providerCookie)
      .send({ status: "cancelled" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("cancelled");
  });

  it("GET /api/bookings — rejects unauthenticated", async () => {
    const res = await request(app).get("/api/bookings");
    expect(res.status).toBe(401);
  });

  it("GET /api/bookings/:id — rejects access by other customer", async () => {
    // Signup a second customer
    const signup = await request(app).post("/api/auth/signup").send({
      name: "Other Customer",
      email: "other@test.com",
      password: "Other123!",
      confirmPassword: "Other123!",
    });
    const cookies: string[] = signup.headers["set-cookie"];
    const otherCookie = cookies.find((c) => c.startsWith("session-token="))!;

    const res = await request(app)
      .get(`/api/bookings/${bookingId}`)
      .set("Cookie", otherCookie);

    expect(res.status).toBe(403);
  });
});

/* ================================================================== */
/*  HEALTH                                                             */
/* ================================================================== */
describe("Health", () => {
  it("GET /health — returns ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

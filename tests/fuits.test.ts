import { FruitInput } from "services/fruits-service";
import supertest from "supertest";
import app from "index";
import httpStatus from "http-status";

describe("fruits tests", () => {
  it("should respond with status 422 if body is not valid", async () => {
    const fruit = {
      name: 10,
      price: 10,
    };

    const result = await supertest(app).post("/fruits").send(fruit);

    expect(result.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it("should create a valid fruit", async () => {
    const body: FruitInput = {
      name: "banana",
      price: 10,
    };

    const result = await supertest(app).post("/fruits").send(body);
    const status = result.status;

    expect(status).toBe(httpStatus.CREATED);
  });

  it("should respond with status 409 if fruit already exists", async () => {
    const body: FruitInput = {
      name: "banana",
      price: 10,
    };

    const result = await supertest(app).post("/fruits").send(body);
    const status = result.status;

    expect(status).toBe(httpStatus.CONFLICT);
    // expect(result.body).toEqual({
    //   message: "This fruit already exists!",
    // });
  });

  it("should return all the fruits", async () => {
    const result = await supertest(app).get("/fruits");
    const response = result.body;
    const status = result.status;

    expect(status).toBe(httpStatus.OK);

    expect(response).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          price: expect.any(Number),
        }),
      ])
    );
  });

  it("should respond with status 404 if the fruit does not exists", async () => {
    const result = await supertest(app).get("/fruits/3");
    const status = result.status;

    expect(status).toBe(httpStatus.NOT_FOUND);
  });

  it("should return the fruit by Id", async () => {
    const result = await supertest(app).get("/fruits/1");
    const status = result.status;
    const response = result.body;

    expect(status).toBe(httpStatus.OK);

    expect(response).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      price: expect.any(Number),
    });
  });
});

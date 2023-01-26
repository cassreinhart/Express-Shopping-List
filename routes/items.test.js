process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app")
let items = require('../fakeDb');

let item = { name: "12 Large Eggs", price: 4.69 };

beforeEach(function() {
  items.push(item)
})

afterEach(function() {
  items.length = 0;
})


describe("GET /items", () => {
    test("Get all items", async () => {
        const res = await request(app).get(`/items/`)
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({items: [item]})
    })
    test("Get a single item", async () => {
        const res = await request(app).get(`/items/${item.name}`)
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({item})
    })
})

describe("POST /items", () => {
    test("Add an item to list", async () => {
        const res = await request(app).post(`/items`).send({name: "popsicles" , price: 5.64})
        expect(res.statusCode).toBe(201)
        expect(res.body).toEqual({"added": {"name": "popsicles", "price": 5.64}})
        expect(items.length).toEqual(2);
    })
    test("Try to create an item without necessary data", async () => {
        const res = await request(app).post('/items').send({})
        expect(res.status).toBe(400)
      })
})

describe("PATCH /items/:name", () => {
    test("Update an item's price", async () => {
      const res = await request(app).patch(`/items/${item.name}`).send({price: 20.00})
      console.log(res.body)
      expect(res.status).toBe(200)
      expect(res.body).toEqual({"updated": {"name": "Eggs", "price": 20,}})
      
    })
    test("Respond w/404 for invalid name", async () => {
      const res = await request(app).patch(`/items/Eegs`).send({"name": "12 Grandes Huevos"})
      expect(res.statusCode).toBe(404)
    })
})
  
describe('DELETE /items/:name', () => { 
    test('deleting an item', async function (){
      const res = await request(app).delete(`/items/${item.name}`)
      expect(res.statusCode).toBe(200)
      expect(res.body).toEqual({message: "Deleted"})
    })
    test("Respond w/404 for invalid name", async ()=> {
      const res = await request(app).delete(`/items/Eegs`)
      expect(res.statusCode).toBe(404)
    })
})

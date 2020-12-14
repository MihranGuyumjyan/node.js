import { graphqlTestCall } from "./graphqlTestCall";
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { User } from "../models/users";

let mongoServer;
const opts = { }; 

beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  await mongoose.connect(mongoUri, opts, (err) => {
    if (err) console.error(err);
  });
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

const createUserMutation = `
  mutation createUser($firstName: String!, $lastName: String!, $email: String!, $password: String!) {
    createUser(firstName: $firstName, lastName: $lastName, email: $email, password: $password) {
        firstName
        lastName
        email
        userId
    }
  }
`;

const createOfferMutation = `
  mutation createOfffer($title: String!, $productType: String!, $condition: ProductCondition!, $description: String, $price: InputPrice! ) {
    createOffer(title: $title, productType: $productType, condition: $condition, description: $description, price: $price) {
        title
        productType
        condition
        price {value, currency}
        userId
    }
  }
`;

const getOfferQuery = `
    query getOffer($condition: ProductCondition, $minPrice: Float, $maxPrice: Float){
        getOffer(condition: $condition, minPrice: $minPrice, maxPrice: $maxPrice) {
            title
            productType
            condition
            price {value, currency}
            userId
        }
    }
`;

describe("resolvers", () => {

    it("should create product offer", async () => {
      const testUser = { firstName: "Mihran", lastName: "Guyumjyan", email: "mihran@gmail.com", password: "pass" };
      
      await graphqlTestCall(createUserMutation, {
        email: testUser.email,
        password: testUser.password,
        lastName: testUser.lastName,
        firstName: testUser.firstName
      });

      const userData = await User.findOne({ email: "mihran@gmail.com" })

      const testOffer = { title: "bmw", productType: "car", condition: "USED", price: { value: 50, currency: "USD" }}
      
      const offerResponse = await graphqlTestCall(createOfferMutation, { ...testOffer, userId: userData.userId }, userData.userId );    
      
      expect(offerResponse.data.createOffer).toEqual({...testOffer, userId: userData.userId});
    });
});


describe("queries", () => {

    it("should get products offers", async () => {
      const testUser = { firstName: "Mihran", lastName: "Guyumjyan", email: "mihran@gmail.com", password: "pass" };
      
      await graphqlTestCall(createUserMutation, {
        email: testUser.email,
        password: testUser.password,
        lastName: testUser.lastName,
        firstName: testUser.firstName
      });

      const userData = await User.findOne({ email: "mihran@gmail.com" })

      const testOfferOne = { title: "bmw", productType: "car", condition: "USED", price: { value: 50, currency: "USD" }}
      const testOfferTwo = { title: "mercedes", productType: "car", condition: "NEW", price: { value: 15, currency: "USD" }}
      
      await graphqlTestCall(createOfferMutation, { ...testOfferOne, userId: userData.userId }, userData.userId );
      await graphqlTestCall(createOfferMutation, { ...testOfferTwo, userId: userData.userId }, userData.userId );

      const offerResponse = await graphqlTestCall(getOfferQuery, {}, userData.userId );

      const expectedResponse = [{ ...testOfferOne, userId: userData.userId }, { ...testOfferTwo, userId: userData.userId }];
    
      expect(offerResponse.data.getOffer).toEqual(expectedResponse);
    });

    it("should get product offers with filters", async () => {
        const testUser = { firstName: "Mihran", lastName: "Guyumjyan", email: "mihran@gmail.com", password: "pass" };
        
        await graphqlTestCall(createUserMutation, {
          email: testUser.email,
          password: testUser.password,
          lastName: testUser.lastName,
          firstName: testUser.firstName
        });
  
        const userData = await User.findOne({ email: "mihran@gmail.com" })
  
        const testOfferOne = { title: "bmw", productType: "car", condition: "USED", price: { value: 50, currency: "USD" }}
        const testOfferTwo = { title: "mercedes", productType: "car", condition: "NEW", price: { value: 15, currency: "USD" }}
        
        await graphqlTestCall(createOfferMutation, { ...testOfferOne, userId: userData.userId }, userData.userId );
        await graphqlTestCall(createOfferMutation, { ...testOfferTwo, userId: userData.userId }, userData.userId );
  
        const offerResponse = await graphqlTestCall(getOfferQuery, { condition: "NEW", minPrice: 10, maxPrice: 40 }, userData.userId );
        
        const expectedResponse = [{ ...testOfferTwo, userId: userData.userId }];
      
        expect(offerResponse.data.getOffer).toEqual(expectedResponse);
      });

});

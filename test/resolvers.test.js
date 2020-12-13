import { graphqlTestCall } from "./graphqlTestCall";
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

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

const loginMutation = `
  mutation login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
      }
  }
`;

describe("resolvers", () => {

  it("should create a user", async () => {
    const testUser = { firstName: "Mihran", lastName: "Guyumjyan", email: "mihran@gmail.com", password: "pass" };
    
    const registerResponse = await graphqlTestCall(createUserMutation, {
      email: testUser.email,
      password: testUser.password,
      lastName: testUser.lastName,
      firstName: testUser.firstName
    });
    
    const expectedUser = { firstName: "Mihran", lastName: "Guyumjyan", email: "mihran@gmail.com", userId: registerResponse.data.createUser.userId };

    expect(registerResponse.data.createUser).toEqual(expectedUser);
  });

  it("should not create a user without a firstName", async () => {
    const testUser = {lastName: "Guyumjyan", email: "mihran@gmail.com", password: "pass" };
    
    const registerResponse = await graphqlTestCall(createUserMutation, {
      email: testUser.email,
      password: testUser.password,
      lastName: testUser.lastName,
    });

    expect(Array.isArray(registerResponse.errors)).toBeTruthy();
    expect(registerResponse.errors).not.toHaveLength(0);
  });

  it("should login succesfully", async () => {
    const testUser = { firstName: "Mihran", lastName: "Guyumjyan", email: "mihran@gmail.com", password: "pass" };
    
    await graphqlTestCall(createUserMutation, {
      email: testUser.email,
      password: testUser.password,
      lastName: testUser.lastName,
      firstName: testUser.firstName
    });

    const loginResponse = await graphqlTestCall(loginMutation, {
      email: testUser.email,
      password: testUser.password,
    });
    
    expect.stringContaining(loginResponse.data.login.token)
  });

  it("should fail login without email", async () => {
    const testUser = { firstName: "Mihran", lastName: "Guyumjyan", email: "mihran@gmail.com", password: "pass" };
    
    await graphqlTestCall(createUserMutation, {
      email: testUser.email,
      password: testUser.password,
      lastName: testUser.lastName,
      firstName: testUser.firstName
    });

    const loginResponse = await graphqlTestCall(loginMutation, {
      password: testUser.password,
    });
    
    expect(Array.isArray(loginResponse.errors)).toBeTruthy();
    expect(loginResponse.errors).not.toHaveLength(0);
  });

});

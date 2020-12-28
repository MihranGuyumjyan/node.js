import { graphqlTestCall } from "./helper/graphqlTestCall";
import { User } from "../models/users";

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

const verificationMutation = `
  mutation verification($email: String!, verificationCode: Int!) {
    verification(email: $email, verificationCode: $verificationCode) {
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

const getUserQuery = `
  query getUser {
    getUser {
      firstName
      lastName
      email
      userId
    }
  }
`;

const addAgeQuery = `
  query addAge($setAge: Int!) {
    addAge(setAge: $setAge) {
      firstName
      lastName
      email
      userId
      age
    }
  }
`;

describe("mutations", () => {

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

  it("should fail verification with wrong email or verificationCode", async () => {
    const testUser = { firstName: "Mihran", lastName: "Guyumjyan", email: "mihran.guyumjyan@mail.ru", password: "pass" };
    
    await graphqlTestCall(createUserMutation, {
      email: testUser.email,
      password: testUser.password,
      lastName: testUser.lastName,
      firstName: testUser.firstName
    });

    const userData = await User.findOne({ email: testUser.email })

    const fakeVerificationInformation = { email: "zareh@gmail.com", secretNumber: 115475 }

    const wrongEmailResponse = await graphqlTestCall(verificationMutation, {
      email: fakeVerificationInformation.email,
      verificationCode: userData.secretNumber,
    });

    const wrongNumberResponse = await graphqlTestCall(verificationMutation, {
      email: testUser.email,
      verificationCode: fakeVerificationInformation.secretNumber,
    });

    expect(Array.isArray(wrongEmailResponse.errors)).toBeTruthy();
    expect(wrongEmailResponse.errors).not.toHaveLength(0);
    expect(Array.isArray(wrongNumberResponse.errors)).toBeTruthy();
    expect(wrongNumberResponse.errors).not.toHaveLength(0);
  });

  it("should login succesfully", async () => {
    const testUser = { firstName: "Mihran", lastName: "Guyumjyan", email: "mihran@gmail.com", password: "pass" };
    
    await graphqlTestCall(createUserMutation, {
      email: testUser.email,
      password: testUser.password,
      lastName: testUser.lastName,
      firstName: testUser.firstName
    });

    await User.findOneAndUpdate({ email: testUser.email }, {
      isVerified: true,
    });

    const loginResponse = await graphqlTestCall(loginMutation, {
      email: testUser.email,
      password: testUser.password,
    });
    
    expect.stringContaining(loginResponse.data.login.token)
  });

  it("should fail login with wrong email or password", async () => {
    const testUser = { firstName: "Mihran", lastName: "Guyumjyan", email: "mihran@gmail.com", password: "pass" };
    
    await graphqlTestCall(createUserMutation, {
      email: testUser.email,
      password: testUser.password,
      lastName: testUser.lastName,
      firstName: testUser.firstName
    });

    const fakeAccount = { email: "zareh@gmail.com", password: "wrong" }

    const wrongEmailResponse = await graphqlTestCall(loginMutation, {
      email: fakeAccount.email,
      password: testUser.password,
    });

    const wrongPassResponse = await graphqlTestCall(loginMutation, {
      email: testUser.email,
      password: fakeAccount.password,
    });

    expect(Array.isArray(wrongEmailResponse.errors)).toBeTruthy();
    expect(wrongEmailResponse.errors).not.toHaveLength(0);
    expect(Array.isArray(wrongPassResponse.errors)).toBeTruthy();
    expect(wrongPassResponse.errors).not.toHaveLength(0);
  });

});

describe("queries", () => {

  it("should get user information", async () => {
    const testUser = { firstName: "Mihran", lastName: "Guyumjyan", email: "mihran@gmail.com", password: "pass" };
      
    const userData = await graphqlTestCall(createUserMutation, {
      email: testUser.email,
      password: testUser.password,
      lastName: testUser.lastName,
      firstName: testUser.firstName
    });

    const userResponse = await graphqlTestCall(getUserQuery, {},  userData.data.createUser.userId );
    
    const expectedUser = { firstName: "Mihran", lastName: "Guyumjyan", email: "mihran@gmail.com", userId: userResponse.data.getUser.userId };
  
    expect(userResponse.data.getUser).toEqual(expectedUser);
  });

  it("should not get user information without userId", async () => {
    const testUser = { firstName: "Mihran", lastName: "Guyumjyan", email: "mihran@gmail.com", password: "pass" };
      
    await graphqlTestCall(createUserMutation, {
      email: testUser.email,
      password: testUser.password,
      lastName: testUser.lastName,
      firstName: testUser.firstName
    });

    const userResponse = await graphqlTestCall(getUserQuery, {} );

    expect(Array.isArray(userResponse.errors)).toBeTruthy();
    expect(userResponse.errors).not.toHaveLength(0);
  });

  it("should add age to users collection", async () => {

    const testUser = { firstName: "Mihran", lastName: "Guyumjyan", email: "mihran@gmail.com", password: "pass" };
      
    const userData = await graphqlTestCall(createUserMutation, {
      email: testUser.email,
      password: testUser.password,
      lastName: testUser.lastName,
      firstName: testUser.firstName
    });

    const addedAge = { setAge: 20 }; 

    await graphqlTestCall(addAgeQuery, addedAge, userData.data.createUser.userId );

    const expectedResponse = await User.findOne({ email: "mihran@gmail.com" })
  
    expect(expectedResponse.age).toEqual(addedAge.setAge);
  });

});

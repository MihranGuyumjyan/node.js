import { graphqlTestCall } from "./helper/graphqlTestCall";

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

describe("mutations", () => {

    it("should create product offer", async () => {
      const testUser = { firstName: "Mihran", lastName: "Guyumjyan", email: "mihran@gmail.com", password: "pass" };
      
      const userData = await graphqlTestCall(createUserMutation, {
        email: testUser.email,
        password: testUser.password,
        lastName: testUser.lastName,
        firstName: testUser.firstName
      });

      const testOffer = { title: "bmw", productType: "car", condition: "USED", price: { value: 50, currency: "USD" }}
      
      const offerResponse = await graphqlTestCall(createOfferMutation, testOffer, userData.data.createUser.userId );    
      
      expect(offerResponse.data.createOffer).toEqual({...testOffer, userId: userData.data.createUser.userId});
    });

    it("should not create product offer without a title", async () => {
        const testUser = { firstName: "Mihran", lastName: "Guyumjyan", email: "mihran@gmail.com", password: "pass" };
        
        const userData = await graphqlTestCall(createUserMutation, {
          email: testUser.email,
          password: testUser.password,
          lastName: testUser.lastName,
          firstName: testUser.firstName
        });
  
        const testOffer = { productType: "car", condition: "USED", price: { value: 50, currency: "USD" }}
        
        const offerResponse = await graphqlTestCall(createOfferMutation, testOffer, userData.data.createUser.userId );    
        
        expect(Array.isArray(offerResponse.errors)).toBeTruthy();
        expect(offerResponse.errors).not.toHaveLength(0);
      });

});


describe("queries", () => {

    it("should get products offers", async () => {
      const testUser = { firstName: "Mihran", lastName: "Guyumjyan", email: "mihran@gmail.com", password: "pass" };
      
      const userData = await graphqlTestCall(createUserMutation, {
        email: testUser.email,
        password: testUser.password,
        lastName: testUser.lastName,
        firstName: testUser.firstName
      });

      const testOfferOne = { title: "bmw", productType: "car", condition: "USED", price: { value: 50, currency: "USD" }}
      const testOfferTwo = { title: "mercedes", productType: "car", condition: "NEW", price: { value: 15, currency: "USD" }}
      
      await graphqlTestCall(createOfferMutation, testOfferOne, userData.data.createUser.userId );
      await graphqlTestCall(createOfferMutation, testOfferTwo, userData.data.createUser.userId );

      const offerResponse = await graphqlTestCall(getOfferQuery, {}, userData.data.createUser.userId );

      const expectedResponse = [{ ...testOfferOne, userId: userData.data.createUser.userId }, { ...testOfferTwo, userId: userData.data.createUser.userId }];
    
      expect(offerResponse.data.getOffer).toEqual(expectedResponse);
    });

    it("should get product offers with filters", async () => {
        const testUser = { firstName: "Mihran", lastName: "Guyumjyan", email: "mihran@gmail.com", password: "pass" };
        
        const userData = await graphqlTestCall(createUserMutation, {
          email: testUser.email,
          password: testUser.password,
          lastName: testUser.lastName,
          firstName: testUser.firstName
        });
  
        const testOfferOne = { title: "bmw", productType: "car", condition: "USED", price: { value: 50, currency: "USD" }}
        const testOfferTwo = { title: "mercedes", productType: "car", condition: "NEW", price: { value: 15, currency: "USD" }}
        
        await graphqlTestCall(createOfferMutation, testOfferOne, userData.data.createUser.userId );
        await graphqlTestCall(createOfferMutation, testOfferTwo, userData.data.createUser.userId );
  
        const offerResponse = await graphqlTestCall(getOfferQuery, { condition: "NEW", minPrice: 10, maxPrice: 40 }, userData.data.createUser.userId );
        
        const expectedResponse = [{ ...testOfferTwo, userId: userData.data.createUser.userId }];
      
        expect(offerResponse.data.getOffer).toEqual(expectedResponse);
      });

});

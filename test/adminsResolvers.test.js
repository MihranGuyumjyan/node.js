import { graphqlTestCall } from "./helper/graphqlTestCall";
import { Admin } from "../models/admins";
import { User } from "../models/users";

const adminLoginMutation = `
  mutation adminLogin($login: String!, $password: String!) {
      adminLogin(login: $login, password: $password) {
        token
      }
  }
`;

const getAllUsersQuery = `
  query getAllUsers {
    getAllUsers {
      firstName
      lastName
      email
      userId
      age
    }
  }
`;

describe("mutations", () => {
  it("admin should login succesfully", async () => {
    const testUser = { login: "admin1", password: "pass", adminId: 2 };

    await Admin.create(testUser);

    const loginResponse = await graphqlTestCall(adminLoginMutation, {
      login: testUser.login,
      password: testUser.password,
    });

    expect.stringContaining(loginResponse.data.adminLogin.token);
  });

  it("should fail login with wrong login or password", async () => {
    const testUser = { login: "admin1", password: "pass", adminId: 2 };

    await Admin.create(testUser);

    const fakeAccount = { login: "admin", password: "password" };

    const wrongLoginResponse = await graphqlTestCall(adminLoginMutation, {
      login: fakeAccount.login,
      password: testUser.password,
    });

    const wrongPassResponse = await graphqlTestCall(adminLoginMutation, {
      login: testUser.login,
      password: fakeAccount.password,
    });

    expect(Array.isArray(wrongLoginResponse.errors)).toBeTruthy();
    expect(wrongLoginResponse.errors).not.toHaveLength(0);
    expect(Array.isArray(wrongPassResponse.errors)).toBeTruthy();
    expect(wrongPassResponse.errors).not.toHaveLength(0);
  });
});

describe("queries", () => {
  it("should get all users information", async () => {
    const testUser1 = {
      firstName: "Mihran",
      lastName: "Guyumjyan",
      email: "mihran@gmail.com",
      password: "pass",
      userId: "22574sadasd2144d855",
      age: 28,
    };
    const testUser2 = {
      firstName: "Arsen",
      lastName: "Avagyan",
      email: "arsen@gmail.com",
      password: "pass",
      userId: "asdaw1442414785",
      age: 58,
    };
    await User.create(testUser1, testUser2);

    const testAdmin = { login: "admin1", password: "pass", adminId: 2 };

    const admin = await Admin.create(testAdmin);

    const userResponse = await graphqlTestCall(
      getAllUsersQuery,
      {},
      admin.adminId
    );

    delete testUser1.password;
    delete testUser2.password;

    expect(userResponse.data.getAllUsers).toEqual([testUser1, testUser2]);
  });

  it("should not get any information about users with primitive user", async () => {
    const testUser1 = {
      firstName: "Mihran",
      lastName: "Guyumjyan",
      email: "mihran@gmail.com",
      password: "pass",
      userId: "22574sadasd2144d855",
      age: 28,
    };
    const testUser2 = {
      firstName: "Arsen",
      lastName: "Avagyan",
      email: "arsen@gmail.com",
      password: "pass",
      userId: "asdaw1442414785",
      age: 58,
    };
    await User.create(testUser1, testUser2);

    const userResponse = await graphqlTestCall(
      getAllUsersQuery,
      {},
      testUser1.userId
    );

    expect(Array.isArray(userResponse.errors)).toBeTruthy();
    expect(userResponse.errors).not.toHaveLength(0);
  });
});

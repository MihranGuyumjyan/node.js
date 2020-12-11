import jwt from "jsonwebtoken";

export const generateToken = (id) => {
  return jwt.sign(
    {
      userId: id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "10h" }
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

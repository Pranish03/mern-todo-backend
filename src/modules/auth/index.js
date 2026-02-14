import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validate } from "../../middlewares/validate.js";
import { loginSchema, signupSchema } from "./schema.js";
import { User } from "./model.js";
import { authenticate } from "../../middlewares/authenticate.js";

const authRouter = Router();

/**
 * @DESC Signup to a new account
 * @API  POST auth/signup/
 */
authRouter.post("/signup", validate(signupSchema), async (req, res) => {
  try {
    const data = req.validated;

    const userExists = await User.findOne({ email: data.email });

    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hash = await bcrypt.hash(data.password, 10);

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: hash,
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      message: "Signed up successfully",
      data: {
        token,
        user: { ...user._doc, password: undefined },
      },
    });
  } catch (error) {
    console.log(`Error: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @DESC Login to an account
 * @API  POST auth/login/
 */
authRouter.post("/login", validate(loginSchema), async (req, res) => {
  try {
    const data = req.validated;

    const userExists = await User.findOne({ email: data.email });

    if (!userExists) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const matchPassword = await bcrypt.compare(
      data.password,
      userExists.password,
    );

    if (!matchPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: userExists._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      message: "Logged in successfully",
      data: {
        token,
        user: { ...userExists._doc, password: undefined },
      },
    });
  } catch (error) {
    console.log(`Error: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @DESC Check auth status
 * @API  GET auth/me
 */
authRouter.get("/me", authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User does not exist" });
    }

    return res.status(200).json({
      message: "You are logged in",
      data: { user },
    });
  } catch (error) {
    console.log(`Error: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export { authRouter };

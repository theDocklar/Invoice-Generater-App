import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

const userService = {
  // User Registration
  async registerUser(userData) {
    const { email, password, confirmPassword } = userData;

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    return {
      id: user._id,
      email: user.email,
      password: user.password,
    };
  },

  // User Login
  async loginUser(email, password) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Invalid email!!");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password!!");
    }

    return {
      id: user._id,
      email: user.email,
    };
  },

  // Get user by ID
  async getUserById(userId) {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      throw new Error("User not found!!");
    }

    return user;
  },

  // Update user details
  async updateUser(userId, newData) {},

  // Delete User
  async deleteUser(userId) {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return {
      id: user._id,
      email: user.email,
    };
  },
};

export default userService;

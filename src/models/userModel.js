import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

//env variables
const { DEFAULT_PIC, DEFAULT_STATUS } = process.env;

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name."],
    },
    email: {
      type: String,
      required: [true, "Please your email address."],
      unique: [true, "This email already exist"],
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email address."],
    },
    picture: {
      type: String,
      default: DEFAULT_PIC,
    },
    status: {
      type: String,
      default: DEFAULT_STATUS,
    },
    password: {
      type: String,
      required: [true, "Please provide your password"],
      minLength: [
        6,
        "Please make sure your password is atleast 6 characters long",
      ],
      maxLength: [
        128,
        "Please make sure your password is less than 128 characters long",
      ],
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  // arrow functions do not have their own this context.By using a regular function instead of an arrow function, this will refer to the current user document, and this.isNew will correctly check if the document is new or being updated.
  try {
    if (this.isNew) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const UserModel =
  mongoose.models.UserModel || mongoose.model("UserModel", userSchema);

export default UserModel;

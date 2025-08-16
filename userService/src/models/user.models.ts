import mongoose, { Document, Schema } from "mongoose";
import { compareValue, hashPassword } from "../utils/Bcrypt.util.js";

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  profilePicture?: string | null;
  role: string;
  playlist: string[];
  comparePassword: (password: string) => Promise<boolean>;
  ommitPassword: () => Omit<UserDocument, "password">;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      required: true,
    },
    playlist: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    if (this.password) {
      this.password = await hashPassword(this.password);
    }
  }
  next();
});

UserSchema.methods.ommitPassword = function (): Omit<UserDocument, "password"> {
  const user = this.toObject();
  delete user.password;
  return user;
};

UserSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return compareValue(password, this.password);
};

export const UserModel = mongoose.model<UserDocument>("User", UserSchema);

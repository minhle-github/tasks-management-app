import mongoose, { Schema, Model } from "mongoose";
import bcrypt from 'bcrypt';

interface IUser {
  firstname: string,
  lastname: string,
  readonly username: string,
  password: string,
  email: string,
  refreshTokens?: string[],
  roles: {
    User: number,
    Editor?: number,
    Admin?: number
  },
  createdAt: number
}

interface IUserMethods {
  fullName(): string;
  comparePassword(inputPassword: string): Promise<boolean>;
}

interface UserModel extends Model<IUser, {}, IUserMethods> {}

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    refreshTokens: [String],
    roles: {
      User: {
        type: Number,
        default: 2001
      },
      Editor: Number,
      Admin: Number
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

userSchema.pre(
  'save',
  async function (next) {
    if (!this.isModified("password")) return next();

    const hash = await bcrypt.hashSync(this.password, 10);

    this.password = hash;
    return next();
  }
)

userSchema.pre(
  'save',
  function (next) {
    if (!this.isModified("username") || this.isNew) return next();
    
    throw Error("Username can't not be modified!");
  }
)

userSchema.method('fullName', function fullName() {
  return this.firstName + ' ' + this.lasName
});

userSchema.method(
  'comparePassword', 
  async function (inputPassword: string): Promise<boolean> {
    const match = await bcrypt.compare(inputPassword, this.password);
    return match;
  }
);

export default mongoose.model<IUser, UserModel>('User', userSchema);
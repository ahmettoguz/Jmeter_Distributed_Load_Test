import mongoose, {
    Types, Schema, Document, Model, model,
} from 'mongoose';

interface IUser extends Document {
    userName: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
    profilePicture: Number;
    profileBanner: Number;
    accountStatus: 'active' | 'inactive' | 'deactivated' | 'banned';
    role: 'user' | 'admin';
    tier: { type: Types.ObjectId; ref: 'Tier'; required: true };
}

mongoose.pluralize(null);
const userSchema = new Schema<IUser>(
    {
        userName: { type: String, lowercase: true, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, lowercase: true, required: true },
        password: { type: String, required: true },
        profilePicture: { type: Number, default: 0 },
        profileBanner: { type: Number, default: 0 },
        accountStatus: {
            type: String,
            enum: ['active', 'inactive', 'deactivated', 'banned'],
            default: 'active',
        },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        tier: { type: Types.ObjectId, ref: 'Tier', required: true },
    },
    { versionKey: false, timestamps: true },
);

const User: Model<IUser> = model<IUser>('User', userSchema);

export default User;

import {
    Types, Schema, Document, Model, model,
} from 'mongoose';

interface IUser extends Document {
    username: string;
    fName: string;
    lName: string;
    phone: string;
    email: string;
    password: string;
    accountStatus: 'active' | 'inactive' | 'deactivated' | 'banned';
    role: 'user' | 'admin';
    tier: { type: Types.ObjectId, ref: 'Tier', required: true },
    completedTest: number;
}

const userSchema = new Schema<IUser>(
    {
        username: { type: String, lowercase: true, required: true },
        fName: { type: String, required: true },
        lName: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, lowercase: true, required: true },
        password: { type: String, required: true },
        accountStatus: { type: String, enum: ['active', 'inactive', 'deactivated', 'banned'], default: 'inactive' },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        tier: { type: Types.ObjectId, ref: 'Tier', required: true },
        completedTest: { type: Number, default: 0 },
    },
    { versionKey: false, timestamps: true },
);

const User: Model<IUser> = model<IUser>('User', userSchema);

export default User;

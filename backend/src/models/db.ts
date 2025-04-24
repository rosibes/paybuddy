const mongoose = require("mongoose")

mongoose.connect(process.env.MONGO_URI as string)

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

// Create a Schema for Users
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
})

const accountSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "UserModel",
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
})

// Create a model from the schema
const UserModel = mongoose.model("users", userSchema);
const AccountModel = mongoose.model("accounts", accountSchema)

export { UserModel, AccountModel }

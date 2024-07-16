import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "The name is required"]
    },
    email: {
        type: String,
        required: [true, "The email is required"],
        unique: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email address"
        ]
    },
    password: {
        type: String,
        required: [true, "The password is required"],
        minlength: [6, "The password must be greater than 6 characters"],
        maxLength: [200, "The password must be at least 200 characters" ],
    },
    photo: {
        type: String,
        //required: [true, "The pecture is required"],
        default: "https://placehold.co/300",
    },
    phone: {
        type: String,
        default: "+33-"
    },
    bio: {
        type: String,
        maxlength: [1000, "The bio must be at most 1000 characters"],
        default: "bio"
    }
}, {
    timestamps: true,
});


// hash password before saving to db
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        return next()
    }
    const hashPassword = await bcrypt.hash(this.password, 10)
    this.password = hashPassword
})

const User = mongoose.model("User", userSchema)

export default User;
const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Can not be blank']
    },
    email: {
        type: String,
        lowercase: true,
        index: true,
        unique: true,
        validate: [isEmail, 'Invalid Email'],
        required: [true, 'Can not be blank']
    },
    password: {
        type: String,
        required: [true, 'Can not be blank']
    },
    picture: {
        type: String,
    },
    newMessages: {
        type: Object,
        default: {}
    },
    status: {
        type: String,
        default: 'offline'
    },
    points: {
        type: Number,
        default: 0
    },
    referralCode: {
        type: String
    },
    referralFromCode: {
        type: String,
        default: ''
    },

}, { minimize: false })


UserSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    })
})


UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
}


UserSchema.statics.findbyCredentials = async function (email, password) {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid email or password');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }
    return user;
}

//Static signup method
UserSchema.statics.signup = async function (name, email, password, picture, referralCode, referralFromCode) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("User already exists");
    }
    const user = await User.create({ name, email, password, picture, referralCode, referralFromCode });
    return user;
}

const User = mongoose.model('User', UserSchema);

module.exports = User
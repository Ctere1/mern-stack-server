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
        default: 'online'
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


UserSchema.statics.getAll = async function () {
    const users = await User.find();
    return users;
}

const User = mongoose.model('User', UserSchema);

module.exports = User
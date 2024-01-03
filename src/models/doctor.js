const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const DocSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    profession: {
        type: String,
        required: true,        
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true
    },
});

DocSchema.statics.findByCredentials = async function (email, password) {
    const user = await this.findOne({ email });

    if (!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Unable to login');
    }

    return user;
};

// Hash password before saving
DocSchema.pre('save', async function (next) {
    const doc = this;

    if (doc.isModified('password')) {
        doc.password = await bcrypt.hash(doc.password, 8);
    }

    next();
});

const Doc = mongoose.model('Doc', DocSchema);

module.exports = Doc;

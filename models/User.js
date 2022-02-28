const { Schema, model } = require('mongoose')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        minLength: 5,
        maxLength: 30,
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide valid email'
        ],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minLength: 6,
    }
})

// Pre Middlewares
UserSchema.pre('save', async function(next) {
    const salt = await bcryptjs.genSalt(10)
    this.password = await bcryptjs.hash(this.password, salt) // hashedPassword
    next()
})

// Instance methods
UserSchema.methods.generateToken = function(cb) {
    const token = jwt.sign({ userId: this._id, name: this.name }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_LIFETIME })
    return token
}

UserSchema.methods.comparePassword = async function(candidatePassword) {
    const isMatch = await bcryptjs.compare(candidatePassword, this.password)
    return isMatch
}

module.exports = model('User', UserSchema)
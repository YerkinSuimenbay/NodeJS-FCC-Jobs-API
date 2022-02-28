const { Schema, model, Types } = require('mongoose')

const JobSchema = new Schema({
    company: {
        type: String,
        required: [true, 'Please provide company name'],
        maxlength: 50,
        minlength: 3,
    },
    position: {
        type: String,
        required: [true, 'Please provide position'],
        maxlength: 100,
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'interview', 'declined'],
            message: '{VALUE} is not supported'   
        },
        default: 'pending',
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user id'],
    }
}, { timestamps: true })

module.exports = model('Job', JobSchema)
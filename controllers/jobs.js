const Job = require("../models/Job")
const { StatusCodes } = require('http-status-codes')
const { NotFoundError, BadRequestError } = require("../errors")


const getAllJobs = async (req, res) => {
    const createdBy = req.user.userId
    const jobs = await Job.find({ createdBy })
    res.status(StatusCodes.OK).json({ nbHits: jobs.length, jobs })
}

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({ job })
}

const getJob = async (req, res) => {
    const { user, params: { id: jobId }} = req

    const job = await Job.findOne({ _id: jobId, createdBy: user.userId })

    if (!job) throw new NotFoundError(`Job with id ${id} for user ${user.name} could not be found`)
    res.status(StatusCodes.OK).json({ job })
}

const updateJob = async (req, res) => {
    const { 
        body: { company, position }, 
        user: { userId }, 
        params: { id: jobId } 
    } = req

    if (!company || !position) throw new BadRequestError('Please provide both company and position fields')

    const job = await Job.findOneAndUpdate({ _id: jobId, createdBy: userId }, req.body, { new: true, runValidators: true })

    if (!job) throw new NotFoundError(`No job with ${jobId}`)

    res.status(StatusCodes.OK).json({ job })
}


const deleteJob = async (req, res) => {
    const { user: { userId }, params: { id: jobId } } = req
    const job = await Job.findOneAndDelete({ _id: jobId, createdBy: userId })
    console.log(job);

    if (!job) throw new BadRequestError(`No job with id ${jobId} was found`)
    res.status(StatusCodes.OK).json({ status: "ok", job })
}

module.exports = {
    getAllJobs,
    createJob,
    getJob,
    updateJob,
    deleteJob,
}
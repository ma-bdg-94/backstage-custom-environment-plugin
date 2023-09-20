/* eslint-disable  no-explicit-any */
const { connect } = require('mongoose')

const connectDB = async () => {
  try {
    await connect(process.env.MONGO_URI)
    console.info('Successfully connected to database!')
  } catch (er) {
    console.log(er.message)
    process.exit(1);
  }
}

module.exports = { connectDB }
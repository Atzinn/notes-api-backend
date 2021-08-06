const mongoose = require('mongoose')
const { MONGODB_URI, MONGODB_URI_TEST, NODE_ENV } = process.env

const connectionString = NODE_ENV === 'test' ? MONGODB_URI_TEST : MONGODB_URI

const connectionOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}

mongoose
  .connect(connectionString, connectionOptions)
  .then(() => console.log('DB is connected'))
  .catch((err) => console.log(err))

process.on('uncaughtException', () => mongoose.connection.close())

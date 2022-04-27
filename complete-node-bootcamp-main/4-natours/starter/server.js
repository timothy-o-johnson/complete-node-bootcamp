const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

// place this at the time so it can listen for the error throughout the application
process.on('uncaughtException', err => {
  console.log('')
  console.log('!!!  uncaughtException  !!! ')
  console.log('')

  console.log(err.name, err.message)

  console.log('Shutting down now...')

  process.exit(1)
})

const app = require('./app')

// console.log(process.env);
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
)

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(con => {
    // console.log(con.connections)
    console.log('DB connection successful')
  })

const port = process.env.PORT || 3000
const setUpListener = () => {
  console.log(`App is running on port ${port}...`)
}

const server = app.listen(port, setUpListener)

process.on('unhandledRejection', err => {
  console.log('')
  console.log('!!!   unhandledRejection  !!! ')
  console.log('')

  console.log(err.name, err.message)

  console.log('Shutting down now...')
  server.close(() => {
    process.exit(1)
  })
})


const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const app = require('./app')

// console.log(process.env);
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
)

mongoose.connect(DB, {
  usedNewUrlParse: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(con =>{
  // console.log(con.connections)
  console.log('DB connection successful')
})

const port = process.env.PORT || 3000
const setUpListener = () => {
  console.log(`App is running on port ${port}...`)
}
app.listen(port, setUpListener)

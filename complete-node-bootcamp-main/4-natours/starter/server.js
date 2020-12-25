const dotenv = require('dotenv')
dotenv.config({path: './config.env'})

const app = require('./app')

// console.log(process.env);

const port = process.env.PORT || 3000
const setUpListener = () => {
  console.log(`App is running on port ${port}...`)
}
app.listen(port, setUpListener)

const app = require('./app')

const port = 3000
const setUpListener = () => {
  console.log(`App is running on port ${port}...`)
}
app.listen(port, setUpListener)

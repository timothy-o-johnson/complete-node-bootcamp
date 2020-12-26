const errorMessage = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined!'
  })
}

exports.createUser = (req, res) => {
  errorMessage(req, res)
}

exports.deleteUser = (req, res) => {
  errorMessage(req, res)
}

exports.getAllUsers = (req, res) => {
  errorMessage(req, res)
}

exports.getUser = (req, res) => {
  errorMessage(req, res)
}

exports.updateUser = (req, res) => {
  errorMessage(req, res)
}

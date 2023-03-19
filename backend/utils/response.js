const statusRes = (sendMessage, statusCode, res, trueFalse) => {
  return res
    .status(statusCode)
    .json({ success: trueFalse, message: sendMessage })
}

module.exports = statusRes

function truncateNum(number, type) {
  if (type === 'integer') {
    if (number >= 1000) return (Math.round(number / 100) / 10).toString() + "k"
    return number
  }
  if (type === 'double') {
    if (number >= 100) return Math.toFixed(0)
    if (number >= 10) return number.toFixed(1)
    return number.toFixed(2)
  }
}

module.exports = truncateNum
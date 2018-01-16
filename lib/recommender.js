const percentile = require('percentile')
const BN = require('ethjs').BN
const GWEI_BN = new BN('1000000000')

module.exports = function (recentBlocks) {
  // Return 1 gwei if no blocks have been observed:
  if (recentBlocks.length === 0) {
    return '0x' + GWEI_BN.toString(16)
  }

  const lowestPrices = recentBlocks.map((block) => {
    if (!block.transactions || block.transactions.length < 1) {
      return GWEI_BN
    }
    return block.transactions
    .map(tx => tx.gasPrice)
    .map(hexPrefix => hexPrefix.substr(2))
    .map(hex => new BN(hex, 16))
    .sort((a, b) => {
      return a.gt(b) ? 1 : -1
    })[0]
  })
  .map(number => number.div(GWEI_BN).toNumber())

  const percentileNum = percentile(50, lowestPrices)
  const percentileNumBn = new BN(percentileNum)
  return percentileNumBn.mul(GWEI_BN).toString(16)
}

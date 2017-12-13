const Component = require('react').Component
const h = require('react-hyperscript')
const inherits = require('util').inherits
const Eth = require('ethjs')
const BN = Eth.BN
const gwei = new BN('1000000000', 10)

module.exports = ScatterPlot
const {ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend} = require('recharts');

inherits(ScatterPlot, Component)
function ScatterPlot () {
  Component.call(this)
}

ScatterPlot.prototype.render = function () {
  const props = this.props
  const { recentBlocks } = props
  const txs = []

  recentBlocks.forEach((block) => {
    const hexNum = block.number
    const blockNumber = new BN(hexNum.substr(2), 16)
    block.transactions.forEach((tx) => {
      const hexGasPrice = tx.gasPrice.substr(2)
      const gasPrice = new BN(hexGasPrice, 16)

      txs.push({
        blockNumber: parseInt(blockNumber.toString(10)),
        gasPrice: parseInt(gasPrice.div(gwei).toString(10)),
      })
    })
  })

  if (txs.length === 0) {
    return h('div', 'Loading...')
  }

  const sorted = txs.sort((a, b) => {
    return a.gasPrice - b.gasPrice
  })

  const topQuartile = sorted[Math.floor(sorted.length * 99/100 )]
  const topPrice = topQuartile.gasPrice

  const latestBlockNum = sorted[sorted.length - 1].blockNumber

  const filtered = sorted.filter((tx) => {
    return tx.gasPrice <= topPrice
  })

  const blockArr = filtered.map(tx => tx.blockNumber)
  const minBlock = Math.min.apply(null, blockArr)
  const maxBlock = Math.max.apply(null, blockArr)
  const range = [minBlock, maxBlock]

  return h(ScatterChart, {
    width: 400,
    height: 400,
    margin: {
      top: 20, right: 20, bottom: 20, left: 20,
    },
  }, [
    h(XAxis, {
      dataKey: 'blockNumber',
      type: 'number',
      name: 'Block',
      unit: ' block',
      domain: range,
    }),
    h(YAxis, {
      dataKey: 'gasPrice',
      type: 'number',
      name: 'Gas Price',
      unit: ' gwei'
    }),
    h(CartesianGrid),
    h(Scatter, {
      name: 'Recent Transaction Costs',
      data: filtered,
      fill: '#8884d8',
      stackOffset: 'expand',
    }),
    h(Tooltip, {
      cursor: {
        strokeDasharray: '20 20',
      },
    })
  ])
}

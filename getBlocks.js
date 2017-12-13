const Eth = require('ethjs')
const eth = new Eth(new Eth.HttpProvider('https://mainnet.infura.io'))
const fs = require('fs')

getRecentBlocks()
.then((blocks) => {
  fs.writeFileSync(__dirname + '/sample-blocks.json', JSON.stringify(blocks))
})

async function getRecentBlocks() {
  const latest = await eth.getBlockByNumber('latest', true)
  const blocks = [ latest ]

  for (var i = 0; i < 20; i++) {
    try {
      const lastBlock = blocks[ blocks.length - 1 ]
      console.log(lastBlock.number)
      console.dir(lastBlock)
      const block = await eth.getBlockByNumber(lastBlock.number.subn(1), true)
      blocks.push(block)
    } catch (e) {
      console.log('skipping block ' + i)
    }
  }

  return blocks
}


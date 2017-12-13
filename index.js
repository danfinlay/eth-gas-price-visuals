const render = require('react-dom').render
const h = require('react-hyperscript')
const configureStore = require('./lib/store')
const Root = require('./app/root.js')
const Eth = require('ethjs')
const BN = Eth.BN
const metamask = require('metamascara')
const BlockTracker = require('eth-block-tracker')
let eth, blockTracker;


var body = document.querySelector('body')
const container = document.createElement('div')
body.appendChild(container)

let web3Found = false
window.addEventListener('load', function() {

  const provider = metamask.createDefaultProvider({})
  eth = new Eth(provider)
  blockTracker = new BlockTracker({
    provider,
  })
  blockTracker.start()
  blockTracker.on('block', (block) => {
    store.dispatch({ type: 'NEW_BLOCK', value: block })
  })
  trackOldBlocks()

  window.eth = eth
  store.dispatch({ type: 'ETH_LOADED', value: eth })
  store.dispatch({ type: 'WEB3_FOUND', value: true })

  // Now you can start your app & access web3 freely:
  startApp()
})

async function trackOldBlocks () {
  blockTracker.once('block', async (block) => {
    const blockNum = block.number
    for (var i = 0; i < 20; i++) {
      try {
        const blockNumBn = new BN(blockNum.substr(2), 16)
        const newNum = blockNumBn.subn(i).toString(10)
        const newBlock = await eth.getBlockByNumber(newNum, true)
        newBlock.number = '0x' + newBlock.number.toString(16)
        newBlock.transactions = newBlock.transactions.map((tx) => {
          tx.gasPrice = '0x' + tx.gasPrice.toString(16)
          return tx
        })
        if (newBlock) {
          store.dispatch({ type: 'PREVIOUS_BLOCK', value: newBlock })
        }
      } catch (e) {
        console.log('skipping block ' + i)
      }
    }
  })
}

const store = configureStore({
  nonce: 0,
  web3Found: false,
  loading: true,
  recentBlocks: [],
})

store.subscribe(() => {
  startApp()
})

function startApp(){
  render(
    h(Root, {
      store,
      className: 'root-el',
    }),
  container)
}

// Check for account changes:
setInterval(async function () {
  const accounts = await eth.accounts()
  const account = accounts[0]
  store.dispatch({
    type: 'ACCOUNT_CHANGED',
    value: account,
  })
}, 1000)


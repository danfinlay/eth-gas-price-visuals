const inherits = require('util').inherits
const Component = require('react').Component
const h = require('react-hyperscript')
const connect = require('react-redux').connect
const Eth = require('ethjs');
const BarChart = require('./components/scatter-plot')
const Provider = require('react-redux').Provider
const extend = require('xtend')

const MetaMaskLink = require('./components/download-metamask')

module.exports = connect(mapStateToProps)(Home)

function mapStateToProps (state) {
  return extend(state, {
    recentBlocks: state.recentBlocks.map((oldBlock) => {
      return {
        number: oldBlock.number,
        transactions: oldBlock.transactions.map((tx) => {
          return {
            gasPrice: tx.gasPrice,
          }
        })
      }
    })
  })
}

inherits(Home, Component)
function Home () {
  Component.call(this)
}

Home.prototype.render = function () {
  const props = this.props
  const { eth, loading, nonce, error, web3Found, recentBlocks, store } = props

  return (
    h('.content', {
      style: {
        color: 'grey',
        padding: '15px',
      },
    }, [

      h('h1', `Gas Price Visualizer`),

      h('h3', [
        'A quick way to start building Web Dapps on ',
        h('a', {
          href: 'https://ethereum.org/'
        }, 'Ethereum'),
      ]),

      !web3Found ?

        h('div', [
          h('You should get MetaMask for the full experience!'),

          h(MetaMaskLink, { style: { width: '250px' } }),
        ])
          : loading ? h('span', 'Loading...') : h('div', [
            h(BarChart, { recentBlocks }),
            h('br'),
            h('button', {
              onClick: () => this.sendTip(),
            }, 'Tip the developer with Ethereum'),
          ]),

        h('br'),
      nonce > 0 ? h('h2', `Thanks for your generous ${nonce} tip!`) : null,
      h('br'),
      error ? h('span', { style: { color: '#212121' } }, error) : null,

      h('a', {
        href: 'https://github.com/danfinlay/eth-gas-price-visuals',
        },
      'Fork me on GitHub to play with MetaMask.'),
    ])
  )
}

Home.prototype.sendTip = async function () {
  const { eth, account } = this.props

  this.props.dispatch({ type: 'SHOW_LOADING' })
  eth.sendTransaction({
    from: account,
    value: Eth.toWei('0.01', 'ether'),
    // Dan!
    to: '0x55e2780588aa5000F464f700D2676fD0a22Ee160',
    data: null,
  })
  .then((result) => {
    this.props.dispatch({ type: 'HIDE_LOADING' })
    this.props.dispatch({
      type: 'INCREMENT_NONCE',
    })
  })
  .catch((reason) => {
    this.props.dispatch({ type: 'HIDE_LOADING' })
    this.props.dispatch({
      type: 'SHOW_ERROR',
      value: 'There was a problem!  Maybe you refused the payment?',
    })
  })

}

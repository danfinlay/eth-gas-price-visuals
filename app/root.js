const inherits = require('util').inherits
const Component = require('react').Component
const h = require('react-hyperscript')
const connect = require('react-redux').connect
const Eth = require('ethjs');
const Provider = require('react-redux').Provider
const Home = require('./home')

const MetaMaskLink = require('./components/download-metamask')

module.exports = AppRoot

inherits(AppRoot, Component)
function AppRoot () {
  Component.call(this)
}

AppRoot.prototype.render = function () {
  console.log('rendering root')
  const props = this.props
  const { eth, loading, nonce, error, web3Found, recentBlocks, store } = props

  return (
    h(Provider, {
      store,
      recentBlocks,
    }, h(Home, { eth, loading, nonce, error, web3Found, recentBlocks, store }
  )))
}


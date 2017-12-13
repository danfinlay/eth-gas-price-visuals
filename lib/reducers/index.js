const extend = require('xtend')
let blocks

module.exports = function(state, action) {

  switch (action.type) {

    case 'ACCOUNT_CHANGED':
      return extend(state, {
        account: action.value,
      })

    case 'SHOW_ERROR':
      return extend(state, {
        error: action.value,
      })

    case 'SHOW_LOADING':
      return extend(state, {
        loading: true,
      })

    case 'HIDE_LOADING':
      return extend(state, {
        loading: false,
      })

    case 'ETH_LOADED':
      return extend(state, {
        eth: action.value,
        loading: false,
      })

    case 'WEB3_FOUND':
      return extend(state, {
        web3Found: action.value,
      })

    case 'INCREMENT_NONCE':
      return extend(state, {
        nonce: state.nonce + 1,
      })
      break

    case 'NEW_BLOCK':
      blocks = state.recentBlocks
      while (blocks.length >= 20) {
        blocks.shift()
      }
      blocks.push(action.value)
      return extend(state, {
        recentBlocks: blocks,
      })

    case 'PREVIOUS_BLOCK':
      blocks = state.recentBlocks
      if (blocks.length >= 20) {
        return extend(state)
      }
      blocks.unshift(action.value)
      return extend(state, {
        recentBlocks: blocks,
      })

  }


  return extend(state)
}

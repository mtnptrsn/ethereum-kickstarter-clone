import Web3 from 'web3'

const getWeb3 = () => {
  if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    // on client
    return new Web3(window.web3.currentProvider)
  } else {
    console.log('Node url: ', process.env.NODE_URL)

    // on server
    const provider = new Web3.providers.HttpProvider(
      'https://rinkeby.infura.io/dHhXumxOBXSbcoG9GUav'
    )

    return new Web3(provider)
  }
}

const web3 = getWeb3()

export default web3
require('dotenv').config()

const HDWalletProvider = require('truffle-hdwallet-provider')
const Web3 = require('web3')
const compiledFactory = require('./build/CompaignFactory.json')

const provider = new HDWalletProvider(
  process.env.MNEMONIC,
  process.env.NODE_URL
)

const web3 = new Web3(provider)

const deploy = async () => {
  const accounts = await web3.eth.getAccounts()

  const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({
      from: accounts[0],
      gas: 1000000,
    })

  console.log(`Contract address: ${result.options.address}`)
}

deploy()
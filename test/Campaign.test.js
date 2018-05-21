const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())

const compiledFactory = require('../ethereum/build/CompaignFactory.json')
const compiledCampaign = require('../ethereum/build/Campaign.json')

let accounts;
let factory;
let campaignAddress;
let campaign;

/**
 * Mocha before each. Will happen before each it callback
 */
beforeEach(async () => {
  /**
   * Fetch all accounts
   */
  accounts = await web3.eth.getAccounts()


  /**
   * Deploy the factory
   */
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode, })
    .send({ from: accounts[0], gas: '1000000' })

  /**
   * Deplot the Campaign via the factory contract.
   */
  await factory.methods.createCampaign('100').send({
    from: accounts[0],
    gas: '1000000'
  });


  /**
   * We dont get the campagin address from the createCampaign method, therefore we
   * have to fetch the deployedContracts. Since we only have deployed one contract
   * so far we can just use the first contract.
   */
  [campaignAddress] = await factory.methods.getDeployedCampaigns().call()


  /**
   * Create the campaign model (using the interface and the address)
   */
  campaign = new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  )
})


/**
 * Let the testing begin!
 */
describe('Campaigns', () => {
  it('deploys a factory and a campaign', () => {
    assert.ok(factory.options.address)
    assert.ok(campaign.options.address)
  })
})
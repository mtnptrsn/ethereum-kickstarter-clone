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

  it('marks the caller as the manager', async () => {
    const manager = await campaign.methods.manager().call()

    assert.equal(accounts[0], manager)
  })

  it('allows people to contribute and marks them as a contributor', async () => {
    await campaign.methods.contribute().send({
      from: accounts[1] ,
      value: '1000'
    })

    const isContributor = await campaign.methods.approvers(accounts[1]).call()

    assert(isContributor)
  })

  it('requires a minium contribution', async () => {
    try {
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: '1'
      })
      assert(false)
    } catch (error) {
      assert(error)
    }
  })

  it('allows a manager to make a payment request', async () => {
    const description = 'My only request'

    await campaign.methods.createRequest(
      description,
      '100',
      accounts[1]
    ).send({
      from: accounts[0],
      gas: '1000000'
    })

    const firstRequest = await campaign.methods.requests(0).call()

    assert.equal(description, firstRequest.description)
  })

  it('processes a request', async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: web3.utils.toWei('10', 'ether')
    })

    await campaign.methods.createRequest(
      'My description',
      web3.utils.toWei('10', 'ether'),
      accounts[2]
    ).send({
      from: accounts[0],
      gas: '1000000'
    })

    await campaign.methods.approveRequest(0).send({
      from: accounts[1],
      gas: '1000000'
    })

    const recipientsBalanceBeforeFinalizingRequest =
      await web3.eth.getBalance(accounts[2])

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: '1000000'
    })

    const recipientsBalanceAfterFinalizingRequest =
      await web3.eth.getBalance(accounts[2])

    const request = await campaign.methods.requests(0).call()

    assert(request.complete)
    assert(recipientsBalanceBeforeFinalizingRequest < recipientsBalanceAfterFinalizingRequest)
  })
})
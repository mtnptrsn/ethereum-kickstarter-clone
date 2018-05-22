import web3 from './web3'
import CampaignFactory from './build/CompaignFactory.json'

const campaignFactory = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0x65461594Df73Ad24Bc329A8717Ec73e0eFf17e67'
)

export default campaignFactory
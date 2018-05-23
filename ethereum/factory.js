import web3 from './web3'
import CampaignFactory from './build/CompaignFactory.json'

const campaignFactory = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0x07f7770336cF3384630d8130efe643bb151881aC'
)

export default campaignFactory
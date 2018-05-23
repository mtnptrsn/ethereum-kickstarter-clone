import React from 'react';
import factory from '../ethereum/factory'
import { Card, Button } from 'semantic-ui-react'
import Layout from '../components/Layout'
import { Link } from '../routes'

class IndexPage extends React.Component {
  static async getInitialProps({ req }) {
    const campaigns = await factory.methods.getDeployedCampaigns().call()

    return {
      campaigns
    }
  }

  state = {
    campaigns: []
  }

  renderCampaigns = () => {
    const items = this.props.campaigns.map(address => ({
      header: address,
      description: <Link route={`/campaigns/${address}`}><a>View campaign</a></Link>,
      fluid: true
    }))

    return <Card.Group items={items} />
  }

  render() {
    return (
      <Layout>
        <h3>Open campaigns</h3>
        <Link route="/campaigns/new">
          <a>
            <Button
              content="Create campaign"
              icon="add circle"
              primary
              floated="right"
            />
          </a>
        </Link>
        { this.renderCampaigns() }
      </Layout>
    )
  }
}

export default IndexPage
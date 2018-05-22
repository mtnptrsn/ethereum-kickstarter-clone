import React from 'react';
import factory from '../ethereum/factory'
import { Card, Button } from 'semantic-ui-react'
import Layout from '../components/Layout'

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
    const items = this.props.campaigns.map(c => ({
      header: c,
      description: <a>View campaign</a>,
      fluid: true
    }))

    return <Card.Group items={items} />
  }

  render() {
    return (
      <Layout>
        <h3>Open campaigns</h3>
        <Button
          content="Create campaign"
          icon="add circle"
          primary
          floated="right"
        />
        { this.renderCampaigns() }
      </Layout>
    )
  }
}

export default IndexPage
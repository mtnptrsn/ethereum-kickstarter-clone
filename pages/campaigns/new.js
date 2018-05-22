import React from 'react';
import Layout from '../../components/Layout'
import { Form, Button, Input, Message } from 'semantic-ui-react'
import factory from '../../ethereum/factory'
import web3 from '../../ethereum/web3'

class CampaignNew extends React.Component {
  state = {
    minimumContribution: '',
    errorMsg: '',
    isLoading: false
  }

  onSubmit = async (e) => {
    e.preventDefault()

    const accounts = await web3.eth.getAccounts()

    try {
      this.setState({ isLoading: true, errorMsg: '' })

      await factory.methods
        .createCampaign(this.state.minimumContribution)
        .send({
          from: accounts[0]
        })

    } catch (error) {
      this.setState({ errorMsg: error.message })
    }

    this.setState({ isLoading: false })
  }

  render() {
    return (
      <Layout>
        <h1>Create a campaign</h1>

        <Form onSubmit={this.onSubmit} error={this.state.errorMsg}>
          <Form.Field>
            <label>Miniumum Contribution</label>
            <Input
              label="wei"
              labelPosition="right"
              type="string"
              value={this.state.minimumContribution}
              onChange={e => this.setState({ minimumContribution: e.target.value })}
            /> 
          </Form.Field>

          <Message
            error
            header="Oops!"
            content={this.state.errorMsg}
          />

          <Button loading={this.state.isLoading} content="Create" primary />
        </Form>
      </Layout>
    )
  }
}

export default CampaignNew
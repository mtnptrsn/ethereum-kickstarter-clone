import React from 'react'
import { Form, Input, Message, Button } from 'semantic-ui-react'
import { Router } from '../routes'

import Campaign from '../ethereum/campaign'
import web3 from '../ethereum/web3'

class ContributeFrom extends React.Component {
  state = {
    value: ''
  }

  onSubmit = async e => {
    e.preventDefault()
    const campaign = Campaign(this.props.address)

    try {
      const accounts = await web3.eth.getAccounts()

      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, 'ether')
      })

      Router.replaceRoute(`/campaigns/${this.props.address}`)
    } catch (error) {}
  }

  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <Form.Field>
          <label>Amount to contribute</label>
          <Input
            value={this.state.value}
            onChange={e => this.setState({ value: e.target.value })}
            label="ether"
            labelPosition="right"
          />
        </Form.Field>
        <Button primary>Contribute</Button>
      </Form>
    )
  }
}

export default ContributeFrom
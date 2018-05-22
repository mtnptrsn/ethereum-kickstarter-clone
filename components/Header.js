import React from 'react'
import { Menu } from 'semantic-ui-react'

export default () => (
  <Menu style={{ marginTop: '12px' }}>
    <Menu.Item>
      Kickstarter clone
    </Menu.Item>


    <Menu.Menu position="right">
      <Menu.Item>
        Campaigns
      </Menu.Item>
      <Menu.Item>
        +
      </Menu.Item>
    </Menu.Menu>
  </Menu>
)
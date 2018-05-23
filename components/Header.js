import React from 'react'
import { Menu } from 'semantic-ui-react'
import { Link } from '../routes'

export default () => (
  <Menu style={{ marginTop: '12px' }}>
    <Link route="/">
      <a className="item">Kickstarter clone</a>
    </Link>


    <Menu.Menu position="right">
      <Link route="/">
        <a className="item">Campaigns</a>
      </Link>
      <Link route="/campaigns/new">
        <a className="item">+</a>
      </Link>
    </Menu.Menu>
  </Menu>
)
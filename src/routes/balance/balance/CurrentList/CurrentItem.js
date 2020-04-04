import React from 'react'
import { Card } from 'antd'

class CurrentItem extends React.Component {
  render () {
    const {
      title
    } = this.props

    const gridStyle = {
      width: '25%',
      textAlign: 'center'
    }

    return (
      <div>
        <Card title={title}>
          <Card.Grid style={gridStyle}>
            <div>Content</div>
            <div>Content</div>
          </Card.Grid>
        </Card>
      </div>
    )
  }
}

export default CurrentItem

import React from 'react'
import PropTypes from 'prop-types'
import { Card } from 'antd'

const CardIn = ({ item, ...cardProps }) => {
  return (
    <div>
      <Card style={{ width: 300 }} {...cardProps}>
        {item}
      </Card>
    </div>

  )
}
CardIn.propTypes = {
  item: PropTypes.array.isRequired
}

export default CardIn

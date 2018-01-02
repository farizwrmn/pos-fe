import React from 'react'
import PropTypes from 'prop-types'
import { Button, Icon } from 'antd'

const Filter = ({
  openModal,
}) => {
  const openFilter = () => {
    openModal()
  }
  return (
    <Button type="dashed"
      size="large"
      className="button-width02 button-extra-large bgcolor-blue"
      style={{ float: 'right' }}
      onClick={openFilter}
    >
      <Icon type="filter" className="icon-large" />
    </Button>
  )
}

export default Filter

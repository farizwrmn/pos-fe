import React from 'react'
import PropTypes from 'prop-types'
import { Button, Icon, Tooltip } from 'antd'

const Filter = ({
  openModal,
  resetModal,
  listTrans
}) => {
  const openFilter = () => {
    openModal()
  }
  const resetFilter = () => {
    resetModal()
  }
  return (
    <div>
      <Tooltip visible={listTrans.length <= 0} placement="bottomLeft" title="Search transfer list card">
        <Button type="dashed"
          size="large"
          className="button-width02 button-extra-large bgcolor-blue"
          style={{ float: 'right' }}
          onClick={openFilter}
        >
          <Icon type="filter" className="icon-large" />
        </Button>
      </Tooltip>
      <Button type="dashed"
        size="large"
        className="button-width02 button-extra-large bgcolor-lightgrey"
        style={{ float: 'right' }}
        onClick={resetFilter}
      >
        <Icon type="rollback" className="icon-large" />
      </Button>
    </div>
  )
}

export default Filter

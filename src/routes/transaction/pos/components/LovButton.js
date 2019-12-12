import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip, Badge, Button } from 'antd'

const ButtonGroup = Button.Group

const LovButton = ({
  handleMemberBrowse,
  handleAddMember,
  handleAssetBrowse,
  handleAddAsset,
  handleMechanicBrowse,
  handleProductBrowse,
  handleServiceBrowse,
  handleQueue,
  workOrderItem
}) => {
  const objectSize = () => {
    let queue = localStorage.getItem('queue') ? JSON.parse(localStorage.getItem('queue')) : {}
    Object.size = function (obj) {
      let size = 0
      let key
      for (key in obj) {
        if (obj.hasOwnProperty(key)) size += 1
      }
      return size
    }
    let size = Object.size(queue)
    return size
  }
  return (
    <div>
      <ButtonGroup>
        <Button
          type="primary"
          size="large"
          onClick={handleMemberBrowse}
          disabled={workOrderItem.id}
        >
          Member
        </Button>
        <Tooltip title="add Member">
          <Button
            type="primary"
            size="large"
            icon="plus-square-o"
            onClick={handleAddMember}
            disabled={workOrderItem.id}
            className="button-width02"
          />
        </Tooltip>
      </ButtonGroup>
      <ButtonGroup style={{ marginRight: 8 }}>
        <Button
          type="primary"
          size="large"
          onClick={handleAssetBrowse}
          disabled={workOrderItem.id}
        >
          Asset
        </Button>
        <Tooltip title="add Asset">
          <Button disabled={workOrderItem.id} type="primary" size="large" icon="plus-square-o" onClick={handleAddAsset} className="button-width02" />
        </Tooltip>
      </ButtonGroup>
      <Button type="primary"
        size="large"
        icon="customer-service"
        className="button-width01"
        onClick={handleMechanicBrowse}
      >
        Employee
      </Button>
      <Button
        type="primary"
        size="large"
        icon="barcode"
        className="button-width01"
        onClick={handleProductBrowse}
      >
        Product
      </Button>
      <Button type="primary"
        size="large"
        icon="tool"
        className="button-width01"
        onClick={handleServiceBrowse}
      >
        Service
      </Button>
      {/* <Button type="primary"
        size="large"
        icon="tag-o"
        className="button-width01"
        onClick={handlePromoBrowse}
      >
        Promo
      </Button> */}
      <Badge count={objectSize()}>
        <Button type="primary"
          style={{ marginBottom: '4px' }}
          size="large"
          icon="bell"
          className="button-width01"
          onClick={handleQueue}
        >
          Queue
        </Button>
      </Badge>
    </div >
  )
}

LovButton.propTypes = {
  handleMemberBrowse: PropTypes.func.isRequired,
  handleAddMember: PropTypes.func.isRequired,
  handleAssetBrowse: PropTypes.func.isRequired,
  handleAddAsset: PropTypes.func.isRequired,
  handleMechanicBrowse: PropTypes.func.isRequired,
  handleProductBrowse: PropTypes.func.isRequired,
  handleServiceBrowse: PropTypes.func.isRequired,
  handleQueue: PropTypes.func.isRequired
}

export default LovButton

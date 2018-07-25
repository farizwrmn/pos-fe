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
  handlePromoBrowse
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
        >
          Member
        </Button>
        <Tooltip title="add Member">
          <Button
            type="primary"
            size="large"
            icon="plus-square-o"
            onClick={handleAddMember}
            className="button-width02"
          />
        </Tooltip>
      </ButtonGroup>
      <ButtonGroup style={{ marginRight: 8 }}>
        <Button
          type="primary"
          size="large"
          onClick={handleAssetBrowse}
        >
          Asset
        </Button>
        <Tooltip title="add Asset">
          <Button type="primary" size="large" icon="plus-square-o" onClick={handleAddAsset} className="button-width02" />
        </Tooltip>
      </ButtonGroup>
      <Button type="primary"
        size="large"
        icon="customer-service"
        className="button-width01"
        onClick={handleMechanicBrowse}
      >
        Mechanic
      </Button>
      <ButtonGroup>
        <Button
          type="primary"
          size="large"
          icon="barcode"
          onClick={handleProductBrowse}
        >
          Product
        </Button>
        <Tooltip title="add Product">
          <Button
            type="primary"
            size="large"
            icon="plus-square-o"
            className="button-width02"
          />
        </Tooltip>
      </ButtonGroup>
      <Button type="primary"
        size="large"
        icon="tool"
        className="button-width01"
        onClick={handleServiceBrowse}
      >
        Service
      </Button>
      <Button type="primary"
        size="large"
        icon="tag-o"
        className="button-width01"
        onClick={handlePromoBrowse}
      >
        Promo
      </Button>
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
    </div>
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
  handleQueue: PropTypes.func.isRequired,
  handlePromoBrowse: PropTypes.func.isRequired
}

export default LovButton

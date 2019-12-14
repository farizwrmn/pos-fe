import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip, Badge, Button } from 'antd'

const ButtonGroup = Button.Group

const LovButton = ({
  memberInformation,
  memberUnitInfo,
  mechanicInformation,
  handleMemberBrowse,
  handleAddMember,
  handleAssetBrowse,
  handleAddAsset,
  handleMechanicBrowse,
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
          {memberInformation && memberInformation.memberName ? `Member (${memberInformation.memberName})` : 'Member'}
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
          {memberUnitInfo && memberUnitInfo.policeNo ? `Asset (${memberUnitInfo.policeNo})` : 'Asset'}
        </Button>
        <Tooltip title="add Asset">
          <Button disabled={workOrderItem.id} type="primary" size="large" icon="plus-square-o" onClick={handleAddAsset} />
        </Tooltip>
      </ButtonGroup>
      <ButtonGroup style={{ marginRight: 8 }}>
        <Button
          type="primary"
          size="large"
          icon="customer-service"
          onClick={handleMechanicBrowse}
        >
          {mechanicInformation && mechanicInformation.employeeName ? `Employee (${mechanicInformation.employeeName})` : 'Employee'}
        </Button>
      </ButtonGroup>
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
  handleQueue: PropTypes.func.isRequired
}

export default LovButton

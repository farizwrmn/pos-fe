import React from 'react'
import PropTypes from 'prop-types'
import {
  Tooltip,
  // Badge,
  Button
} from 'antd'
import { lstorage } from 'utils'
import styles from './LovButton.less'

const ButtonGroup = Button.Group

// Find Left Boundry of current Window
function FindLeftWindowBoundry () {
  // In Internet Explorer window.screenLeft is the window's left boundry
  if (window.screenLeft) {
    return window.screenLeft
  }

  // In Firefox window.screenX is the window's left boundry
  if (window.screenX) {
    return window.screenX
  }

  return 0
}

window.leftWindowBoundry = FindLeftWindowBoundry

// Find Left Boundry of the Screen/Monitor
function FindLeftScreenBoundry () {
  // Check if the window is off the primary monitor in a positive axis
  // X,Y                  X,Y                    S = Screen, W = Window
  // 0,0  ----------   1280,0  ----------
  //     |          |         |  ---     |
  //     |          |         | | W |    |
  //     |        S |         |  ---   S |
  //      ----------           ----------
  if (window.leftWindowBoundry() > window.screen.width) {
    return window.leftWindowBoundry() - (window.leftWindowBoundry() - window.screen.width)
  }

  // Check if the window is off the primary monitor in a negative axis
  // X,Y                  X,Y                    S = Screen, W = Window
  // 0,0  ----------  -1280,0  ----------
  //     |          |         |  ---     |
  //     |          |         | | W |    |
  //     |        S |         |  ---   S |
  //      ----------           ----------
  // This only works in Firefox at the moment due to a bug in Internet Explorer opening new windows into a negative axis
  // However, you can move opened windows into a negative axis as a workaround
  if (window.leftWindowBoundry() < 0 && window.leftWindowBoundry() > (window.screen.width * -1)) {
    return (window.screen.width * -1)
  }

  // If neither of the above, the monitor is on the primary monitor whose's screen X should be 0
  return 0
}

window.leftScreenBoundry = FindLeftScreenBoundry

// const objectSize = () => {
//   let queue = localStorage.getItem('queue') ? JSON.parse(localStorage.getItem('queue')) : {}
//   Object.size = function (obj) {
//     let size = 0
//     let key
//     for (key in obj) {
//       if (obj.hasOwnProperty(key)) size += 1
//     }
//     return size
//   }
//   let size = Object.size(queue)
//   return size
// }

const LovButton = ({
  onClickCash,
  onFullscreen,
  memberInformation,
  // memberUnitInfo,
  mechanicInformation,
  handleMemberBrowse,
  handleAddMember,
  // handleAssetBrowse,
  // handleAddAsset,
  // handlePromoBrowse,
  handleMechanicBrowse,
  // handleQueue,
  workOrderItem
}) => {
  const handleCustomerView = () => {
    let iframe = `<html><head><style>body, html {width: 100%; height: 100%; margin: 0; padding: 0}</style></head><body><iframe src="${window.location.origin}/transaction/pos/customer-view" style="height:calc(100% - 4px);width:calc(100% - 4px)"></iframe></html></body>`
    const win = window.open('', '_blank', `resizable=1,location=no,status=no,height=${screen.height},width=${screen.width},scrollbars=1,fullscreen=1,screenX=${window.leftScreenBoundry()},left=${window.leftScreenBoundry()},toolbar=0,menubar=0,status=1`)
    win.document.write(iframe)
  }
  const handleHome = () => {
    window.open('/balance/current', '_blank')
  }
  const currentStoreName = lstorage.getCurrentUserStoreName()

  return (
    <div>
      <ButtonGroup>
        <Button
          type="primary"
          size="large"
          onClick={handleMemberBrowse}
          disabled={workOrderItem.id}
        >
          {memberInformation && memberInformation.memberName ? `Member (${memberInformation.memberName.substring(0, 10)})` : 'Member'}
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
      {/* <ButtonGroup style={{ marginRight: 8 }}>
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
      </ButtonGroup> */}
      {/* <ButtonGroup style={{ marginRight: 8 }}> */}
      <Button
        type="primary"
        size="large"
        icon="customer-service"
        disabled
        style={{ marginRight: 8 }}
        onClick={handleMechanicBrowse}
      >
        {mechanicInformation && mechanicInformation.employeeName ? `Employee (${mechanicInformation.employeeName})` : 'Employee'}
      </Button>
      {/* </ButtonGroup> */}
      {/* <Badge count={objectSize()}>
        <Button type="primary"
          style={{ marginRight: 8 }}
          size="large"
          icon="bell"
          onClick={handleQueue}
        >
          Queue
        </Button>
      </Badge> */}
      <Button
        type="secondary"
        size="large"
        icon="laptop"
        style={{ backgroundColor: '#FFFF00', borderColor: '#FFFF00' }}
        onClick={() => handleCustomerView()}
      >
        Customer View
      </Button>
      <span style={{ marginLeft: '30px' }} className={styles.currentStore}>
        {currentStoreName}
      </span>
      <Button
        type="primary"
        size="large"
        icon="home"
        style={{ marginLeft: '30px' }}
        onClick={() => handleHome()}
      />
      <Button
        type="primary"
        size="large"
        icon="wallet"
        style={{ marginLeft: '10px' }}
        onClick={() => onClickCash()}
      />
      <Button
        type="default"
        size="large"
        icon="arrows-alt"
        style={{ marginLeft: '10px' }}
        onClick={() => onFullscreen()}
      />
    </div >
  )
}

LovButton.propTypes = {
  handleMemberBrowse: PropTypes.func.isRequired,
  handleAddMember: PropTypes.func.isRequired,
  // handleAssetBrowse: PropTypes.func.isRequired,
  // handleAddAsset: PropTypes.func.isRequired,
  handleMechanicBrowse: PropTypes.func.isRequired
  // handleQueue: PropTypes.func.isRequired
}

export default LovButton

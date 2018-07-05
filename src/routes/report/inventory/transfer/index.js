import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Tabs } from 'antd'
import { TransferOut, TransferIn, InTransfer, InTransit } from './components'

const TabPane = Tabs.TabPane

const Report = ({ inventoryReport, dispatch }) => {
  const { activeKey } = inventoryReport

  const onChangeTab = (key) => {
    const { query, pathname } = location
    dispatch(routerRedux.push({
      pathname,
      query: {
        ...query,
        activeKey: key
      }
    }))
    dispatch({
      type: 'inventoryReport/setListNull'
    })
  }
  return (
    <div className="content-inner" style={{ clear: 'both' }}>
      <Tabs activeKey={activeKey} onChange={key => onChangeTab(key)} type="card">
        <TabPane tab="Transfer In" key="0">{activeKey === '0' && <TransferIn />}</TabPane>
        <TabPane tab="Transfer Out" key="1">{activeKey === '1' && <TransferOut />}</TabPane>
        <TabPane tab="In Transfer" key="2">{activeKey === '2' && <InTransfer />}</TabPane>
        <TabPane tab="In Transit" key="3">{activeKey === '3' && <InTransit />}</TabPane>
      </Tabs>
    </div>
  )
}

Report.propTypes = {
  dispatch: PropTypes.func
}

export default connect(({ inventoryReport }) => ({ inventoryReport }))(Report)

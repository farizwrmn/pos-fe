import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Tabs } from 'antd'
import {
  PriceHeader,
  PriceDetail
} from './components'

const TabPane = Tabs.TabPane

const Report = ({ sellpriceReport, dispatch }) => {
  const { activeKey } = sellpriceReport

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
      type: 'sellpriceReport/setListNull'
    })
  }
  return (
    <div className="content-inner">
      <Tabs activeKey={activeKey} onChange={key => onChangeTab(key)} type="card">
        <TabPane tab="SellPrice" key="0">
          {activeKey === '0' && <PriceHeader />}
        </TabPane>
        <TabPane tab="Price Detail" key="1">
          {activeKey === '1' && <PriceDetail />}
        </TabPane>
      </Tabs>
    </div>
  )
}

Report.propTypes = {
  dispatch: PropTypes.func
}

export default connect(({ sellpriceReport }) => ({ sellpriceReport }))(Report)

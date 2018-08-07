import React from 'react'
import { connect } from 'dva'
import { Tabs } from 'antd'
import { Detail } from '../components'

const TabPane = Tabs.TabPane

const Promo = ({ promo }) => {
  const { activeKey } = promo

  const changeTab = (key) => {
    console.log(key)
  }

  return (
    <div className="content-inner" style={{ clear: 'both' }}>
      <Tabs activeKey={activeKey} onChange={changeTab}>
        <TabPane tab="Detail" key="0"><Detail /></TabPane>
      </Tabs>
    </div>
  )
}

export default connect(({ promo }) => ({ promo }))(Promo)


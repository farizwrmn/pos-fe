import React from 'react'
import { Tabs } from 'antd'
import DetailList from './DetailList'

const TabPane = Tabs.TabPane

const Detail = ({
  list,
  paymentMethod,
  detailActiveKey,
  changeTab,
  numberFormatter
}) => {
  return (
    <div style={{ marginTop: '10px' }}>
      <Tabs activeKey={detailActiveKey} onChange={key => changeTab(key)} type="card">
        {paymentMethod && paymentMethod.map((record, index) => {
          return (
            <TabPane tab={record.method} key={index}>
              {detailActiveKey === `${index}` &&
                <DetailList
                  list={list.filter(filtered => filtered.paymentmethod_id === record.id)}
                  numberFormatter={numberFormatter}
                />
              }
            </TabPane>
          )
        })}
      </Tabs>
    </div>
  )
}

export default Detail

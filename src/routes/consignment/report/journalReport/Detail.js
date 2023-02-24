import React from 'react'
import { Col, Tabs } from 'antd'
import DetailList from './DetailList'

const TabPane = Tabs.TabPane

const Detail = ({
  list,
  paymentMethod,
  detailActiveKey,
  changeTab,
  numberFormatter,
  loading
}) => {
  return (
    <Col span={24}>
      <Tabs activeKey={detailActiveKey} onChange={key => changeTab(key)} type="card">
        {paymentMethod && paymentMethod.map((record, index) => {
          return (
            <TabPane tab={record.method} key={index}>
              {detailActiveKey === `${index}` &&
                <DetailList
                  list={list.filter(filtered => filtered.paymentmethod_id === record.id)}
                  numberFormatter={numberFormatter}
                  loading={loading}
                />
              }
            </TabPane>
          )
        })}
      </Tabs>
    </Col>
  )
}

export default Detail

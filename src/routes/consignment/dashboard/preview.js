import React from 'react'
import { Button, Card, Col, Row } from 'antd'
import Sales from './components/sales'
import ColorInfo from './components/colorInfo'

function Preview ({
  dispatch,
  changeTab,
  showModalDetail,

  typeText,
  salesData,
  modalRange,
  modalPeriod,

  boxList,

  consignmentId,
  selectedOutlet
}) {
  const salesProps = {
    consignmentId,
    dispatch,
    typeText,
    data: salesData,
    modalRange,
    modalPeriod
  }

  return (
    <div>
      <Row gutter={24}>
        <Col lg={24} md={24}>
          <Card bordered={false}
            bodyStyle={{
              padding: '24px 36px 24px 0'
            }}
          >
            <Sales {...salesProps} />
          </Card>
        </Col>
      </Row>

      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <ColorInfo />
        <Button type="primary" size="large" style={{ margin: '15px 0px 15px 0px' }} onClick={() => changeTab('1')}>
          See Detail
        </Button>
      </div>

      <Row gutter={24} justify="center">
        {boxList.map((item) => {
          return (
            <Col lg={2} md={4}>
              <div onClick={() => {
                item.daysLeft && showModalDetail({
                  ...item,
                  outlet_name: selectedOutlet.outlet_name
                })
              }}
              >
                <Card
                  bordered={false}
                  style={{
                    backgroundColor: (item.daysLeft || 0) > 7 ? '#808080' : item.daysLeft ? '#ffc300' : '#38b000',
                    marginTop: '10px',
                    marginBottom: '10px',
                    fontWeight: 'bolder',
                    textAlign: 'center',
                    borderRadius: '10px'
                  }}
                >
                  <a href={null} style={{ color: '#FFFFFF' }}>{item.box_code}</a>
                </Card>
              </div>
            </Col>
          )
        })}
      </Row>
    </div>
  )
}

export default (Preview)

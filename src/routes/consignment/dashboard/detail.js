import React from 'react'
import { Button, Card, Col, Icon, Modal, Row, Table, Tooltip } from 'antd'
import { numberFormat } from 'utils'
import moment from 'moment'

const numberFormatter = numberFormat.numberFormatter

function Detail ({
  selectedOutlet,
  boxList,
  salesSummary,
  showModalDetail,
  endRent
}) {
  const todayDate = moment().format('DD MMMM YYYY')

  console.log('boxList', boxList)
  console.log('salesSummary', salesSummary)

  const columns = [
    {
      title: `Penjualan ${todayDate}`,
      dataIndex: 'paymentMethods.method'
    }, {
      title: selectedOutlet.outlet_name,
      dataIndex: 'total',
      render: value => `Rp ${numberFormatter(value)}`
    }
  ]

  const onRemoveRent = (item) => {
    Modal.confirm({
      title: 'Do you want to remove this rent?',
      content: 'When clicked the OK button, this rent contract will be ended',
      onOk () {
        endRent(item)
      },
      onCancel () {
      }
    })
  }

  return (
    <div>
      <Row gutter={24} style={{ marginBottom: '20px' }}>
        <Col lg={12} md={24}>
          <Table pagination={false} bordered columns={columns} rowKey={(record, key) => key} dataSource={salesSummary || []} />
        </Col>
      </Row>

      <Row gutter={24} justify="center" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'stretch' }}>
        {(boxList || []).map((item) => {
          if (item['vendor.name']) {
            return (
              <Col lg={4} md={8}>

                <Card
                  title={item.box_code}
                  bordered
                  style={{
                    marginTop: '10px',
                    marginBottom: '10px',
                    fontWeight: 'bolder',
                    borderRadius: '10px'
                  }}
                >
                  {item['vendor.vendor_code'] && (
                    <div>
                      <div>
                        {item['vendor.vendor_code']}
                      </div>
                      <div>
                        {item['vendor.name']}
                      </div>
                      <div>
                        Berakhir dalam {item.daysLeft} hari
                      </div>
                      <div>
                        +62{item['vendor.phone']}
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex' }}>
                    <Tooltip placement="bottom" title="Detail">
                      <Button type="ghost" shape="circle" onClick={() => showModalDetail(item)}>
                        <Icon type="ellipsis" />
                      </Button>
                    </Tooltip>
                    <Tooltip placement="bottom" title="Line">
                      <Button type="ghost" shape="circle">
                        <Icon type="mobile" />
                      </Button>
                    </Tooltip>
                    <Tooltip placement="bottom" title="Whatsapp">
                      <Button type="ghost" shape="circle" onClick={() => { window.open(`https://api.whatsapp.com/send?phone=62${item['vendor.phone']}`, '_blank') }}>
                        <Icon type="message" />
                      </Button>
                    </Tooltip>
                    <Tooltip placement="bottom" title="Phone">
                      <Button type="ghost" shape="circle" onClick={() => { window.open(`tel:+62${item['vendor.phone']}`) }}>
                        <Icon type="phone" />
                      </Button>
                    </Tooltip>
                    <Tooltip placement="bottom" title="Message">
                      <Button type="ghost" shape="circle">
                        <Icon type="mail" />
                      </Button>
                    </Tooltip>
                    <Tooltip placement="bottom" title="Remove Rent">
                      <Button type="danger" shape="circle" onClick={() => onRemoveRent(item)}>
                        <Icon type="close" />
                      </Button>
                    </Tooltip>
                  </div>
                </Card>
              </Col>
            )
          }
          return (
            <Col lg={4} md={8}>
              <div>
                <Card
                  title={item.box_code}
                  bordered
                  bodyStyle={{
                    backgroundColor: '#38b000',
                    borderRadius: '0 0 10px 10px'
                  }}
                  style={{
                    marginTop: '10px',
                    marginBottom: '10px',
                    fontWeight: 'bolder',
                    borderRadius: '10px'
                  }}
                />
              </div>
            </Col>
          )
        })}
      </Row>
    </div >
  )
}

export default (Detail)

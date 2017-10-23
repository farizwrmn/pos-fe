import React from 'react'
import PropTypes from 'prop-types'
import { Card, Table, Modal, Button, Badge, Form, Radio, Tabs } from 'antd'
import { connect } from 'dva'
import styles from './List.less'
import classnames from 'classnames'
import AnimTableBody from 'components/DataTable/AnimTableBody'
import { DropOption } from 'components'

const FormItem = Form.Item

const TabPane = Tabs.TabPane;

const ListQueue = ({ isMotion, pos, dispatch, location, ...tableProps }) => {
  const { listQueue, curQueue } = pos
  const handleChange = (e) => {

    dispatch({
      type: 'pos/changeQueue',
      payload: {
        queue: e,
      },
    })
  }


  const handleClick = () => {
    const queue = localStorage.getItem('queue') ? JSON.parse(localStorage.getItem('queue')) : {}
    const listQueue = _.get(queue, `queue${curQueue}`) ? _.get(queue, `queue${curQueue}`) : []
    const useQueue = `queue${curQueue}`
    if (Object.keys(listQueue).length === 0) {
      Modal.warning({
        title: 'Warning',
        content: `Queue ${curQueue} Not Found...!`,
      })
    } else {
      const cashier_trans = listQueue
      const trans = cashier_trans[0]
      let arrayMember = []
      let arrayMechanic = []
      arrayMember.push({
        memberCode: trans.memberCode,
        memberName: trans.memberName,
        point: trans.point,
        memberTypeId: trans.memberTypeId,
        id: trans.id,
        address01: trans.address01,
        gender: trans.gender,
        phone: trans.phone,
      })
      arrayMechanic.push({
        mechanicCode: trans.mechanicCode,
        mechanicName: trans.mechanicName
      })
      Reflect.deleteProperty(queue, useQueue);
      localStorage.setItem('lastMeter', trans.lastMeter ? trans.lastMeter : 0)
      localStorage.setItem('memberUnit', trans.memberUnit)
      localStorage.setItem('mechanic', JSON.stringify(arrayMechanic))
      localStorage.setItem('member', JSON.stringify(arrayMember))
      localStorage.setItem('cashier_trans', JSON.stringify(trans.cashier_trans))
      localStorage.setItem('service_detail', JSON.stringify(trans.service_detail))
      localStorage.setItem('queue', JSON.stringify(queue))
      document.getElementById('KM').value = localStorage.getItem('lastMeter') ? localStorage.getItem('lastMeter') : 0
      dispatch({
        type: 'pos/setCurTotal',
      })

      dispatch({
        type: 'pos/hideQueueModal',
      })
    }
  }

  const getBodyWrapperProps = {
    page: location.query.page,
    current: tableProps.pagination.current,
  }

  const getBodyWrapper = body => { return isMotion ? <AnimTableBody {...getBodyWrapperProps} body={body} /> : body }

  return (
    <div>
      <Tabs onChange={handleChange} defaultActiveKey="1" style={{ marginTop: '20px' }}>
        <TabPane tab="Queue 1" key="1" />
        <TabPane tab="Queue 2" key="2" />
        <TabPane tab="Queue 3" key="3" />
        <TabPane tab="Queue 4" key="4" />
        <TabPane tab="Queue 5" key="5" />
        <TabPane tab="Queue 6" key="6" />
        <TabPane tab="Queue 7" key="7" />
        <TabPane tab="Queue 8" key="8" />
        <TabPane tab="Queue 9" key="9" />
        <TabPane tab="Queue 10" key="10" />
      </Tabs>
        <Card bodyStyle={{ padding : 0, fontSize: '150%' }} bordered={false} style={{ width: '100%', marginBottom:5 }}>
          <div style={{textAlign: 'center'}}>
            General Information
          </div>
          <div>
            <Table
            bordered
            columns={[
              {
                title: 'ID',
                dataIndex: 'memberCode'
              },
              {
                title: 'NAME',
                dataIndex: 'memberName'
              },
              {
                title: 'KM',
                dataIndex: 'lastMeter'
              },
              {
                title: 'Unit',
                dataIndex: 'memberUnit'
              },
              {
                title: 'Mechanic',
                dataIndex: 'mechanicName'
              },
              {
                title: 'Mechanic ID',
                dataIndex: 'mechanicCode'
              },
              {
                title: 'Point',
                dataIndex: 'point'
              },
            ]}
            dataSource={listQueue}
            pagination={false}
            locale = {{
              emptyText: 'No General Information',
            }}
            />
          </div>
        </Card>
        <Card bodyStyle={{ padding : 0, fontSize: '200%' }} bordered={false} style={{ width: '100%' }}>
          <div style={{textAlign: 'center'}}>
            Payment List
          </div>
          <div>
          <Table
            rowKey={(record, key) => key}
            pagination={false}
            bordered
            scroll={{ x: 800 }}
            columns={[
              {
                title: 'No',
                dataIndex: 'no',
              },
              {
                title: 'Barcode',
                dataIndex: 'code',
              },
              {
                title: 'Product Name',
                dataIndex: 'name',
              },
              {
                title: 'Qty',
                dataIndex: 'qty',
              },
              {
                title: 'Price',
                dataIndex: 'price',
              },
              {
                title: 'Disc 1(%)',
                dataIndex: 'disc1',
              },
              {
                title: 'Disc 2(%)',
                dataIndex: 'disc2',
              },
              {
                title: 'Disc 3(%)',
                dataIndex: 'disc3',
              },
              {
                title: 'Discount',
                dataIndex: 'discount',
              },
              {
                title: 'Total',
                dataIndex: 'total',
              },
            ]}
            dataSource={listQueue[0] ? listQueue[0].cashier_trans : []}
            style={{ marginBottom: 16 }}
            locale={{
              emptyText: 'No Payment Information',
            }}
          />
          </div>
          <div>
            <Table
              rowKey={(record, key) => key}
              pagination={false}
              bordered
              scroll={{x: 800}}
              columns={[
                {
                  title: 'No',
                  dataIndex: 'no',
                },
                {
                  title: 'Barcode',
                  dataIndex: 'code',
                },
                {
                  title: 'Product Name',
                  dataIndex: 'name',
                },
                {
                  title: 'Qty',
                  dataIndex: 'qty',
                },
                {
                  title: 'Price',
                  dataIndex: 'price',
                },
                {
                  title: 'Disc 1(%)',
                  dataIndex: 'disc1',
                },
                {
                  title: 'Disc 2(%)',
                  dataIndex: 'disc2',
                },
                {
                  title: 'Disc 3(%)',
                  dataIndex: 'disc3',
                },
                {
                  title: 'Discount',
                  dataIndex: 'discount',
                },
                {
                  title: 'Total',
                  dataIndex: 'total',
                },
              ]}
              dataSource={listQueue[0] ? listQueue[0].service_detail : []}
              style={{ marginBottom: 16 }}
              locale={{
                emptyText: 'No Payment Information',
              }}
            />
          </div>
        </Card>
      <Button onClick={handleClick}> RESTORE </Button>
    </div>
  )
}

ListQueue.propTypes = {
  onChooseItem: PropTypes.func,
  isMotion: PropTypes.bool,
  location: PropTypes.object,
  pos: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ pos }) => ({ pos }))(ListQueue)

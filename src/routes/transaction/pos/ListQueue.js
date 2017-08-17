import React from 'react'
import PropTypes from 'prop-types'
import { Card, Table, Modal, Button, Input, Icon, Form, Radio, Tabs } from 'antd'
import { connect } from 'dva'
import styles from './List.less'
import classnames from 'classnames'
import AnimTableBody from 'components/DataTable/AnimTableBody'
import { DropOption } from 'components'

const FormItem = Form.Item

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;

const ListQueue = ({ isMotion, pos, dispatch, location, ...tableProps }) => {
  const { listQueue, curQueue } = pos
  const handleChange = (e) => {
    console.log('handleChange', e);

    dispatch({
      type: 'pos/changeQueue',
      payload: {
        queue: e,
      },
    })
  }


  const handleClick = () => {
    console.log('pilih antrian ke ' + curQueue)
    if (localStorage.getItem('queue' + curQueue) === null ) {
      const modal = Modal.warning({
        title: 'Warning',
        content: `Queue ${curQueue} Not Found...!`,
      })
    } else {
      const cashier_trans = JSON.parse(localStorage.getItem('queue' + curQueue))
      const trans = cashier_trans[0]
      var arrayMember = []
      var arrayMechanic = []
      arrayMember.push({
        memberCode: trans.memberCode,
        memberName: trans.memberName,
        point: trans.point,
        id: trans.id
      })
      arrayMechanic.push({
        mechanicCode: trans.mechanicCode,
        mechanicName: trans.mechanicName
      })
      localStorage.setItem('lastMeter', trans.lastMeter)
      localStorage.setItem('memberUnit', trans.memberUnit)
      localStorage.setItem('mechanic', JSON.stringify(arrayMechanic))
      localStorage.setItem('member', JSON.stringify(arrayMember))
      localStorage.setItem('cashier_trans', JSON.stringify(trans.cashier_trans))
      localStorage.removeItem('queue' + curQueue)
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
      <Tabs onChange={handleChange} defaultActiveKey="1">
        <TabPane  tab="Queue 1" key="1"/>
        <TabPane  tab="Queue 2" key="2"/>
        <TabPane  tab="Queue 3" key="3"/>
      </Tabs>
        <Card bodyStyle={{ padding : 0, fontSize: '200%' }} bordered={false} style={{ width: '100%', marginBottom:5 }}>
          <div style={{textAlign: 'center'}}>
            Member Information
          </div>
          <div>
            <Table
            pagination={true}
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
            pagination={true}
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
            dataSource={listQueue ? listQueue[0].cashier_trans : []}
            pagination={false}
            style={{ marginBottom: 16 }}
          />
          </div>
        </Card>
        <Button onClick={handleClick} > RESTORE </Button>
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

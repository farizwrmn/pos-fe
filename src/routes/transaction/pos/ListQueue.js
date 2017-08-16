import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Button, Input, Icon, Form, Radio } from 'antd'
import { connect } from 'dva'
import styles from './List.less'
import classnames from 'classnames'
import AnimTableBody from 'components/DataTable/AnimTableBody'
import { DropOption } from 'components'

const FormItem = Form.Item

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const ListQueue = ({ isMotion, pos, dispatch, location, ...tableProps }) => {
  const { listQueue, curQueue } = pos

  const handleChange = (e) => {
    const {value} = e.target

    dispatch({
      type: 'pos/changeQueue',
      payload: {
        queue: value,
      },
    })
  }


  const handleClick = () => {
    console.log('pilih antrian ke ' + curQueue)
    localStorage.setItem('cashier_trans', localStorage.getItem('queue' + curQueue))
    localStorage.removeItem('queue' + curQueue)

    dispatch({
      type: 'pos/setCurTotal',
    })

    dispatch({
      type: 'pos/hideQueueModal',
    })
  }

  const getBodyWrapperProps = {
    page: location.query.page,
    current: tableProps.pagination.current,
  }

  const getBodyWrapper = body => { return isMotion ? <AnimTableBody {...getBodyWrapperProps} body={body} /> : body }

  return (
    <div>
      <RadioGroup onChange={handleChange} defaultValue="1">
        <RadioButton value="1"> Queue No. 1 </RadioButton>
        <RadioButton value="2"> Queue No. 2 </RadioButton>
        <RadioButton value="3"> Queue No. 3 </RadioButton>
      </RadioGroup>

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
        dataSource={listQueue}
        style={{ marginBottom: 16 }}
      />
      <Button onClick={handleClick} > Confirm </Button>
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

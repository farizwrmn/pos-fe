import React from 'react'
import { Form, Modal, Table } from 'antd'
import styles from '../../../../themes/index.less'


const columns = [
  {
    title: 'Location Name',
    dataIndex: 'locationName',
    key: 'locationName',
    width: '300px',
    className: styles.alignCenter
  },
  {
    title: 'Quantity Location',
    dataIndex: 'qtyLocation',
    key: 'qtyLocation',
    className: styles.alignCenter,
    width: '200px'
  }
]


const ModalEntry = ({
  dataSource,
  ...modalLocationProps
}) => {
  const modalOpts = {
    ...modalLocationProps
  }

  return (
    <Modal {...modalOpts}>
      <Table bordered dataSource={dataSource} columns={columns} />
    </Modal>
  )
}

export default Form.create()(ModalEntry)

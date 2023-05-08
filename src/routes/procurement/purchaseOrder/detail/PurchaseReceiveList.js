import React from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Row,
  Table,
  Tag
} from 'antd'
import { Link } from 'dva/router'

const PurchaseReceiveList = ({
  dataSource,
  form: {
    resetFields
  }
}) => {
  const listProps = {
    dataSource,
    editList () {
      resetFields()
    }
  }

  const columns = [
    {
      title: 'Trans',
      dataIndex: 'transNo',
      key: 'transNo',
      width: '130px',
      render: (text, record) => <Link target="_blank" to={`/transaction/procurement/order/${record.id}`}>{text}</Link>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '100px',
      render: (text) => {
        if (text === 1) {
          return <Tag color="blue">On-Going</Tag>
        }
        if (text === 2) {
          return <Tag color="green">Finished</Tag>
        }
        if (text === 0) {
          return <Tag color="red">Cancelled</Tag>
        }
        return null
      }
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier.supplierName',
      key: 'supplier.supplierName',
      width: '100px'
    },
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: '100px'
    }
  ]

  return (
    <Form layout="horizontal">
      <Row>
        <Table
          {...listProps}
          bordered={false}
          pagination={false}
          columns={columns}
          simple
          rowKey={record => record.id}
        />
      </Row>
    </Form>
  )
}

PurchaseReceiveList.propTypes = {
  form: PropTypes.object.isRequired,
  disabled: PropTypes.string,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  changeTab: PropTypes.func,
  clickBrowse: PropTypes.func,
  activeKey: PropTypes.string,
  button: PropTypes.string
}

export default Form.create()(PurchaseReceiveList)

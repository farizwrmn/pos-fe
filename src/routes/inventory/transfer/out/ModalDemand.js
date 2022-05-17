import React from 'react'
import PropTypes from 'prop-types'
import { Table, Form, Modal, Button } from 'antd'

const ModalDemand = ({
  onOk,
  data,
  listProductDemand,
  form: { validateFields, getFieldsValue, resetFields },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) return
      const record = {
        ...getFieldsValue()
      }
      Modal.confirm({
        title: `Void ${data.transNo}'s payment`,
        content: 'Are you sure ?',
        onOk () {
          onOk(record)
        }
      })
      resetFields()
    })
  }

  const columns = [

    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
      width: 150,
      render: (text, record) => {
        return (
          <div>
            <div><strong>{record.productCode}</strong></div>
            <div>{record.productName}</div>
          </div>
        )
      }
    },
    {
      title: 'Brand',
      dataIndex: 'brandName',
      key: 'brandName',
      width: 100
    },
    {
      title: 'Category',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 100
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      width: 80
    }
  ]

  const modalOpts = {
    ...modalProps,
    onOk: handleOk
  }
  return (
    <Modal {...modalOpts}
      footer={[
        <Button key="submit" onClick={() => handleOk()} type="primary" >Process</Button>
      ]}
    >
      <Table
        dataSource={listProductDemand}
        bordered
        columns={columns}
        simple
        scroll={{ x: 400 }}
        rowKey={record => record.id}
      />
    </Modal>
  )
}

ModalDemand.propTypes = {
  form: PropTypes.object.isRequired,
  location: PropTypes.object,
  onOk: PropTypes.func,
  invoiceCancel: PropTypes.object
}

export default Form.create()(ModalDemand)

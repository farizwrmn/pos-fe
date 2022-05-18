import React from 'react'
import PropTypes from 'prop-types'
import { Table, Form, Modal, Button } from 'antd'

const ModalDemand = ({
  onOk,
  data,
  loading,
  listBrand,
  listCategory,
  listProductDemand,
  selectedRowKeys,
  updateSelectedKey,
  onGetAll,
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
        title: 'Insert Product Transaction',
        content: 'This action will reset your current process, Are you sure ?',
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
      width: 250,
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
      onFilter: (value, record) => record.brandName.includes(value),
      filters: listBrand ? listBrand.map(item => ({ text: item.brandName, value: item.brandName })) : [],
      width: 100
    },
    {
      title: 'Category',
      dataIndex: 'categoryName',
      key: 'categoryName',
      onFilter: (value, record) => record.categoryName.includes(value),
      filters: listCategory ? listCategory.map(item => ({ text: item.categoryName, value: item.categoryName })) : [],
      width: 100
    },
    {
      title: (<strong>Qty</strong>),
      dataIndex: 'qty',
      key: 'qty',
      width: 80,
      render: (text) => {
        return (<strong>{text}</strong>)
      }
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      width: 80
    },
    {
      title: 'Demand',
      dataIndex: 'qtyDemand',
      key: 'qtyDemand',
      width: 80
    },
    {
      title: 'Current MUIN',
      dataIndex: 'qtyTransferIn',
      key: 'qtyTransferIn',
      width: 80
    },
    {
      title: 'Sales',
      dataIndex: 'qtyOldSales',
      key: 'qtyOldSales',
      width: 80
    },
    {
      title: 'Fulfill',
      dataIndex: 'qtyOldFulfillment',
      key: 'qtyOldFulfillment',
      width: 80
    },
    {
      title: 'Old MUIN',
      dataIndex: 'qtyOldTransferIn',
      key: 'qtyOldTransferIn',
      width: 80
    }
  ]

  const modalOpts = {
    ...modalProps,
    onOk: handleOk
  }

  const rowSelection = {
    selectedRowKeys,
    hideDefaultSelections: false,
    onChange: (selectedRowKeys) => {
      updateSelectedKey(selectedRowKeys)
    },
    onSelectAll: () => {
      if (listProductDemand.length === selectedRowKeys.length) {
        updateSelectedKey([])
      } else {
        updateSelectedKey(listProductDemand.map(item => item.id))
      }
    }
  }

  return (
    <Modal {...modalOpts}
      footer={[
        <Button key="submit" onClick={() => handleOk()} type="primary" >Process</Button>
      ]}
    >
      <Button key="submit" onClick={() => onGetAll()} type="primary">Show All</Button>
      <Table
        dataSource={listProductDemand}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true
        }}
        loading={loading.effects['transferOut/showModalDemand']}
        rowSelection={rowSelection}
        selectedRowKeys={selectedRowKeys}
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

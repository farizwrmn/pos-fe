import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Form, Modal, Button, InputNumber } from 'antd'

class ModalDemand extends Component {
  state = {
    filters: {}
  }

  render () {
    const {
      onOk,
      data,
      loading,
      listBrand,
      listCategory,
      listStockLocation,
      listProductDemand,
      selectedRowKeys,
      updateSelectedKey,
      handleItemEdit,
      onGetAll,
      form: { validateFields, getFieldsValue, resetFields },
      ...modalProps
    } = this.props
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

    const handleFocus = (event) => {
      event.target.select()
    }

    const handleChangeQty = (record, event) => {
      const qty = event.target.value
      handleItemEdit({
        ...record,
        qty: parseFloat(qty)
      }, event)
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
              <div>Dimension: {record.dimension} Pack: {record.dimensionPack} Box: {record.dimensionBox}</div>
            </div>
          )
        }
      },
      {
        title: (<strong>Qty</strong>),
        dataIndex: 'qty',
        key: 'qty',
        width: 80,
        render (text, record) {
          return {
            props: {
              style: { background: record.color }
            },
            children: (
              <div>
                <InputNumber
                  key={record.productId}
                  value={text}
                  max={record && record.stock > 0 ? record.stock : undefined}
                  onChange={(number) => {
                    handleItemEdit({
                      ...record,
                      qty: parseFloat(number)
                    })
                  }}
                  onFocus={event => handleFocus(event)}
                  onKeyDown={(event) => {
                    if (event.keyCode === 13) {
                      handleChangeQty(record, event)
                    }
                  }}
                />
              </div>
            )
          }
        }
      },
      {
        title: 'Stock',
        dataIndex: 'stock',
        key: 'stock',
        sorter: (a, b) => a.qty - b.qty,
        width: 80
      },
      {
        title: 'Stock in Destination',
        dataIndex: 'qtyStore',
        key: 'qtyStore',
        sorter: (a, b) => a.qty - b.qty,
        width: 130
      },
      {
        title: 'Brand',
        dataIndex: 'brandName',
        key: 'brandName',
        onFilter: (value, record) => {
          return record.brandName.includes(value)
        },
        filters: listBrand ? listBrand.map(item => ({ text: item.brandName, value: item.brandName })) : [],
        width: 100
      },
      {
        title: 'Category',
        dataIndex: 'categoryName',
        key: 'categoryName',
        onFilter: (value, record) => {
          return record.categoryName.includes(value)
        },
        filters: listCategory ? listCategory.map(item => ({ text: item.categoryName, value: item.categoryName })) : [],
        width: 100
      },
      {
        title: 'Location',
        dataIndex: 'locationName',
        key: 'locationName',
        onFilter: (value, record) => {
          if (record.locationName) {
            return record.locationName.includes(value)
          }
          return false
        },
        filters: listStockLocation ? listStockLocation.map(item => ({ text: item.locationName, value: item.locationName })) : [],
        width: 150
      }
    ]

    const modalOpts = {
      ...modalProps,
      onOk: handleOk
    }

    console.log('selectedRowKeys', selectedRowKeys)

    const rowSelection = {
      selectedRowKeys,
      hideDefaultSelections: false,
      onChange: (selectedRowKeys) => {
        updateSelectedKey(selectedRowKeys)
      },
      onSelectAll: (checked, tableData) => {
        const { filters } = this.state
        let listTable = [
          ...listProductDemand
        ]
        if (filters && filters.brandName && filters.brandName.length > 0) {
          listTable = listTable.filter((filtered) => {
            return filters.brandName.includes(filtered.brandName)
          })
        }
        if (filters && filters.categoryName && filters.categoryName.length > 0) {
          listTable = listTable.filter((filtered) => {
            return filters.categoryName.includes(filtered.categoryName)
          })
        }
        if (filters && filters.locationName && filters.locationName.length > 0) {
          listTable = listTable.filter((filtered) => {
            return filters.locationName.includes(filtered.locationName)
          })
        }
        if (tableData.length === selectedRowKeys.length) {
          updateSelectedKey([])
        } else {
          updateSelectedKey(listTable.map(item => item.id))
        }
      }
    }

    return (
      <Modal {...modalOpts}
        footer={[
          <Button key="submit" onClick={() => handleOk()} type="primary" disabled={loading.effects['transferOut/submitProductDemand']} >Process</Button>
        ]}
      >
        <Button key="submit" onClick={() => onGetAll()} type="primary" style={{ marginBottom: '10px' }}>Show All</Button>
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
          onChange={
            (pagination, filters, sorter) => {
              console.log('params', pagination, filters, sorter)
              this.setState({
                filters
              })
            }
          }
        />
      </Modal>
    )
  }
}

ModalDemand.propTypes = {
  form: PropTypes.object.isRequired,
  location: PropTypes.object,
  onOk: PropTypes.func,
  invoiceCancel: PropTypes.object
}

export default Form.create()(ModalDemand)

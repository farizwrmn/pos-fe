import React from 'react'
import { Modal, Table, Button } from 'antd'


const ModalRestore = ({
  list,
  selectedRowKeys,
  updateSelectedKey,
  modalRestoreTableProps,
  onOk,
  ...modalRestoreProps
}) => {
  const handleOk = () => {
    onOk(selectedRowKeys, list)
  }

  const rowSelection = {
    selectedRowKeys,
    hideDefaultSelections: false,
    onChange: (selectedRowKeys) => {
      updateSelectedKey(selectedRowKeys)
    },
    onSelectAll: (checked, tableData) => {
      const { filters } = this.state
      let listTable = [
        ...list
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
      if (tableData.length === selectedRowKeys.length) {
        updateSelectedKey([])
      } else {
        updateSelectedKey(listTable.map(item => item.id))
      }
    }
  }

  const columns = [
    {
      title: 'Trans No',
      dataIndex: 'transNo',
      key: 'transNo'
    },
    {
      title: 'Trans Date',
      dataIndex: 'transDate',
      key: 'transDate'
    },
    {
      title: 'Product',
      dataIndex: 'product.productName',
      key: 'product.productName',
      render: (text, record) => {
        return (
          <div>
            <div><strong>{record.product.productCode}</strong></div>
            <div>{record.product.productName}</div>
          </div>
        )
      }
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      render: (text) => {
        return text.toLocaleString()
      }
    },
    {
      title: 'DPP',
      dataIndex: 'DPP',
      key: 'DPP',
      render: (text) => {
        return text.toLocaleString()
      }
    },
    {
      title: 'PPN',
      dataIndex: 'PPN',
      key: 'PPN',
      render: (text) => {
        return text.toLocaleString()
      }
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (text) => {
        return text.toLocaleString()
      }
    }
  ]

  return (
    <div>
      <Modal
        {...modalRestoreProps}
        footer={[
          <Button key="submit" onClick={() => handleOk()} type="primary" >Restore</Button>
        ]}
      >
        <Table {...modalRestoreTableProps}
          rowSelection={rowSelection}
          onChange={(pagination) => {
            this.setState({
              pagination
            })
          }}
          pagination={false}
          bordered
          columns={columns}
          simple
          scroll={{ x: 1000 }}
          rowKey={record => record.id}
        />
      </Modal>
    </div>
  )
}

export default ModalRestore

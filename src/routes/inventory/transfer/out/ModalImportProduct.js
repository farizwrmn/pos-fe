import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Button } from 'antd'
import moment from 'moment'
import styles from '../../../../themes/index.less'

class ModalDemand extends Component {
  state = {
    filters: {}
  }

  render () {
    const {
      onOk,
      loading,
      ...modalProps
    } = this.props
    const handleOk = () => {
      onOk()
    }

    const columns = [
      {
        title: 'ID',
        dataIndex: 'productId',
        key: 'productId'
      },
      {
        title: 'Code',
        dataIndex: 'productCode',
        key: 'productCode'
      },
      {
        title: 'Name',
        dataIndex: 'productName',
        key: 'productName'
      },
      {
        title: 'Brand',
        dataIndex: 'brandName',
        key: 'brandName'
      },
      {
        title: 'Category',
        dataIndex: 'categoryName',
        key: 'categoryName'
      },
      {
        title: 'Qty',
        dataIndex: 'qty',
        key: 'qty',
        className: styles.alignRight
      },
      {
        title: 'Stock',
        dataIndex: 'stock',
        key: 'stock',
        className: styles.alignRight
      },
      {
        title: 'Created',
        dataIndex: 'createdBy',
        key: 'createdBy'
      },
      {
        title: 'Created At',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: text => moment(text).format('lll')
      }
    ]

    const modalOpts = {
      ...modalProps,
      onOk: handleOk
    }

    return (
      <Modal {...modalOpts}
        footer={[
          <Button key="submit" onClick={() => handleOk()} type="primary" disabled={loading.effects['importTransferOut/queryTransferOut'] || loading.effects['transferOut/submitImportedProduct']}>Process</Button>
        ]}
      >
        <Table
          {...modalProps}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true
          }}
          loading={loading.effects['importTransferOut/queryTransferOut']}
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

export default ModalDemand

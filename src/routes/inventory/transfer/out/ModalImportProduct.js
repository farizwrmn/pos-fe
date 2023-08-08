import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Form, InputNumber, Button } from 'antd'
import moment from 'moment'
import styles from '../../../../themes/index.less'

const FormItem = Form.Item

class ModalDemand extends Component {
  state = {
    filters: {}
  }

  render () {
    const {
      onOk,
      loading,
      listExcel,
      form: {
        getFieldDecorator,
        getFieldsValue,
        validateFields
      },
      ...modalProps
    } = this.props
    const handleOk = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }
        const data = {
          ...getFieldsValue()
        }
        onOk(data.from, data.to)
      })
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
      <Modal {...modalOpts} footer={null}>
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
        <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <FormItem>
            {getFieldDecorator('from', {
              initialValue: 1,
              rules: [
                {
                  required: false,
                  pattern: /^[a-z0-9 -.%#@${}?!/()_]+$/i,
                  message: 'please insert the value'
                }
              ]
            })(<InputNumber maxLength={3} min={0} style={{ alignItems: 'center', justifyContent: 'center' }} />)}
          </FormItem>
          <div style={{ alignItems: 'center', justifyContent: 'center', margin: '0 10px' }}>to</div>
          <FormItem>
            {getFieldDecorator('to', {
              initialValue: modalProps.dataSource.length > 0 ? modalProps.dataSource.length : 1,
              rules: [
                {
                  required: false,
                  pattern: /^[a-z0-9 -.%#@${}?!/()_]+$/i,
                  message: 'please insert the value'
                }
              ]
            })(<InputNumber maxLength={3} min={0} style={{ alignItems: 'center', justifyContent: 'center' }} />)}
          </FormItem>
          <Button
            key="submit"
            onClick={() => handleOk()}
            type="primary"
            style={{ alignItems: 'flex-end', justifyContent: 'flex-end', margin: '0 10px' }}
            disabled={loading.effects['importTransferOut/queryTransferOut']
              || loading.effects['transferOut/submitImportedProduct']}
          >
            Process
          </Button>
        </span>
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

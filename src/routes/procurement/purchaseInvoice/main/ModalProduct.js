import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Icon, Modal, Table, Button } from 'antd'
import { getDistPriceName } from 'utils/string'
import styles from '../../../../themes/index.less'

const FormItem = Form.Item

class ModalProduct extends Component {
  componentDidMount () {
    setTimeout(() => {
      const selector = document.getElementById('productCode')
      if (selector) {
        selector.focus()
        selector.select()
      }
    }, 100)
  }

  render () {
    const {
      onCancel,
      onOk,
      onChooseItem,
      handleReset,
      loadingProduct,
      handleSearch,
      handleChange,
      searchText,
      ...tableProps
    } = this.props
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        render: text => (text || '-').toLocaleString()
      },
      {
        title: 'Product Code',
        dataIndex: 'productCode',
        key: 'productCode'
      }, {
        title: 'Product Name',
        dataIndex: 'productName',
        key: 'productName'
      },
      {
        title: 'Cost Price',
        dataIndex: 'costPrice',
        key: 'costPrice',
        className: styles.alignRight,
        render: text => (text || '-').toLocaleString()
      },
      {
        title: getDistPriceName('sellPrice'),
        dataIndex: 'sellPrice',
        key: 'sellPrice',
        className: styles.alignRight,
        render: text => (text || '-').toLocaleString()
      },
      {
        title: 'Qty',
        dataIndex: 'count',
        key: 'count',
        className: styles.alignRight,
        render: (text) => {
          if (!loadingProduct.effects['pos/showProductQty']) {
            return text || 0
          }
          return <Icon type="loading" />
        }
      }
    ]

    const handleMenuClick = (record) => {
      onChooseItem(record)
    }

    return (
      <Modal
        width="80%"
        height="80%"
        onCancel={onCancel}
        {...tableProps}
        footer={null}
      >
        <Form layout="inline">
          <FormItem>
            <Input placeholder="Search Product Name"
              value={searchText}
              ref={input => input && input.focus()}
              size="small"
              onChange={e => handleChange(e)}
              onPressEnter={handleSearch}
              style={{ marginBottom: 16 }}
            />
          </FormItem>
          <FormItem>
            <Button size="small" type="primary" onClick={handleSearch}>Search</Button>
          </FormItem>
          <FormItem>
            <Button size="small" type="primary" onClick={handleReset}>Reset</Button>
          </FormItem>
        </Form>

        <Table
          {...tableProps}
          bordered
          columns={columns}
          simple
          size="small"
          onRowClick={_record => handleMenuClick(_record)}
        />
      </Modal>
    )
  }
}

ModalProduct.propTypes = {
  form: PropTypes.object.isRequired,
  onOk: PropTypes.func
}

export default ModalProduct

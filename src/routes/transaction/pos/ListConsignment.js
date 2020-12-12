import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Input, Form } from 'antd'
import { connect } from 'dva'
import styles from '../../../themes/index.less'

const FormItem = Form.Item

const ListConsignment = ({ onChooseItem, pos, dispatch, ...tableProps }) => {
  const { searchText } = pos

  const handleMenuClick = (record) => {
    onChooseItem(record)
  }

  const handleChange = (e) => {
    const { value } = e.target

    dispatch({
      type: 'pos/onInputChange',
      payload: {
        searchText: value
      }
    })
  }

  const handleSearch = () => {
    dispatch({
      type: 'pos/getConsignments',
      payload: {
        q: searchText === '' ? null : searchText,
        page: 1
      }
    })
  }

  const handleReset = () => {
    dispatch({
      type: 'pos/updateState',
      payload: {
        searchText: ''
      }
    })
    dispatch({
      type: 'pos/getConsignments',
      payload: {
        page: 1
      }
    })
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Vendor',
      dataIndex: 'product.vendor.name',
      key: 'vendor'
    },
    {
      title: 'Product Code',
      dataIndex: 'product.product_code',
      key: 'productCode'
    },
    {
      title: 'Product Name',
      dataIndex: 'product.product_name',
      key: 'productName'
    },
    {
      title: 'Sell Price',
      dataIndex: 'price',
      key: 'sellPrice',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Dist Price 01',
      dataIndex: 'price_grabfood_gofood',
      key: 'distPrice01',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Qty',
      dataIndex: 'quantity',
      key: 'count',
      className: styles.alignRight
    }
  ]

  return (
    <div>
      <Form layout="inline">
        <FormItem>
          <Input placeholder="Search Product Name"
            value={searchText}
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
        rowKey={record => record.productCode}
        onRowClick={record => handleMenuClick(record)}
      />
    </div>
  )
}

ListConsignment.propTypes = {
  onChooseItem: PropTypes.func,
  location: PropTypes.object,
  pos: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ pos }) => ({ pos }))(ListConsignment)

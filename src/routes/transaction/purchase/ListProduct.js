import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Input, Form, Icon } from 'antd'
import { connect } from 'dva'
import { getDistPriceName } from 'utils/string'
import styles from '../../../themes/index.less'

const FormItem = Form.Item

const ListProduct = ({ onChooseItem, purchase, dispatch, loadingProduct, ...tableProps }) => {
  const { searchText } = purchase
  const { pagination } = tableProps
  const handleMenuClick = (record) => {
    onChooseItem(record)
  }

  const handleChange = (e) => {
    const { value } = e.target

    dispatch({
      type: 'purchase/updateState',
      payload: {
        searchText: value
      }
    })
  }

  const handleSearch = () => {
    dispatch({
      type: 'purchase/getProducts',
      payload: {
        page: 1,
        pageSize: pagination.pageSize,
        q: searchText
      }
    })
  }

  const handleReset = () => {
    dispatch({
      type: 'purchase/getProducts',
      payload: {
        page: 1,
        pageSize: pagination.pageSize,
        q: null
      }
    })
    dispatch({
      type: 'purchase/updateState',
      payload: {
        searchText: null
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
      title: getDistPriceName('distPrice01'),
      dataIndex: 'distPrice01',
      key: 'distPrice01',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: getDistPriceName('distPrice02'),
      dataIndex: 'distPrice02',
      key: 'distPrice02',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: getDistPriceName('distPrice03'),
      dataIndex: 'distPrice03',
      key: 'distPrice03',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: getDistPriceName('distPrice04'),
      dataIndex: 'distPrice04',
      key: 'distPrice04',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: getDistPriceName('distPrice05'),
      dataIndex: 'distPrice05',
      key: 'distPrice05',
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

  return (
    <div>
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
    </div>
  )
}

ListProduct.propTypes = {
  onChooseItem: PropTypes.func,
  location: PropTypes.object,
  purchase: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ purchase }) => ({ purchase }))(ListProduct)

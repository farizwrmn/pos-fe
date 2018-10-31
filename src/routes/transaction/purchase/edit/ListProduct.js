import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Input, Form } from 'antd'
import { connect } from 'dva'
import styles from '../../../../themes/index.less'

const FormItem = Form.Item

const ListProduct = ({ onChooseItem, purchase, dispatch, ...tableProps }) => {
  const { pagination } = tableProps
  const { searchText } = purchase

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
        active: 1,
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
        active: 1,
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
      width: '10%'
    },
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      key: 'productCode',
      width: '25%'
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
      width: '45%'
    },
    {
      title: 'Sell Price',
      dataIndex: 'sellPrice',
      key: 'sellPrice',
      width: '20%',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    }
  ]

  return (
    <div>
      <Form layout="inline">
        <FormItem>
          <Input placeholder="Search Product Name"
            value={searchText}
            size="small"
            onChange={_e => handleChange(_e)}
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
        scroll={{ x: 500, y: 388 }}
        columns={columns}
        simple
        size="small"
        onRowClick={_record => handleMenuClick(_record)}
      />
    </div>
  )
}

ListProduct.propTypes = {
  onChooseItem: PropTypes.func.isRequired,
  location: PropTypes.isRequired,
  purchase: PropTypes.isRequired,
  dispatch: PropTypes.func.isRequired
}

export default connect(({ purchase }) => ({ purchase }))(ListProduct)

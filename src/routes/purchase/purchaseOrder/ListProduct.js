import React from 'react'
import PropTypes from 'prop-types'
import { Table, Icon, Form, Input, Button } from 'antd'
import styles from 'themes/index.less'

const FormItem = Form.Item

const ListProduct = ({ onChooseItem, searchText, dispatch, loadingQty, loadingProduct, ...tableProps }) => {
  const handleMenuClick = (record) => {
    onChooseItem(record)
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
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName'
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      className: styles.alignRight,
      render: (text) => {
        if (!loadingQty.effects['purchaseOrder/showProductQty']) {
          return text || 0
        }
        return <Icon type="loading" />
      }
    }
  ]

  const handleChange = (e) => {
    const { value } = e.target

    dispatch({
      type: 'purchaseOrder/updateState',
      payload: {
        searchText: value
      }
    })
  }

  const handleSearch = () => {
    dispatch({
      type: 'purchaseOrder/queryProduct',
      payload: {
        q: searchText
      }
    })
  }

  const handleReset = () => {
    dispatch({
      type: 'purchaseOrder/updateState',
      payload: {
        listProduct: [],
        pagination: {
          showSizeChanger: true,
          showQuickJumper: true,
          current: 1,
          pageSize: 10,
          total: 0
        }
      }
    })
  }

  const { pagination } = tableProps

  return (
    <div>
      {pagination && pagination.current > 0 && (
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
            <Button disabled={loadingQty.effects['purchaseOrder/queryProduct'] || loadingQty.effects['purchaseOrder/showProductQty']} size="small" type="primary" onClick={handleSearch}>Search</Button>
          </FormItem>
          <FormItem>
            <Button disabled={loadingQty.effects['purchaseOrder/queryProduct'] || loadingQty.effects['purchaseOrder/showProductQty']} size="small" type="primary" onClick={handleReset}>Reset</Button>
          </FormItem>
        </Form>
      )}

      <Table
        {...tableProps}
        bordered
        loading={loadingProduct.effects['purchaseOrder/queryProduct'] || loadingProduct.effects['pos/getProducts'] || loadingProduct.effects['pos/checkQuantityNewProduct'] || loadingProduct.effects['pos/checkQuantityEditProduct']}
        columns={columns}
        simple
        size="small"
        rowKey={record => record.productCode}
        onRowClick={record => handleMenuClick(record)}
      />
    </div>
  )
}

ListProduct.propTypes = {
  onChooseItem: PropTypes.func,
  location: PropTypes.object,
  pos: PropTypes.object,
  dispatch: PropTypes.func
}

export default ListProduct

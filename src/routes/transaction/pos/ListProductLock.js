import React from 'react'
import PropTypes from 'prop-types'
import { Table, Icon, Button, Input, Form } from 'antd'
import { connect } from 'dva'
import { lstorage } from 'utils'
import { getDistPriceName } from 'utils/string'
import styles from '../../../themes/index.less'

const FormItem = Form.Item

const ListProduct = ({ onChooseItem, showProductQty, pos, loading, dispatch, ...tableProps }) => {
  const { searchText } = pos
  const { dataSource } = tableProps

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
      type: 'pos/getProducts',
      payload: {
        q: searchText === '' ? null : searchText,
        active: 1,
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
      type: 'pos/getProducts',
      payload: {
        page: 1,
        active: 1
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
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName'
    },
    {
      title: getDistPriceName('sellPrice'),
      dataIndex: 'sellPrice',
      key: 'sellPrice',
      className: styles.alignRight,
      render: (text, record) => {
        let currentPrice = text
        if (record && record.storePrice && record.storePrice[0]) {
          const price = record.storePrice.filter(filtered => filtered.storeId === lstorage.getCurrentUserStore())
          if (price && price[0]) {
            currentPrice = price[0].sellPrice
          }
        }
        return (currentPrice || '-').toLocaleString()
      }
    },
    {
      title: getDistPriceName('distPrice01'),
      dataIndex: 'distPrice01',
      key: 'distPrice01',
      className: styles.alignRight,
      render: (text, record) => {
        let currentPrice = text
        if (record && record.storePrice && record.storePrice[0]) {
          const price = record.storePrice.filter(filtered => filtered.storeId === lstorage.getCurrentUserStore())
          if (price && price[0]) {
            currentPrice = price[0].distPrice01
          }
        }
        return (currentPrice || '-').toLocaleString()
      }
    },
    {
      title: getDistPriceName('distPrice02'),
      dataIndex: 'distPrice02',
      key: 'distPrice02',
      className: styles.alignRight,
      render: (text, record) => {
        let currentPrice = text
        if (record && record.storePrice && record.storePrice[0]) {
          const price = record.storePrice.filter(filtered => filtered.storeId === lstorage.getCurrentUserStore())
          if (price && price[0]) {
            currentPrice = price[0].distPrice02
          }
        }
        return (currentPrice || '-').toLocaleString()
      }
    },
    {
      title: getDistPriceName('distPrice03'),
      dataIndex: 'distPrice03',
      key: 'distPrice03',
      className: styles.alignRight,
      render: (text, record) => {
        let currentPrice = text
        if (record && record.storePrice && record.storePrice[0]) {
          const price = record.storePrice.filter(filtered => filtered.storeId === lstorage.getCurrentUserStore())
          if (price && price[0]) {
            currentPrice = price[0].distPrice03
          }
        }
        return (currentPrice || '-').toLocaleString()
      }
    },
    {
      title: getDistPriceName('distPrice04'),
      dataIndex: 'distPrice04',
      key: 'distPrice04',
      className: styles.alignRight,
      render: (text, record) => {
        let currentPrice = text
        if (record && record.storePrice && record.storePrice[0]) {
          const price = record.storePrice.filter(filtered => filtered.storeId === lstorage.getCurrentUserStore())
          if (price && price[0]) {
            currentPrice = price[0].distPrice04
          }
        }
        return (currentPrice || '-').toLocaleString()
      }
    },
    {
      title: getDistPriceName('distPrice05'),
      dataIndex: 'distPrice05',
      key: 'distPrice05',
      className: styles.alignRight,
      render: (text, record) => {
        let currentPrice = text
        if (record && record.storePrice && record.storePrice[0]) {
          const price = record.storePrice.filter(filtered => filtered.storeId === lstorage.getCurrentUserStore())
          if (price && price[0]) {
            currentPrice = price[0].distPrice05
          }
        }
        return (currentPrice || '-').toLocaleString()
      }
    },
    {
      title: getDistPriceName('distPrice06'),
      dataIndex: 'distPrice06',
      key: 'distPrice06',
      className: styles.alignRight,
      render: (text, record) => {
        let currentPrice = text
        if (record && record.storePrice && record.storePrice[0]) {
          const price = record.storePrice.filter(filtered => filtered.storeId === lstorage.getCurrentUserStore())
          if (price && price[0]) {
            currentPrice = price[0].distPrice06
          }
        }
        return (currentPrice || '-').toLocaleString()
      }
    },
    {
      title: getDistPriceName('distPrice07'),
      dataIndex: 'distPrice07',
      key: 'distPrice07',
      className: styles.alignRight,
      render: (text, record) => {
        let currentPrice = text
        if (record && record.storePrice && record.storePrice[0]) {
          const price = record.storePrice.filter(filtered => filtered.storeId === lstorage.getCurrentUserStore())
          if (price && price[0]) {
            currentPrice = price[0].distPrice07
          }
        }
        return (currentPrice || '-').toLocaleString()
      }
    },
    {
      title: getDistPriceName('distPrice08'),
      dataIndex: 'distPrice08',
      key: 'distPrice08',
      className: styles.alignRight,
      render: (text, record) => {
        let currentPrice = text
        if (record && record.storePrice && record.storePrice[0]) {
          const price = record.storePrice.filter(filtered => filtered.storeId === lstorage.getCurrentUserStore())
          if (price && price[0]) {
            currentPrice = price[0].distPrice08
          }
        }
        return (currentPrice || '-').toLocaleString()
      }
    },
    {
      title: 'Qty',
      dataIndex: 'count',
      key: 'count',
      className: styles.alignRight,
      render: (text) => {
        if (!loading.effects['pos/showProductQty']) {
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
        <FormItem>
          <Button
            size="small"
            onClick={() => showProductQty(dataSource)}
            loading={loading.effects['pos/showProductQty']}
            disabled={loading.effects['pos/showProductQty']}
          >
            Show Qty
          </Button>
        </FormItem>
      </Form>

      <Table
        {...tableProps}
        bordered
        loading={loading.effects['pos/getProducts'] || loading.effects['pos/checkQuantityNewProduct'] || loading.effects['pos/checkQuantityEditProduct']}
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

export default connect(({ pos }) => ({ pos }))(ListProduct)

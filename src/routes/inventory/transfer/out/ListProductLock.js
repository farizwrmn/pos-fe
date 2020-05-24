import React from 'react'
import PropTypes from 'prop-types'
import { Table, Icon, Button, Input, Form } from 'antd'
import { connect } from 'dva'
import styles from '../../../../themes/index.less'

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
    }, {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName'
    }, {
      title: 'Sell Price',
      dataIndex: 'sellPrice',
      key: 'sellPrice',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Dist Price 01',
      dataIndex: 'distPrice01',
      key: 'distPrice01',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Dist Price 02',
      dataIndex: 'distPrice02',
      key: 'distPrice02',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Dist Price 03',
      dataIndex: 'distPrice03',
      key: 'distPrice03',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
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

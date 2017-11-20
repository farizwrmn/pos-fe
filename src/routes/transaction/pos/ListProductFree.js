import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Button, Input, Icon, Form } from 'antd'
import { connect } from 'dva'
import { DropOption } from 'components'

const FormItem = Form.Item

const ListProductFree = ({ onChooseItem, pos, dispatch, ...listProps }) => {
  const { searchText, filtered, tmpProductList } = pos
  console.log('props', listProps)
  const handleMenuClick = (record, e) => {
    onChooseItem(record)
  }

  const handleChange = (e) => {
    const { value } = e.target

    dispatch({
      type: 'pos/onInputChange',
      payload: {
        searchText: value,
      },
    })
  }

  const handleSearch = () => {
    dispatch({
      type: 'pos/onProductSearch',
      payload: {
        searchText: searchText,
        tmpProductList: tmpProductList,
      },
    })
  }

  const handleReset = () => {
    dispatch({
      type: 'pos/onProductReset',
      payload: {
        searchText: '',
        tmpProductList: tmpProductList,
      },
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
    }, {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
      width: '45%'
    }, {
      title: 'Sell Price',
      dataIndex: 'sellPrice',
      key: 'sellPrice',
      width: '20%'
    }
  ]

  return (
    <div>
      <Form layout="inline">
        <FormItem>
          <Input placeholder="Search Product Name"
                 value={searchText}
                 size="small"
                 onChange={(e) => handleChange(e)}
                 onPressEnter={handleSearch}
                 style={{ marginBottom: 16 }} />
        </FormItem>
        <FormItem>
          <Button size="small" type="primary" onClick={handleSearch}>Search</Button>
        </FormItem>
        <FormItem>
          <Button size="small" type="primary" onClick={handleReset}>Reset</Button>
        </FormItem>
      </Form>

      <Table
        {...listProps}
        bordered
        scroll={{ x: 500, y: 388}}
        columns={columns}
        simple
        size="small"
        rowKey={record => record.productCode}
        onRowClick={(record) => handleMenuClick(record)}
      />
    </div>
  )
}

ListProductFree.propTypes = {
  onChooseItem: PropTypes.func,
  location: PropTypes.object,
  pos: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ pos }) => ({ pos }))(ListProductFree)

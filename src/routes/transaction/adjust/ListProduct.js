import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Button, Input, Icon, Form } from 'antd'
import { connect } from 'dva'
import { DropOption } from 'components'

const FormItem = Form.Item

const ListProduct = ({onChooseItem, purchase, dispatch, ...tableProps}) => {
  const {searchText, filtered, tmpProductList} = purchase

  const handleMenuClick = (record) => {
    onChooseItem(record)
  }

  const handleChange = (e) => {
    const {value} = e.target

    dispatch({
      type: 'purchase/onInputChange',
      payload: {
        searchText: value,
      },
    })
  }

  const handleSearch = () => {
    dispatch({
      type: 'purchase/onProductSearch',
      payload: {
        searchText: searchText,
        tmpProductList: tmpProductList,
      },
    })
  }

  const handleReset = () => {
    dispatch({
      type: 'purchase/onProductReset',
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
      title: 'Cost Price',
      dataIndex: 'sellPrice',
      key: 'sellPrice',
      width: '20%'
    }
  ]

  return (
    <div>
      <Form layout="inline">
        <FormItem>
          <Input placeholder="Search Member Name"
                 value={searchText}
                 size="small"
                 onChange={(e) => handleChange(e)}
                 onPressEnter={handleSearch}
                 style={{marginBottom: 16}}/>
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
        scroll={{x: 500, y: 388}}
        columns={columns}
        simple
        size="small"
        rowKey={record => record.productCode}
        onRowClick={(record) => handleMenuClick(record)}
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

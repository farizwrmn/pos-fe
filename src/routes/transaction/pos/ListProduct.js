import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Button, Input, Icon, Form } from 'antd'
import { connect } from 'dva'
import { DropOption } from 'components'

const FormItem = Form.Item

const ListProduct = ({ onChooseItem, pos, dispatch, ...tableProps }) => {
  const { searchText, tmpList } = pos

  const handleMenuClick = (record, e) => {
    onChooseItem(record)
  }

  const handleChange = (e) => {
    const {value} = e.target

    dispatch({
      type: 'pos/onInputChange',
      payload: {
        searchText: value,
      },
    })
  }

  const handleSearch = () => {
    dispatch({
      type: 'pos/onSearch',
      payload: {
        searchText: searchText,
        tmpList: tmpList,
      },
    })
  }

  const handleReset = () => {
    dispatch({
      type: 'pos/onReset',
      payload: {
        searchText: '',
        tmpList: tmpList,
      },
    })
  }

  const columns = [
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      key: 'productCode',
    }, {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
    }, {
      title: 'Sell Price',
      dataIndex: 'sellPrice',
      key: 'sellPrice'
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
        {...tableProps}
        bordered
        columns={columns}
        simple
        size="small"
        rowKey={record => record.employeeId}
        onRowClick={(record) => handleMenuClick(record)}
      />
    </div>
  )
}

ListProduct.propTypes = {
  onChooseItem: PropTypes.func,
  location: PropTypes.object,
  pos: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ pos }) => ({ pos }))(ListProduct)

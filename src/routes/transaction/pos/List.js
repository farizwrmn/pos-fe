import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Input, Form } from 'antd'
import { connect } from 'dva'
import styles from '../../../themes/index.less'

const FormItem = Form.Item

const List = ({ onChooseItem, isMotion, pos, dispatch, location, ...tableProps }) => {
  const { searchText, tmpList } = pos

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
      type: 'pos/onSearch',
      payload: {
        searchText,
        tmpList
      }
    })
  }

  const handleReset = () => {
    dispatch({
      type: 'pos/onReset',
      payload: {
        searchText: '',
        tmpList
      }
    })
  }

  const columns = [
    {
      title: 'Operation',
      key: 'operation',
      width: 100,
      render: () => {
        return <Button size="small" onClick={e => handleMenuClick(e)} > Choose </Button>
      }
    }, {
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
      />
    </div>
  )
}

List.propTypes = {
  onChooseItem: PropTypes.func,
  isMotion: PropTypes.bool,
  location: PropTypes.object,
  pos: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ pos }) => ({ pos }))(List)

import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Button, Input, Icon, Form } from 'antd'
import { connect } from 'dva'
import styles from './List.less'
import classnames from 'classnames'
import AnimTableBody from 'components/DataTable/AnimTableBody'
import { DropOption } from 'components'

const FormItem = Form.Item

const List = ({ onChooseItem, isMotion, pos, dispatch, location, ...tableProps }) => {
  const { filterDropdownVisible, searchText, filtered, list, tmpList } = pos

  console.log('listss', tableProps)
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
      title: 'Operation',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return <Button size="small" onClick={e => handleMenuClick(record, e)} > Choose </Button>
      },
    }, {
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

  const getBodyWrapperProps = {
    page: location.query.page,
    current: tableProps.pagination.current,
  }

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
  dispatch: PropTypes.func,
}

export default connect(({ pos }) => ({ pos }))(List)

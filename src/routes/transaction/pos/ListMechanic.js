import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Input, Form } from 'antd'
import { connect } from 'dva'

const FormItem = Form.Item

const ListMechanic = ({ onChooseItem, pos, dispatch, ...tableProps }) => {
  const { searchText, tmpMechanicList } = pos

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
      type: 'pos/onMechanicSearch',
      payload: {
        searchText,
        tmpMechanicList
      }
    })
  }

  const handleReset = () => {
    dispatch({
      type: 'pos/onMechanicReset',
      payload: {
        searchText: '',
        tmpMechanicList
      }
    })
  }

  const columns = [
    {
      title: 'Code',
      dataIndex: 'employeeId',
      key: 'employeeId'
    }, {
      title: 'Name',
      dataIndex: 'employeeName',
      key: 'employeeName'
    }, {
      title: 'Position',
      dataIndex: 'positionName',
      key: 'positionName'
    }
  ]

  return (
    <div>
      <Form layout="inline">
        <FormItem>
          <Input placeholder="Search Mechanic Name"
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
        rowKey={record => record.employeeId}
        onRowClick={record => handleMenuClick(record)}
      />
    </div>
  )
}

ListMechanic.propTypes = {
  onChooseItem: PropTypes.func,
  location: PropTypes.object,
  pos: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ pos }) => ({ pos }))(ListMechanic)

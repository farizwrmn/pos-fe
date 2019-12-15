import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Input, Form } from 'antd'
import { connect } from 'dva'

const FormItem = Form.Item

const ListUnit = ({ onChooseItem, pos, dispatch, location, ...tableProps }) => {
  const { searchText, tmpMemberUnit } = pos
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
      type: 'pos/onUnitSearch',
      payload: {
        searchText,
        tmpMemberUnit
      }
    })
  }
  const handleReset = () => {
    dispatch({
      type: 'pos/onUnitReset',
      payload: {
        searchText: '',
        tmpMemberUnit
      }
    })
  }

  const columns = [
    {
      title: 'Unit No',
      dataIndex: 'policeNo',
      key: 'policeNo',
      width: 100
    },
    {
      title: 'Merk',
      dataIndex: 'merk',
      key: 'merk',
      width: 250
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
      width: 200
    }
  ]

  return (
    <div>
      <Form layout="inline">
        <FormItem>
          <Input placeholder="Search Unit Name"
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
        onRowClick={record => handleMenuClick(record)}
      />
    </div>
  )
}

ListUnit.propTypes = {
  onChooseItem: PropTypes.func,
  location: PropTypes.object,
  pos: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ pos }) => ({ pos }))(ListUnit)

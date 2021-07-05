import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Input, Form } from 'antd'
import { connect } from 'dva'

const FormItem = Form.Item

const ListMember = ({ onChooseItem, pos, dispatch, location, ...tableProps }) => {
  const { searchText } = pos

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
      type: 'pos/getMembers',
      payload: {
        q: searchText === '' ? null : searchText,
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
      type: 'pos/getMembers',
      payload: {
        page: 1
      }
    })
  }

  const columns = [
    {
      title: 'Member Code',
      dataIndex: 'memberCode',
      key: 'memberCode',
      width: '200px'
    }, {
      title: 'Member Name',
      dataIndex: 'memberName',
      key: 'memberName',
      width: '250px'
    }, {
      title: 'Address',
      dataIndex: 'address01',
      key: 'address01',
      width: '400px'
    }, {
      title: 'Mobile',
      dataIndex: 'mobileNumber',
      key: 'mobileNumber',
      width: '200px'
    }, {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '200px'
    }, {
      title: 'Type',
      dataIndex: 'memberTypeName',
      key: 'memberTypeName',
      width: '200px'
    }
  ]

  return (
    <div>
      <Form layout="inline">
        <FormItem>
          <Input placeholder="Search Member Name"
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
        scroll={{ x: '640px', y: 388 }}
        size="small"
        rowKey={record => record.memberCode}
        onRowClick={record => handleMenuClick(record)}
      />
    </div>
  )
}

ListMember.propTypes = {
  onChooseItem: PropTypes.func,
  location: PropTypes.object,
  pos: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ pos }) => ({ pos }))(ListMember)

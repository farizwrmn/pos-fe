import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Input, Form } from 'antd'
import { connect } from 'dva'

const FormItem = Form.Item

const ListMember = ({ onChooseItem, pos, dispatch, location, ...tableProps }) => {
  const { searchText, tmpMemberList } = pos

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
      type: 'pos/onMemberSearch',
      payload: {
        searchText,
        tmpMemberList
      }
    })
  }

  const handleReset = () => {
    dispatch({
      type: 'pos/onMemberReset',
      payload: {
        searchText: '',
        tmpMemberList
      }
    })
  }

  const columns = [
    {
      title: 'Member Code',
      dataIndex: 'memberCode',
      key: 'memberCode'
    }, {
      title: 'Member Name',
      dataIndex: 'memberName',
      key: 'memberName'
    }, {
      title: 'Address',
      dataIndex: 'address01',
      key: 'address01'
    }, {
      title: 'Mobile',
      dataIndex: 'mobileNumber',
      key: 'mobileNumber'
    }, {
      title: 'Type',
      dataIndex: 'memberTypeName',
      key: 'memberTypeName'
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

import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Button, Input, Icon, Form } from 'antd'
import { connect } from 'dva'
import { DropOption } from 'components'

const FormItem = Form.Item

const ListMember = ({ onChooseItem, pos, dispatch, location, ...tableProps }) => {
  const { searchText, filtered, tmpMemberList } = pos

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
    console.log('tmpMemberList', tmpMemberList)
    dispatch({
      type: 'pos/onMemberSearch',
      payload: {
        searchText: searchText,
        tmpMemberList: tmpMemberList,
      },
    })
  }

  const handleReset = () => {
    dispatch({
      type: 'pos/onMemberReset',
      payload: {
        searchText: '',
        tmpMemberList: tmpMemberList,
      },
    })
  }

  const columns = [
    {
      title: 'Member Code',
      dataIndex: 'memberCode',
      key: 'memberCode',
    }, {
      title: 'Member Name',
      dataIndex: 'memberName',
      key: 'memberName',
    }, {
      title: 'Address',
      dataIndex: 'address01',
      key: 'address01',
    }, {
      title: 'Mobile',
      dataIndex: 'mobileNumber',
      key: 'mobileNumber',
    },
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
        rowKey={record => record.memberCode}
        onRowClick={(record) => handleMenuClick(record)}
      />
    </div>
  )
}

ListMember.propTypes = {
  onChooseItem: PropTypes.func,
  location: PropTypes.object,
  pos: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ pos }) => ({ pos }))(ListMember)

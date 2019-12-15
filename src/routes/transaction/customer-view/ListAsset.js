import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Input, Form } from 'antd'
import { connect } from 'dva'

const FormItem = Form.Item

const ListAsset = ({ onChooseItem, dispatch, location, pos, ...tableProps }) => {
  const { searchText } = pos

  const columns = [
    {
      title: 'Police No',
      dataIndex: 'policeNo',
      key: 'policeNo'
    },
    {
      title: 'Member Code',
      dataIndex: 'memberCode',
      key: 'memberCode'
    },
    {
      title: 'Member Name',
      dataIndex: 'memberName',
      key: 'memberName'
    }, {
      title: 'Address',
      dataIndex: 'address01',
      key: 'address01'
    },
    {
      title: 'Mobile',
      dataIndex: 'mobileNumber',
      key: 'mobileNumber'
    }
  ]

  const handleMenuClick = (record) => {
    onChooseItem(record)
  }

  const handleSearch = () => {
    dispatch({
      type: 'pos/getMemberAssets',
      payload: {
        license: searchText
      }
    })
  }

  const handleReset = () => {
    dispatch({
      type: 'pos/getMemberAssets',
      payload: {
        license: '',
        searchText: ''
      }
    })
  }

  const handleChange = (e) => {
    const { value } = e.target
    dispatch({
      type: 'pos/updateState',
      payload: {
        searchText: value
      }
    })
  }

  return (
    <div>
      <Form layout="inline">
        <FormItem>
          <Input placeholder="Search Police No"
            size="small"
            value={searchText}
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
        rowKey={record => record.memberUnitId}
        onRowClick={record => handleMenuClick(record)}
      />
    </div>
  )
}

ListAsset.propTypes = {
  onChooseItem: PropTypes.func,
  location: PropTypes.object,
  pos: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ pos }) => ({ pos }))(ListAsset)

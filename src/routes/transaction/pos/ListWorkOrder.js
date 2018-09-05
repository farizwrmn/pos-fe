import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Input, Form } from 'antd'
import { formatDate } from 'utils'
import { connect } from 'dva'

const FormItem = Form.Item

const ListWorkOrder = ({ onChooseItem, pos, dispatch, location, ...tableProps }) => {
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
      title: 'Wo No',
      dataIndex: 'woNo',
      key: 'woNo',
      width: '140px'
    },
    {
      title: 'Name',
      dataIndex: 'memberName',
      key: 'memberName',
      width: '140px'
    },
    {
      title: 'Police No',
      dataIndex: 'policeNo',
      key: 'policeNo',
      width: '140px'
    },
    {
      title: 'Wo Date',
      dataIndex: 'woDate',
      key: 'woDate',
      width: '140px',
      render: text => formatDate(text)
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '140px',
      render: (text) => {
        switch (Number(text)) {
          case 0:
            return 'In Progress'
          case 1:
            return 'Done'
          default:
            break
        }
      }
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
        onRowClick={record => handleMenuClick(record)}
      />
    </div>
  )
}

ListWorkOrder.propTypes = {
  onChooseItem: PropTypes.func,
  location: PropTypes.object,
  pos: PropTypes.object.isRequired,
  workorder: PropTypes.object.isRequired,
  dispatch: PropTypes.func
}

export default connect(({ pos, workorder }) => ({ pos, workorder }))(ListWorkOrder)

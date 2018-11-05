import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table, Button, Input, Form, Tag } from 'antd'
import styles from '../../../themes/index.less'

const FormItem = Form.Item

const ListService = ({ onChooseItem, pos, dispatch, ...tableProps }) => {
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
      type: 'pos/getServices',
      payload: {
        q: searchText,
        active: 1
      }
    })
  }

  const handleReset = () => {
    // dispatch({
    //   type: 'pos/onServiceReset',
    //   payload: {
    //     searchText: '',
    //     tmpServiceList
    //   }
    // })
    dispatch({
      type: 'pos/getServices',
      payload: {
        page: 1,
        active: 1
      }
    })
  }
  // {
  //   title: 'Operation',
  //   key: 'operation',
  //   width: 100,
  //   render: (text, record) => {
  //     return <Button onClick={e => handleMenuClick(record, e)} > Choose </Button>
  //   },
  // },
  const columns = [
    {
      title: 'No',
      dataIndex: 'id',
      key: 'id',
      width: 175
    },
    {
      title: 'Service Code',
      dataIndex: 'serviceCode',
      key: 'serviceCode',
      width: 175
    },
    {
      title: 'Description',
      dataIndex: 'serviceName',
      key: 'serviceName',
      width: 400
    },
    {
      title: 'Active',
      dataIndex: 'active',
      key: 'active',
      width: 125,
      render: text =>
        (<span>
          <Tag color={Number(text) ? 'blue' : 'red'}>
            {Number(text) ? 'Active' : 'Non-Active'}
          </Tag>
        </span>)
    },
    {
      title: 'Service Cost',
      dataIndex: 'serviceCost',
      key: 'serviceCost',
      width: 125,
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    }
  ]
  return (
    <div>
      <Form layout="inline">
        <FormItem>
          <Input placeholder="Search Service Name"
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
        scroll={{ x: 700, y: 388 }}
        columns={columns}
        simple
        size="small"
        rowKey={record => record.serviceCode}
        onRowClick={record => handleMenuClick(record)}
      />
    </div>
  )
}

ListService.propTypes = {
  onChooseItem: PropTypes.func,
  location: PropTypes.object,
  pos: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ pos }) => ({ pos }))(ListService)

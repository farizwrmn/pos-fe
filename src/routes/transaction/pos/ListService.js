import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Button, Input, Icon, Form } from 'antd'
import { connect } from 'dva'
import { DropOption } from 'components'
// import styles from './List.less'
// import classnames from 'classnames'
// import AnimTableBody from 'components/DataTable/AnimTableBody'

const FormItem = Form.Item

const ListService = ({ onChooseItem, pos, dispatch, location, ...tableProps }) => {
  const { searchText, filtered, tmpServiceList } = pos

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
    console.log('Search Service')
    dispatch({
      type: 'pos/onServiceSearch',
      payload: {
        searchText: searchText,
        tmpServiceList: tmpServiceList,
      },
    })
  }

  const handleReset = () => {
    dispatch({
      type: 'pos/onServiceReset',
      payload: {
        searchText: '',
        tmpServiceList: tmpServiceList,
      },
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
    }, {
      title: 'Service Cost',
      dataIndex: 'serviceCost',
      key: 'serviceCost',
      width: 125
    },
  ]

  // const getBodyWrapperProps = {
  //   page: location.query.page,
  //   current: tableProps.pagination.current,
  // }
  //
  // const getBodyWrapper = body => { return isMotion ? <AnimTableBody {...getBodyWrapperProps} body={body} /> : body }
// className={classnames({ [styles.table]: true })}
  return (
    <div>
      <Form layout="inline">
        <FormItem>
          <Input placeholder="Search Service Name"
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
        scroll={{ x: 700, y: 388}}
        columns={columns}
        simple
        size="small"
        rowKey={record => record.serviceCode}
        onRowClick={(record) => handleMenuClick(record)}
      />
    </div>
  )
}

ListService.propTypes = {
  onChooseItem: PropTypes.func,
  location: PropTypes.object,
  pos: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ pos }) => ({ pos }))(ListService)

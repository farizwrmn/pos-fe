import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Button } from 'antd'
import styles from './List.less'
import classnames from 'classnames'
import AnimTableBody from 'components/DataTable/AnimTableBody'
import { DropOption } from 'components'

const ListService = ({ onChooseItem, isMotion, location, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    onChooseItem(record)
  }

  const columns = [
    {
      title: 'Operation',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return <Button onClick={e => handleMenuClick(record, e)} > Choose </Button>
      },
    }, {
      title: 'Service Code',
      dataIndex: 'serviceId',
      key: 'serviceId',
    }, {
      title: 'Description',
      dataIndex: 'serviceDescription',
      key: 'serviceDescription',
    }, {
      title: 'Normal Price',
      dataIndex: 'normalPrice',
      key: 'normalPrice',
    }, {
      title: 'Member Price',
      dataIndex: 'memberPrice',
      key: 'memberPrice',
    },
  ]

  const getBodyWrapperProps = {
    page: location.query.page,
    current: tableProps.pagination.current,
  }

  const getBodyWrapper = body => { return isMotion ? <AnimTableBody {...getBodyWrapperProps} body={body} /> : body }

  return (
    <div>
      <Table
        {...tableProps}
        className={classnames({ [styles.table]: true })}
        bordered
        scroll={{ x: 1250 }}
        columns={columns}
        simple
        rowKey={record => record.employeeId}
        getBodyWrapper={getBodyWrapper}
      />
    </div>
  )
}

ListService.propTypes = {
  onChooseItem: PropTypes.func,
  isMotion: PropTypes.bool,
  location: PropTypes.object,
}

export default ListService

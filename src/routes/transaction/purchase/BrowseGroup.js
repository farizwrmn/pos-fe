import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Tag, Button, Icon, Popconfirm } from 'antd'
import { DropOption } from 'components'
import { Link } from 'dva/router'
import moment from 'moment'

const ButtonGroup = Button.Group
const confirm = Modal.confirm

const BrowseGroup = ({
  ...tableProps }) => {
  const columns = [
    {
      title: 'Code',
      dataIndex: 'groupCode',
      key: 'groupCode',
      width: '5%',
      render: (text, record) => <Link to={`user/${record.userid}`}>{text}</Link>,
    }, {
      title: 'Type',
      dataIndex: 'groupName',
      key: 'groupName',
      width: '20%',
    },
  ]
  return (
    <div>
      <Table
        {...tableProps}
        bordered
        scroll={{ x: 300, y: 240 }}
        columns={columns}
        simple
        rowKey={record => record.userId}
      />
    </div>
  )
}

BrowseGroup.propTypes = {
  onAddItem: PropTypes.func,
  onEditItem: PropTypes.func,
  onDeleteItem: PropTypes.func,
  location: PropTypes.object,
}

export default BrowseGroup

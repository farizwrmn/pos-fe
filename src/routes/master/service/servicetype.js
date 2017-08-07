import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Tag, Button, Icon, Popconfirm } from 'antd'
import { DropOption } from 'components'
import { Link } from 'dva/router'
import moment from 'moment'

const ButtonGroup = Button.Group
const confirm = Modal.confirm

const BrowseType = ({
  ...tableProps }) => {
  const columns = [{
      dataIndex: 'miscName',
      key: 'miscName',
    },
  ]
  return (
    <div>
      <Table
        {...tableProps}
        bordered
        scroll={{ x: 200, y: 240 }}
        columns={columns}
        simple
      />
    </div>
  )
}

BrowseType.propTypes = {
  onAddItem: PropTypes.func,
  onEditItem: PropTypes.func,
  onDeleteItem: PropTypes.func,
  location: PropTypes.object,
}

export default BrowseType

import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Tag, Button, Icon, Popconfirm } from 'antd'
import { DropOption } from 'components'
import { Link } from 'dva/router'
import moment from 'moment'

const ButtonGroup = Button.Group
const confirm = Modal.confirm

const Sellprice = ({
  ...tableProps }) => {
  const columns = [{
      dataIndex: 'miscName',
      key: 'miscName',
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
      />
    </div>
  )
}

Sellprice.propTypes = {
  onAddItem: PropTypes.func,
  onEditItem: PropTypes.func,
  onDeleteItem: PropTypes.func,
  location: PropTypes.object,
}

export default Sellprice

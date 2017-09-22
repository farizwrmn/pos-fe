/**
 * Created by Veirry on 22/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import { DropOption } from 'components'
import moment from 'moment'

const confirm = Modal.confirm

const Browse = ({
  onEditItem, onDeleteItem,
  ...tableProps }) => {
  const hdlDropOptionClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: `Are you sure delete this record [ ${record.miscCode} - ${record.miscName} ] ?`,
        onOk () {
          onDeleteItem(record.miscCode, record.miscName)
        },
      })
    }
  }
  const columns = [
    {
      title: 'Start',
      dataIndex: 'startPeriod',
      key: 'startPeriod',
      width: 190,
      render: _text => `${moment(_text).format('ll LTS')}`,
    },
    {
      title: 'End',
      dataIndex: 'endPeriod',
      key: 'endPeriod',
      width: 190,
      render: _text => `${moment(_text).format('ll LTS')}`,
    },
    {
      title: 'Desc',
      dataIndex: 'memo',
      key: 'memo',
      width: 200,
    },
    {
      title: 'Created',
      children: [
        {
          title: 'By',
          dataIndex: 'createdBy',
          key: 'createdBy',
          width: 100,
        },
        {
          title: 'Time',
          dataIndex: 'createdAt',
          key: 'createdAt',
          width: 200,
          render: _text => `${moment(_text).format('LL LTS')}`,
        },
      ],
    },
    {
      title: 'Updated',
      children: [
        {
          title: 'By',
          dataIndex: 'updatedBy',
          key: 'updatedBy',
          width: 100,
        }, {
          title: 'Time',
          dataIndex: 'updatedAt',
          key: 'updatedAt',
          width: 200,
          render: _text => `${moment(_text).format('LL LTS')}`,
        },
      ],
    },
    {
      title: 'Operation',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        return <DropOption onMenuClick={e => hdlDropOptionClick(record, e)}
          menuOptions={[
            { key: '1', name: 'Edit', icon: 'edit' },
          ]}
        />
      },
    },
  ]
  return (
    <div>
      <Table
        {...tableProps}
        bordered
        scroll={{ x: '1280px', y: '240px' }}
        columns={columns}
        simple
        rowKey={record => record.userId}
      />
    </div>
  )
}

Browse.propTypes = {
  onEditItem: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
}

export default Browse

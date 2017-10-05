/**
 * Created by Veirry on 22/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Input, Button, Row, Col } from 'antd'
import { DropOption } from 'components'
import moment from 'moment'

const confirm = Modal.confirm

const Browse = ({
  onEndPeriod, onStartPeriod,
  ...tableProps }) => {
  const hdlDropOptionClick = (record, e) => {
    if (e.key === '1') {
      onEndPeriod(record)
    } else if (e.key === '2') {
      confirm({
        title: `Are you sure delete this record [ ${record.miscCode} - ${record.miscName} ] ?`,
        onOk () {
          // onDeleteItem(record.miscCode, record.miscName)
        },
      })
    }
  }
  const handleStartPeriod = () => {
    onStartPeriod()
  }
  const handleEndPeriod = () => {
    onEndPeriod()
  }
  const columns = [
    {
      title: 'No',
      dataIndex: 'accountNumber',
      key: 'accountNumber',
      width: 200,
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
      key: 'reference',
      width: 200,
    },
    {
      title: 'Start',
      dataIndex: 'startPeriod',
      key: 'startPeriod',
      width: 190,
      sorter: (a, b) => moment.utc(a.startPeriod, 'YYYY/MM/DD') - moment.utc(b.startPeriod, 'YYYY/MM/DD'),
      render: _text => `${moment(_text).format('ll LTS')}`,
    },
    {
      title: 'End',
      dataIndex: 'endPeriod',
      key: 'endPeriod',
      width: 190,
      sorter: (a, b) => moment.utc(a.endPeriod, 'YYYY/MM/DD') - moment.utc(b.endPeriod, 'YYYY/MM/DD'),
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
      <Row>
        <Col span={4}>
          <Button onClick={() => handleStartPeriod()} size="large" type="primary" style={{ marginBottom: '30px' }}>
            Start Period
          </Button>
        </Col>
        <Col span={4}>
          <Button onClick={() => handleEndPeriod()} size="large" type="primary" style={{ marginBottom: '30px' }}>
            End Period
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table
            {...tableProps}
            bordered
            scroll={{ x: '1680px', y: '240px' }}
            columns={columns}
            simple
            rowKey={record => record.userId}
          />
        </Col>
      </Row>
    </div>
  )
}

Browse.propTypes = {
  onStartPeriod: PropTypes.func.isRequired,
  onEndPeriod: PropTypes.func.isRequired,
  location: PropTypes.isRequired,
}

export default Browse

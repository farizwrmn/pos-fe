import React from 'react'
import PropTypes from 'prop-types'
import {Table, Modal, Row, Col, Icon, Button} from 'antd'
import {DropOption} from 'components'

const gridStyle = {
  width: '60%',
  textAlign: 'center',
};

const confirm = Modal.confirm

const Browse = ({
  modalShow, dataBrowse }) => {
  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
    },
    {
      title: 'Product Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Cost',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'In',
      dataIndex: 'In',
      key: 'In',
    },
    {
      title: 'Out',
      dataIndex: 'Out',
      key: 'Out',
    },
  ]

  const hdlModalShow = (record) => {
    modalShow(record)
  }

  return (
    <Row gutter={35}>
      <Row style={{padding: 24}}>
        <Col>
          <Table
            scroll={{ x: 800 }}
            columns={columns}
            simple
            bordered
            pagination={{ pageSize: 10 }}
            size="small"
            dataSource={dataBrowse}
            onRowClick={ (record) => hdlModalShow(record)}
          />
        </Col>
      </Row>
    </Row>
  )
}

Browse.propTyps = {
}

export default Browse

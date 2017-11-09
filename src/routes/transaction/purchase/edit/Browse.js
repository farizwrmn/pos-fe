import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Row, Col, Icon, Button, Tag } from 'antd'
import {DropOption} from 'components'

const gridStyle = {
  width: '60%',
  textAlign: 'center',
};

const confirm = Modal.confirm

const Browse = ({
  modalShow, ...purchaseProps }) => {
  const dataBrowse = purchaseProps.purchase.dataBrowse ? purchaseProps.purchase.dataBrowse.filter(el => el.void !== 1) :  {}
  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
    },
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      key: 'productCode',
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Disc %',
      dataIndex: 'disc1',
      key: 'disc1',
    },
    {
      title: 'Disc NML',
      dataIndex: 'discount',
      key: 'discount',
    },
    {
      title: 'DPP',
      dataIndex: 'dpp',
      key: 'dpp',
    },
    {
      title: 'PPN',
      dataIndex: 'ppn',
      key: 'ppn',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
    },
    {
      title: 'KET',
      dataIndex: 'ket',
      key: 'ket',
      render: ket =>
      <span>
        <Tag color={ ket === 'edit' ? 'blue' : 'green'}>
          {ket === 'edit' ? 'EDIT' : 'ADD'}
        </Tag>
      </span>,
    },
  ]

  const hdlModalShow = (record) => {
    modalShow(record)
  }

  return (
    <Table
      bordered
      scroll={{ x: 1300 }}
      columns={columns}
      simple
      size="small"
      pagination={{ pageSize: 5 }}
      dataSource={dataBrowse}
      onRowClick={_record => hdlModalShow(_record)}
    />
  )
}

Browse.propTypes = {
  modalShow: PropTypes.func.isRequired,
}

export default Browse

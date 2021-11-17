import React from 'react'
import PropTypes from 'prop-types'
import { Table, Tag } from 'antd'
import { connect } from 'dva'
import { numberFormat } from 'utils'
import styles from '../../../../themes/index.less'

const formatNumberIndonesia = numberFormat.formatNumberIndonesia

const ListVoid = ({ onRestoreVoid, purchase, dispatch, ...tableProps }) => {
  const handleMenuClick = (record) => {
    record.ket = 'edit'
    onRestoreVoid(record)
  }

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      width: 100
    },
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      key: 'productCode',
      width: 100
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      width: 100
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      width: 100,
      className: styles.alignRight,
      render: text => formatNumberIndonesia(parseFloat(text))
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      className: styles.alignRight,
      render: text => formatNumberIndonesia(parseFloat(text))
    },
    {
      title: 'Disc %',
      dataIndex: 'disc1',
      key: 'disc1',
      width: 100,
      className: styles.alignRight,
      render: text => formatNumberIndonesia(parseFloat(text))
    },
    {
      title: 'Disc NML',
      dataIndex: 'discount',
      key: 'discount',
      width: 100,
      className: styles.alignRight,
      render: text => formatNumberIndonesia(parseFloat(text))
    },
    {
      title: 'DPP',
      dataIndex: 'dpp',
      key: 'dpp',
      width: 100,
      className: styles.alignRight,
      render: text => formatNumberIndonesia(parseFloat(text))
    },
    {
      title: 'PPN',
      dataIndex: 'ppn',
      key: 'ppn',
      width: 50,
      className: styles.alignRight,
      render: text => formatNumberIndonesia(parseFloat(text))
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      width: 100,
      className: styles.alignRight,
      render: text => formatNumberIndonesia(parseFloat(text))
    },
    {
      title: 'KET',
      dataIndex: 'ket',
      key: 'ket',
      width: 100,
      render: ket =>
      (<span>
        <Tag color={ket === 'void' ? 'red' : 'green'}>
          {ket === 'void' ? 'VOID' : 'ADD'}
        </Tag>
      </span>)
    }
  ]

  return (
    <div>
      <Table
        {...tableProps}
        bordered
        scroll={{ x: 1050, y: 388 }}
        columns={columns}
        simple
        size="small"
        rowKey={record => record.productCode}
        onRowClick={_record => handleMenuClick(_record)}
      />
    </div>
  )
}

ListVoid.propTypes = {
  onRestoreVoid: PropTypes.func.isRequired,
  location: PropTypes.isRequired,
  purchase: PropTypes.isRequired,
  dispatch: PropTypes.func.isRequired
}

export default connect(({ purchase }) => ({ purchase }))(ListVoid)

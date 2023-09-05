/**
 * Created by Veirry on 17/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { numberFormat } from 'utils'
import moment from 'moment'
import styles from '../../../../themes/index.less'

const { formatNumberIndonesia } = numberFormat

const Browse = ({ to, storeId, onExpandChildAccountType, ...browseProps }) => {
  let columns = [
    {
      title: 'Account',
      dataIndex: 'bodyTitle',
      key: 'bodyTitle',
      width: '175px'
    },
    {
      title: moment(to).format('ll'),
      dataIndex: 'value',
      key: 'value',
      width: '155px',
      className: styles.alignRight,
      render: text => formatNumberIndonesia(text)
    }
  ]

  const onClickDetail = () => {
    // onGetDetail(record)
  }

  const onClickExpand = (expanded, record) => {
    onExpandChildAccountType(record.type, storeId, to)
  }

  return (
    <Table
      {...browseProps}
      bordered
      pagination={false}
      columns={columns}
      simple
      onRowClick={record => onClickDetail(record)}
      rowKey={record => record.key}
      onExpand={(expanded, record) => onClickExpand(expanded, record)}
      size="small"
    />
  )
}

Browse.propTypes = {
  location: PropTypes.object,
  onExportExcel: PropTypes.func
}

export default Browse

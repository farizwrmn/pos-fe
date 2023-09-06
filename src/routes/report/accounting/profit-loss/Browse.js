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

const Browse = ({ from, to, storeId, onExpandChildAccountType, ...browseProps }) => {
  let columns = [
    {
      title: 'Account',
      dataIndex: 'bodyTitle',
      key: 'bodyTitle',
      width: '175px',
      render: (text, record) => {
        if (record && record.children && record.children.length > 0) {
          if (record && record.originalValue !== record.value) {
            if (record.originalValue !== 0 && record.originalValue !== null) {
              text = `${text} (Header: ${formatNumberIndonesia(record.originalValue)})`
            }
          }
        }
        return text
      }
    },
    {
      title: moment(to).format('ll'),
      className: styles.alignRight,
      dataIndex: 'value',
      key: 'value',
      width: '155px',
      render: text => formatNumberIndonesia(text)
    }
  ]

  const onClickDetail = () => {
    // onGetDetail(record)
  }

  const onClickExpand = (_, record) => {
    onExpandChildAccountType(record.type, storeId, from, to)
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

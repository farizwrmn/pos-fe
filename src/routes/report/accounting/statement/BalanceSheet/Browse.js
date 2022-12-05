/**
 * Created by Veirry on 17/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { numberFormat } from 'utils'
import moment from 'moment'

const { formatNumberIndonesia } = numberFormat

const Browse = ({ from, to, compareFrom, compareTo, ...browseProps }) => {
  let columns = [
    {
      title: 'Account',
      dataIndex: 'accountName',
      key: 'accountName',
      width: '175px'
    },
    {
      title: `${moment(from).format('ll')} - ${moment(to).format('ll')}`,
      dataIndex: 'value',
      key: 'value',
      width: '155px',
      render: text => formatNumberIndonesia(text)
    }
  ]

  if (compareFrom && compareTo) {
    columns = columns.concat([
      {
        title: `${moment(compareFrom).format('ll')} - ${moment(compareTo).format('ll')}`,
        dataIndex: 'compare',
        key: 'compare',
        width: '155px',
        render: text => formatNumberIndonesia(text)
      }
    ])
  }

  return (
    <Table
      {...browseProps}
      bordered
      scroll={{ x: 1000, y: 300 }}
      columns={columns}
      simple
      size="small"
    />
  )
}

Browse.propTypes = {
  location: PropTypes.object,
  onExportExcel: PropTypes.func
}

export default Browse

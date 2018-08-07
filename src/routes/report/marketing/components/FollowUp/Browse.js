/**
 * Created by Veirry on 17/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import moment from 'moment'
import styles from '../../../../../themes/index.less'

const Browse = ({ transTime, ...browseProps }) => {
  const columns = [
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: '175px',
      render: text => `${moment(text).format('DD-MMM-YYYY')}`
    },
    {
      title: 'Last Call',
      dataIndex: 'lastCall',
      key: 'lastCall',
      className: styles.alignRight
    },
    {
      title: 'Member',
      dataIndex: 'memberName',
      key: 'memberName',
      className: styles.alignRight
    },
    {
      title: 'Contact',
      dataIndex: 'mobileNumber',
      key: 'mobileNumber',
      className: styles.alignRight
    },
    {
      title: 'Customer Satisfaction',
      dataIndex: 'customerSatisfaction',
      key: 'customerSatisfaction',
      className: styles.alignRight
    }
  ]

  return (
    <div>
      <Table
        style={{ clear: 'both' }}
        {...browseProps}
        bordered
        columns={columns}
        simple
        size="small"
      />
    </div>
  )
}

Browse.propTypes = {
  location: PropTypes.object,
  onExportExcel: PropTypes.func
}

export default Browse

import React from 'react'
import moment from 'moment'
import { Card, Table } from 'antd'

const RewardGuide = ({ ...otherProps }) => {
  const width = 700
  const columns = [
    {
      title: 'Nama Incentive',
      dataIndex: 'incentiveName',
      key: 'name',
      width: `${width * 0.15}px`
    },
    {
      title: 'Period',
      dataIndex: 'Date',
      key: 'Date',
      width: `${width * 0.15}px`,
      render: (text, record) => {
        return `${moment(record.startDate, 'YYYY-MM-DD').format('DD-MMM-YYYY')} ~ ${moment(record.endDate, 'YYYY-MM-DD').format('DD-MMM-YYYY')}`
      }
    },
    {
      title: 'Pencapaian Item (Qty)',
      dataIndex: 'calculatedReward',
      key: 'calculatedReward',
      width: `${width * 0.1}px`
    }
  ]
  const modalPromoGuideProps = {
    ...otherProps,
    showPagination: false,
    columns
  }
  return (
    <div style={{ margin: '20px 0' }}>
      <Card>
        <div>
          <h2>Reward</h2>
        </div>
        <div>
          <Table
            {...modalPromoGuideProps}
            pagination={false}
            bordered
            scroll={{ x: 700, y: 388 }}
            columns={columns}
            simple
            rowKey={record => record.id}
          />
        </div>
      </Card>
    </div>
  )
}

export default RewardGuide

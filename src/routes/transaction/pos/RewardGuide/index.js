import React from 'react'
import { DataQuery } from 'components'
import moment from 'moment'
import { Card } from 'antd'

const { Promo } = DataQuery

const PromotionGuide = ({ ...otherProps }) => {
  const width = 1000
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
      title: 'Pencapaian Item',
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
        <Promo {...modalPromoGuideProps} />
      </Card>
    </div>
  )
}

export default PromotionGuide

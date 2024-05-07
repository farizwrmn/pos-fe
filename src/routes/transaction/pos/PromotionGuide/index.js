import React from 'react'
import { DataQuery } from 'components'
import moment from 'moment'
import { Tag, Card } from 'antd'
import { calendar } from 'utils'

const { dayByNumber } = calendar

const { Promo } = DataQuery

const PromotionGuide = ({ ...otherProps }) => {
  const width = 1000
  const columns = [
    {
      title: 'Nama Promo',
      dataIndex: 'name',
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
      title: 'Hari',
      dataIndex: 'availableDate',
      key: 'availableDate',
      width: `${width * 0.15}px`,
      render: (text) => {
        let date = text !== null ? text.split(',').sort() : <Tag color="green">{'Everyday'}</Tag>
        if (text !== null && (date || []).length === 7) {
          date = <Tag color="green">{'Everyday'}</Tag>
        }
        if (text !== null && (date || []).length < 7) {
          date = date.map(dateNumber => <Tag color="blue">{dayByNumber(dateNumber)}</Tag>)
        }
        return date
      }
    },
    {
      title: 'Jam Promo',
      dataIndex: 'availableHour',
      key: 'availableHour',
      width: `${width * 0.1}px`,
      render: (text, record) => {
        return `${moment(record.startHour, 'HH:mm:ss').format('HH:mm')} ~ ${moment(record.endHour, 'HH:mm:ss').format('HH:mm')}`
      }
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
          <h2>Daftar Promo Aktif</h2>
        </div>
        <Promo {...modalPromoGuideProps} />
      </Card>
    </div>
  )
}

export default PromotionGuide

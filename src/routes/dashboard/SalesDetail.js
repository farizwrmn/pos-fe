import React from 'react'
import { Button, Table } from 'antd'
import moment from 'moment'
import { numberFormatter } from 'utils/numberFormat'

const SalesDetail = ({ dispatch, ...other }) => {
  const onClickCopy = () => {
    // dispatch({
    //   type: 'dashboard/querySalesCategory',
    //   payload: {
    //     from: moment().format('YYYY-MM-DD'),
    //     to: moment().format('YYYY-MM-DD')
    //   }
    // })
  }

  const columns = [
    {
      title: (<div>Latest Sales <Button onClick={onClickCopy} type="default" shape="circle" icon="copy" /></div>),
      dataIndex: 'productCode',
      key: 'productCode',
      render: (text, record) => {
        return (
          <div>
            <div>{moment(record.createdAt).format('lll')}</div>
            <div>{`${text || record.serviceCode} - ${record.productName || record.serviceName}`}</div>
            <div>{`${record.qty} x ${numberFormatter(record.DPP / record.qty)}`}<strong style={{ float: 'right' }}>{`IDR ${numberFormatter(record.DPP)}`}</strong></div>
          </div>
        )
      }
    }
  ]

  return (
    <div>
      <Table
        columns={columns}
        {...other}
      />
    </div>
  )
}

export default SalesDetail

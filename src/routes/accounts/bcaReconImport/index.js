/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import List from './List'

let currentData = []
const setData = (data) => {
  currentData = data
}

const ImportBcaRecon = ({
  loading,
  dispatch,
  importBcaRecon
}) => {
  const { list, pagination } = importBcaRecon

  const listProps = {
    dataSource: list,
    pagination,
    loading: loading.effects['importBcaRecon/query'] || loading.effects['importBcaRecon/bulkInsert'],
    onChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize
        }
      }))
    }
  }

  const uploadProps = {
    name: 'file',
    processData: false
  }

  const csvHeader = [
    'approvalCode',
    'cardNumber',
    'cardType',
    'dbCrIndicator',
    'grossAmount',
    'groupId',
    'mdr',
    'merchantId',
    'edcBatchNumber',
    'merchantName',
    'nettAmount',
    'originalAmount',
    'processEffectiveDate',
    'merchantPaymentDate',
    'recordSource',
    'redeemAmount',
    'rewardAmount',
    'mdrAmount',
    'merchantPaymentStatus',
    'reportDate',
    'merchantSettleDate',
    'merchantSettleTime',
    'terminalId',
    'transactionDate',
    'transactionTime',
    'sequenceNumber',
    'traceNumber',
    'transactionCode'
  ]

  const handleChangeFile = (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()

    reader.onload = (event) => {
      const data = event.target.result
      console.log('data', data)
      const rows = String(data).trim().split('\n')
      const newDataObjects = []
      for (const row of rows) {
        const rowObject = {}
        for (const index in csvHeader) {
          rowObject[csvHeader[index]] = row[index]
        }
        newDataObjects.push(rowObject)
      }
      console.log('newDataObjects', newDataObjects)
      setData(newDataObjects)
    }
    reader.readAsText(file, { header: false })
  }


  return (
    <div className="content-inner">
      <div>
        <span>
          <label htmlFor="opname" className="ant-btn ant-btn-primary ant-btn-lg" style={{ marginLeft: '15px', padding: '0.5em' }}>Select File</label>
          <input
            id="opname"
            type="file"
            accept=".csv"
            className="ant-btn ant-btn-default ant-btn-lg"
            style={{ visibility: 'hidden' }}
            {...uploadProps}
            onClick={(event) => {
              event.target.value = null
            }}
            onInput={(event) => {
              handleChangeFile(event)
            }}
          />
        </span>
      </div>
      {currentData}
      <List {...listProps} />
    </div>
  )
}

export default connect(
  ({
    loading,
    ImportBcaRecon
  }) => ({
    loading,
    ImportBcaRecon
  })
)(ImportBcaRecon)

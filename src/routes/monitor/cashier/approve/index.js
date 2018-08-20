import React from 'react'
import { connect } from 'dva'
import { Button, Modal } from 'antd'
import Filter from './Filter'
import Browse from './Browse'

const Approve = ({ cashier, dispatch, loading }) => {
  const { listRequestedCashRegister, currentItem } = cashier

  const filterProps = {
    findCashier (cashierId) {
      dispatch({
        type: 'cashier/getRequestedCashRegister',
        payload: cashierId ? { cashierId } : {}
      })
    }
  }

  const browseProps = {
    currentItem,
    dataSource: listRequestedCashRegister,
    loading: loading.effects['cashier/getRequestedCashRegister'],
    checkRequestedCashRegister (checked, record) {
      dispatch({
        type: 'cashier/checkRequest',
        payload: { checked, record }
      })
    }
  }

  const confirmRequest = (item) => {
    Modal.confirm({
      content: `Approve this request to open cashier period for ${item.cashierId}`,
      onOk () {
        dispatch({
          type: 'cashier/approveRequestOpenCashRegister',
          payload: { id: item.id, storeId: item.storeId }
        })
      },
      onCancel () { }
    })
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <div style={{ height: 10 }} />
      <Browse {...browseProps} />
      <Button disabled={!currentItem.id} onClick={() => confirmRequest(currentItem)} size="large" type="primary" style={{ position: 'absolute', right: 30, bottom: 30 }}>Confirm</Button>
    </div>
  )
}

export default connect(({ cashier, loading }) => ({ cashier, loading }))(Approve)

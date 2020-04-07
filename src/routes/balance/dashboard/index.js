import React from 'react'
import { connect } from 'dva'
import Approve from './Approve'
import ModalApprove from './ModalApprove'

const Container = ({ dispatch, paymentOpts, balance, balanceDetail }) => {
  const { currentItem, listBalance, modalApproveVisible } = balance
  const { listOpts } = paymentOpts
  const { listBalanceDetail } = balanceDetail
  const approveProps = {
    list: listBalance,
    onOpenModal (item) {
      dispatch({
        type: 'balanceDetail/query',
        payload: {
          balanceId: item.id,
          relationship: 1,
          type: 'all'
        }
      })
      dispatch({
        type: 'balance/updateState',
        payload: {
          modalApproveVisible: true,
          currentItem: item
        }
      })
    }
  }

  const modalApproveProps = {
    dataSource: listBalanceDetail,
    listOpts,
    okText: 'Approve',
    item: currentItem,
    visible: modalApproveVisible,
    onOk (item) {
      dispatch({
        type: 'balance/approve',
        payload: item
      })
    },
    onCancel () {
      dispatch({
        type: 'balance/updateState',
        payload: {
          modalApproveVisible: false,
          currentItem: {}
        }
      })
    }
  }

  return (
    <div className="content-inner">
      <Approve {...approveProps} />
      {modalApproveVisible && <ModalApprove {...modalApproveProps} />}
    </div>
  )
}

export default connect(({ paymentOpts, balance, balanceDetail, loading, app }) => ({ paymentOpts, balance, balanceDetail, loading, app }))(Container)

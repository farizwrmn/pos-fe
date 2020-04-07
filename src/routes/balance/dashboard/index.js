import React from 'react'
import { connect } from 'dva'
import Approve from './Approve'
import ModalApprove from './ModalApprove'

const Container = ({ dispatch, balance, balanceDetail }) => {
  const { currentItem, listBalance, modalApproveVisible } = balance
  const { listBalanceDetail } = balanceDetail
  const approveProps = {
    list: listBalance,
    onOpenModal (item) {
      dispatch({
        type: 'balanceDetail/query',
        payload: {
          balanceId: item.id,
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

export default connect(({ balance, balanceDetail, loading, app }) => ({ balance, balanceDetail, loading, app }))(Container)

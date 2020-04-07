import React from 'react'
import { connect } from 'dva'
import Approve from './Approve'

const Container = ({ balance }) => {
  const { listBalance } = balance
  const approveProps = {
    list: listBalance
  }

  return (
    <div className="content-inner">
      <Approve {...approveProps} />
    </div>
  )
}

export default connect(({ balance, loading, app }) => ({ balance, loading, app }))(Container)

import { Row } from 'antd'
import { connect } from 'dva'
import FormCurrent from './Form'
import FormClose from './FormClose'

const BalanceCurrent = ({
  dispatch,
  loading,
  setoran,
  balanceShift,
  userDetail,
  paymentOpts
}) => {
  const {
    formType,
    currentBalance
  } = setoran
  const {
    listShift
  } = balanceShift
  const {
    data
  } = userDetail
  const {
    listOpts
  } = paymentOpts

  const formCurrentProps = {
    loading,
    listShift,
    onSubmit: (data) => {
      dispatch({
        type: 'setoran/openBalance',
        payload: data
      })
    }
  }

  const formCloseProps = {
    loading,
    currentBalance,
    listShift,
    listUser: data.data,
    listOpts,
    onSubmit: (data, approveUserId) => {
      dispatch({
        type: 'setoran/closeBalance',
        payload: {
          data,
          approveUserId
        }
      })
    }
  }

  return (
    <div className="content-inner">
      <Row>
        {formType === 'open' ? (
          <FormCurrent {...formCurrentProps} />
        ) : (
          <FormClose {...formCloseProps} />
        )}
      </Row>
    </div>
  )
}

export default connect(({
  loading,
  setoran,
  balanceShift,
  userDetail,
  paymentOpts
}) => ({
  loading,
  setoran,
  balanceShift,
  userDetail,
  paymentOpts
}))(BalanceCurrent)

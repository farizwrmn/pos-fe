import { Row } from 'antd'
import { connect } from 'dva'
import FormCurrent from './Form'
import FormClose from './FormClose'

const BalanceCurrent = ({
  dispatch,
  loading,
  setoran,
  balanceShift,
  userDetail
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
    currentBalance,
    listShift,
    listUser: data.data,
    onSubmit: (data) => {
      console.log('data', data)
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
  userDetail
}) => ({
  loading,
  setoran,
  balanceShift,
  userDetail
}))(BalanceCurrent)

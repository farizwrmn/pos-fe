import { Row } from 'antd'
import { connect } from 'dva'
import FormCurrent from './Form'
import FormClose from './FormClose'

const BalanceCurrent = ({
  setoran,
  shift,
  userDetail
}) => {
  const {
    formType,
    currentBalance
  } = setoran
  const {
    listShift
  } = shift
  const {
    data
  } = userDetail

  console.log('userDetail', userDetail)

  const formCurrentProps = {
    listShift,
    onSubmit: (data) => {
      console.log('data', data)
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
  setoran,
  shift,
  userDetail
}) => ({
  setoran,
  shift,
  userDetail
}))(BalanceCurrent)

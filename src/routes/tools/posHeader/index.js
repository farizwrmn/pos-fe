import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import FormEdit from './FormEdit'

const Maintenance = ({ dispatch, maintenance, pos, payment }) => {
  const { optionPos, listTrans, period, item, modalVisible, modalType } = maintenance
  const { listMember, listMechanic, listUnit } = pos
  const { usingWo, woNumber } = payment
  const formWoProps = {
    usingWo,
    woNumber,
    formItemLayout: {
      labelCol: { span: 8 },
      wrapperCol: { span: 10 },
      style: {
        marginBottom: '5px',
        marginTop: '5px'
      }
    },
    generateSequence () {
      dispatch({
        type: 'payment/sequenceQuery',
        payload: {
          seqCode: 'WO'
        }
      })
    },
    notUsingWo (check, value) {
      dispatch({
        type: 'payment/querySequenceSuccess',
        payload: {
          usingWo: check,
          woNumber: value
        }
      })
    }
  }
  const formEditProps = {
    optionPos,
    item,
    modalType,
    listUnit,
    listMember,
    listMechanic,
    listTrans,
    period,
    modalVisible,
    ...formWoProps,
    onChangePeriod (start, end) {
      dispatch({
        type: 'maintenance/setAllNull'
      })
      dispatch({
        type: 'maintenance/queryPos',
        payload: {
          startPeriod: start,
          endPeriod: end
        }
      })
    },
    setFormItem (data) {
      dispatch({
        type: 'maintenance/setInitialValue',
        payload: {
          item: data
        }
      })
    },
    setItem (data) {
      dispatch({
        type: 'maintenance/setItem',
        payload: {
          item: data
        }
      })
    },
    onShowModal (e, memberId) {
      if (e === 'member') {
        dispatch({
          type: 'pos/getMembers'
        })
        dispatch({
          type: 'maintenance/showModal',
          payload: {
            modalType: e
          }
        })
      } else if (e === 'mechanic') {
        dispatch({
          type: 'pos/getMechanics'
        })
        dispatch({
          type: 'maintenance/showModal',
          payload: {
            modalType: e
          }
        })
      } else if (e === 'unit') {
        dispatch({
          type: 'pos/getUnit',
          payload: {
            id: memberId
          }
        })
        dispatch({
          type: 'maintenance/showModal',
          payload: {
            modalType: e
          }
        })
      }
    },
    onHideModal () {
      dispatch({
        type: 'maintenance/hideModal'
      })
    },
    onOk (data) {
      dispatch({
        type: 'maintenance/update',
        payload: {
          id: data.transNoId,
          data
        }
      })
    }
  }

  return <FormEdit {...formEditProps} />
}
Maintenance.propTypes = {
  maintenance: PropTypes.object,
  pos: PropTypes.object,
  payment: PropTypes.object,
  unit: PropTypes.object,
  app: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object
}


export default connect(({ maintenance, pos, payment, unit, loading, app }) => ({ maintenance, pos, payment, unit, loading, app }))(Maintenance)

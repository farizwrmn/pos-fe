import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import moment from 'moment'
import FormEdit from './FormEdit'

const Maintenance = ({ loading, dispatch, maintenance, pos, transferOut }) => {
  const { optionPos, period, item, modalVisible, modalType } = maintenance
  const { listHeader, listChangeTransferOut, listChangeTransferIn } = transferOut
  const { listProduct, searchText, pagination } = pos
  const formWoProps = {
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
          woNumber: value
        }
      })
    }
  }
  const formEditProps = {
    optionPos,
    item,
    modalType,
    listProduct,
    pagination,
    loading,
    period,
    modalVisible,
    listHeader,
    listChangeTransferOut,
    listChangeTransferIn,
    ...formWoProps,
    getTransferOut (transNoId) {
      dispatch({
        type: 'transferOut/updateState',
        payload: {
          listHeader: [],
          listChangeTransferOut: [],
          listChangeTransferIn: [],
          listProduct: []
        }
      })
      dispatch({
        type: 'transferOut/queryHeader',
        payload: {
          transNoId
        }
      })
      dispatch({
        type: 'transferOut/queryChangeHpokokTransferOut',
        payload: {
          transNoId
        }
      })
      dispatch({
        type: 'transferOut/queryChangeHpokokTransferIn',
        payload: {
          transNoId
        }
      })
    },
    changeModal (e) {
      if (modalType === 'product') {
        dispatch({
          type: 'pos/getProducts',
          payload: {
            q: searchText === '' ? null : searchText,
            active: 1,
            page: Number(e.current),
            pageSize: Number(e.pageSize)
          }
        })
      }
    },
    showProductQty (data) {
      dispatch({
        type: 'pos/showProductQty',
        payload: {
          data
        }
      })
    },
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
    onShowModal (e, data) {
      dispatch({
        type: 'pos/updateState',
        payload: {
          searchText: null
        }
      })
      if (e === 'product') {
        dispatch({
          type: 'pos/getProducts',
          payload: {
            q: searchText === '' ? null : searchText,
            active: 1
          }
        })
        dispatch({
          type: 'maintenance/showModal',
          payload: {
            modalType: e
          }
        })
      } else if (e === 'transfer') {
        const { productId, period } = data
        let endDate = moment(period).format('YYYY-MM-DD')
        let startDate = moment(endDate, 'YYYY-MM-DD').startOf('month').format('YYYY-MM-DD')
        dispatch({
          type: 'transferOut/queryHpokok',
          payload: {
            q: searchText === '' ? null : searchText,
            order: 'transDate',
            productId,
            transDate: [
              startDate,
              endDate
            ]
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
  transferOut: PropTypes.object.isRequired,
  app: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object
}


export default connect(({ maintenance, pos, transferOut, loading, app }) => ({ maintenance, pos, transferOut, loading, app }))(Maintenance)

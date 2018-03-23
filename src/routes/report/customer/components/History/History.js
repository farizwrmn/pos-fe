import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import moment from 'moment'
import Filter from './Filter'
import List from './List'

const History = ({ customerReport, customer, service, dispatch, app, loading }) => {
  const { modalVisible, listPoliceNo, customerInfo, listHistory, from, to } = customerReport
  const { list } = customer
  const { listServiceType } = service
  const { user, storeInfo } = app
  const modalProps = {
    customer,
    visible: modalVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onCancel () {
      dispatch({
        type: 'customerReport/updateState',
        payload: {
          modalVisible: false
        }
      })
    }
  }

  const printProps = {
    listHistory,
    user,
    storeInfo,
    from,
    to
  }

  const filterProps = {
    ...printProps,
    listPoliceNo,
    listServiceType,
    modalVisible,
    customerInfo,
    ...modalProps,
    openModal () {
      dispatch({
        type: 'customerReport/updateState',
        payload: {
          modalVisible: true
        }
      })
      dispatch({
        type: 'customer/updateState',
        payload: {
          listCustomer: list
        }
      })
    },
    onResetClick () {
      dispatch({
        type: 'customerReport/updateState',
        payload: {
          listPoliceNo: [],
          customerInfo: {},
          listHistory: [],
          from: '',
          to: ''
        }
      })
    },
    resetHistory () {
      dispatch({
        type: 'customerReport/updateState',
        payload: {
          listHistory: [],
          listPoliceNo: [],
          from: '',
          to: ''
        }
      })
    },
    onSearchClick (memberCode, data) {
      let fromDate = null
      let toDate = null
      if (data.period ? data.period[0] : false) {
        fromDate = moment(data.period[0]).format('YYYY-MM-DD')
        toDate = moment(data.period[1]).format('YYYY-MM-DD')
      }
      dispatch({
        type: 'customerReport/query',
        payload: {
          memberCode,
          policeNo: data.policeNo,
          from: fromDate,
          to: toDate,
          serviceType: data.serviceType,
          mode: 'detail'
        }
      })
    }
  }

  const listProps = {
    dataSource: listHistory,
    loading: loading.effects['customerReport/query'],
    style: { marginTop: 15 }
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <List {...listProps} />
    </div>
  )
}

History.propTypes = {
  customerReport: PropTypes.object,
  customer: PropTypes.object,
  service: PropTypes.object,
  app: PropTypes.object,
  loading: PropTypes.object,
  dispatch: PropTypes.object
}

export default connect(({ customerReport, customer, service, app, loading }) => ({ customerReport, customer, service, app, loading }))(History)


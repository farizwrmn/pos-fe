import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { posTotal, lstorage } from 'utils'
import moment from 'moment'
import Browse from './Browse'
import Modal from './Modal'
import ModalCancel from './ModalCancel'
import ModalLogin from '../ModalLogin'

const Pos = ({ location, dispatch, loading, login, pos, payment, app }) => {
  const {
    listPayment,
    listPaymentDetail,
    invoiceCancel,
    modalCancelVisible,
    memberPrint,
    mechanicPrint,
    pagination,
    modalPrintVisible,
    tmpListPayment,
    posData,
    modalLoginVisible,
    modalLoginType
  } = pos
  const { modalLoginData } = login
  const { companyInfo } = payment
  const { storeInfo } = app

  const modalProps = {
    visible: modalPrintVisible,
    listPayment,
    loading: loading.effects['pos/queryPosDetail'],
    listPaymentDetail,
    memberPrint,
    mechanicPrint,
    company: storeInfo,
    posData,
    maskClosable: false,
    title: 'Print the Transaction Duplicate?',
    confirmLoading: loading.effects['payment/printPayment'],
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      let dataPos = []
      let dataService = []
      for (let n = 0; n < data.data.length; n += 1) {
        if (data.data[n].serviceCode === null || data.data[n].serviceName === null || data.data[n].productCode !== null || data.data[n].productName !== null) {
          let productId = data.data[n].productCode
          let productName = data.data[n].productName
          dataPos.push({
            no: '',
            code: productId,
            name: productName,
            qty: data.data[n].qty,
            price: data.data[n].sellingPrice,
            sellPrice: data.data[n].sellPrice,
            discount: data.data[n].discount,
            disc1: data.data[n].disc1,
            disc2: data.data[n].disc2,
            disc3: data.data[n].disc3,
            total: posTotal(data.data[n])
          })
        } else if (data.data[n].productCode === null || data.data[n].productName === null || data.data[n].serviceCode !== null || data.data[n].serviceName !== null) {
          let productId = data.data[n].serviceCode
          let productName = data.data[n].serviceName
          dataService.push({
            no: '',
            code: productId,
            name: productName,
            qty: data.data[n].qty,
            price: data.data[n].sellingPrice,
            sellPrice: data.data[n].sellPrice,
            discount: data.data[n].discount,
            disc1: data.data[n].disc1,
            disc2: data.data[n].disc2,
            disc3: data.data[n].disc3,
            total: posTotal(data.data[n])
          })
        } else if (data.data[n].productCode === null || data.data[n].productName === null || data.data[n].serviceCode === null || data.data[n].serviceName === null) {
          let productId = '-'
          let productName = '-'
          dataService.push({
            no: '',
            code: productId,
            name: productName,
            qty: data.data[n].qty,
            price: data.data[n].sellingPrice,
            sellPrice: data.data[n].sellPrice,
            discount: data.data[n].discount,
            disc1: data.data[n].disc1,
            disc2: data.data[n].disc2,
            disc3: data.data[n].disc3,
            total: posTotal(data.data[n])
          })
        }
      }
      for (let j = 0; j < dataService.length; j += 1) {
        dataService[j].no = j + 1
      }
      for (let k = 0; k < dataPos.length; k += 1) {
        dataPos[k].no = k + 1
      }
      dispatch({
        type: 'payment/printPayment',
        payload: {
          dataPos,
          dataService,
          transDatePrint: moment(`${posData.transDate} ${posData.transNo}`, 'YYYY-MM-DD HH:mm:ss').format('DD MMM YYYY HH:mm'),
          memberId: data.memberPrint.memberCode,
          gender: data.memberPrint.gender,
          company: data.companyPrint,
          lastTransNo: listPaymentDetail.id,
          unitInfo: {
            ...listPaymentDetail
          },
          companyInfo,
          memberName: data.memberPrint.memberName,
          phone: data.memberPrint.mobileNumber ? data.memberPrint.mobileNumber : data.memberPrint.phoneNumber,
          policeNo: listPaymentDetail.policeNo,
          lastMeter: listPaymentDetail.lastMeter,
          employeeName: data.mechanicPrint.employeeName,
          address: data.memberPrint.address01 ? data.memberPrint.address01 : data.memberPrint.address02,
          cashierId: listPaymentDetail.cashierId,
          userName: listPaymentDetail.cashierName,
          printNo: 'copy'
        }
      })
      dispatch({
        type: 'pos/hidePrintModal'
      })
    },
    onCancel () {
      dispatch({
        type: 'pos/hidePrintModal'
      })
    }
  }

  const modalCancelProps = {
    visible: modalCancelVisible,
    loading: loading.effects['pos/queryPosDetail'],
    maskClosable: false,
    invoiceCancel,
    title: 'Cancel the Transaction?',
    confirmLoading: loading.effects['payment/printPayment'],
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      // dispatch({
      //   type: 'pos/cancelInvoice',
      //   payload: data
      // })
      dispatch({
        type: 'pos/showModalLogin',
        payload: {
          modalLoginType: 'cancelHistory'
        }
      })
      dispatch({
        type: 'login/updateState',
        payload: {
          modalLoginData: data
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'pos/hidePrintModal'
      })
    }
  }

  const browseProps = {
    dataSource: listPayment,
    tmpDataSource: tmpListPayment,
    app,
    width: 90,
    dispatch,
    loading: loading.effects['pos/queryHistory'],
    pagination,
    location,
    onSearchChange (data) {
      dispatch({
        type: 'pos/searchPOS',
        payload: data
      })
    },
    onChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize
        }
      }))
    },
    onShowCancelModal (e) {
      dispatch({
        type: 'pos/showCancelModal',
        payload: e
      })
    },
    onGetDetail (record) {
      // const { transNo } = e
      if (record.paymentVia === 'PQ' || record.paymentVia === 'XQ') {
        const listUserRole = lstorage.getListUserRoles()
        const checkRole = listUserRole.find(item => item.value === 'OWN' || item.value === 'ITS')
        if (checkRole) {
          const invoiceWindow = window.open(`/transaction/pos/invoice/${record.id}?status=reprint`)
          invoiceWindow.focus()
        } else {
          dispatch({
            type: 'pos/checkPaymentTransactionValidPaymentByPaymentReference',
            payload: {
              reference: record.id
            }
          })
        }
      } else {
        const invoiceWindow = window.open(`/transaction/pos/invoice/${record.id}?status=reprint`)
        invoiceWindow.focus()
      }
      // dispatch({
      //   type: 'pos/queryPosDetail',
      //   payload: {
      //     id: transNo,
      //     data: e
      //   }
      // })
      // dispatch({
      //   type: 'pos/setListPaymentDetail',
      //   payload: e
      // })
      // dispatch({
      //   type: 'pos/showPrintModal'
      // })
    },
    onChangePeriod (start, end) {
      dispatch({
        type: 'pos/queryHistory',
        payload: {
          startPeriod: start,
          endPeriod: end
        }
      })
    },
    size: 'small'
  }

  const modalLoginProps = {
    modalLoginType,
    modalLoginData,
    visible: modalLoginVisible,
    title: 'Supervisor Verification',
    width: '320px',
    footer: null,
    onCancel () {
      dispatch({
        type: 'pos/hideModalLogin'
      })
      dispatch({
        type: 'login/updateState',
        payload: {
          modalFingerprintVisible: false
        }
      })
    }
  }

  return (
    <div>
      {modalLoginVisible && <ModalLogin {...modalLoginProps} />}
      <Browse {...browseProps} />
      <Modal {...modalProps} />
      <ModalCancel {...modalCancelProps} />
    </div>
  )
}

Pos.propTypes = {
  pos: PropTypes.object,
  payment: PropTypes.object,
  app: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object
}


export default connect(({ login, pos, payment, loading, app }) => ({ login, pos, payment, loading, app }))(Pos)

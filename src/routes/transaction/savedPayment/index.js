import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import moment from 'moment'
import Browse from './Browse'
import Modal from './Modal'
import ModalCancel from './ModalCancel'

const Pos = ({ location, dispatch, loading, pos, app }) => {
  const { listPayment, listPaymentDetail, invoiceCancel, modalCancelVisible, memberPrint, mechanicPrint,
    pagination, modalPrintVisible, tmpListPayment, posData } = pos
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
            discount: data.data[n].discount,
            disc1: data.data[n].disc1,
            disc2: data.data[n].disc2,
            disc3: data.data[n].disc3,
            total: (data.data[n].qty * data.data[n].sellingPrice) - (data.data[n].discount) -
              ((data.data[n].qty * data.data[n].sellingPrice) * (data.data[n].disc1 / 100)) - (((data.data[n].qty * data.data[n].sellingPrice) * (data.data[n].disc1 / 100)) * (data.data[n].disc2 / 100)) -
              ((((data.data[n].qty * data.data[n].sellingPrice) * (data.data[n].disc1 / 100)) * (data.data[n].disc2 / 100)) * (data.data[n].disc2 / 100))
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
            discount: data.data[n].discount,
            disc1: data.data[n].disc1,
            disc2: data.data[n].disc2,
            disc3: data.data[n].disc3,
            total: (data.data[n].qty * data.data[n].sellingPrice) - (data.data[n].discount) -
              ((data.data[n].qty * data.data[n].sellingPrice) * (data.data[n].disc1 / 100)) - (((data.data[n].qty * data.data[n].sellingPrice) * (data.data[n].disc1 / 100)) * (data.data[n].disc2 / 100)) -
              ((((data.data[n].qty * data.data[n].sellingPrice) * (data.data[n].disc1 / 100)) * (data.data[n].disc2 / 100)) * (data.data[n].disc2 / 100))
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
            discount: data.data[n].discount,
            disc1: data.data[n].disc1,
            disc2: data.data[n].disc2,
            disc3: data.data[n].disc3,
            total: (data.data[n].qty * data.data[n].sellingPrice) - (data.data[n].discount) -
              ((data.data[n].qty * data.data[n].sellingPrice) * (data.data[n].disc1 / 100)) - (((data.data[n].qty * data.data[n].sellingPrice) * (data.data[n].disc1 / 100)) * (data.data[n].disc2 / 100)) -
              ((((data.data[n].qty * data.data[n].sellingPrice) * (data.data[n].disc1 / 100)) * (data.data[n].disc2 / 100)) * (data.data[n].disc2 / 100))
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
          transDatePrint: moment(posData.transDate || '').format('DD-MM-YYYY'),
          memberId: data.memberPrint.memberCode,
          gender: data.memberPrint.gender,
          company: data.companyPrint,
          lastTransNo: listPaymentDetail.id,
          unitInfo: {
            ...listPaymentDetail
          },
          memberName: data.memberPrint.memberName,
          phone: data.memberPrint.mobileNumber ? data.memberPrint.mobileNumber : data.memberPrint.phoneNumber,
          policeNo: listPaymentDetail.policeNo,
          lastMeter: listPaymentDetail.lastMeter,
          mechanicName: data.mechanicPrint.employeeName,
          address: data.memberPrint.address01 ? data.memberPrint.address01 : data.memberPrint.address02,
          cashierId: listPaymentDetail.cashierId,
          userName: listPaymentDetail.cashierId,
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
    title: 'Cancel the Transaction Duplicate?',
    confirmLoading: loading.effects['payment/printPayment'],
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: 'pos/cancelInvoice',
        payload: data
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
    width: 90,
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
    onGetDetail (e) {
      const transNo = e.transNo
      dispatch({
        type: 'pos/queryPosDetail',
        payload: {
          id: transNo,
          data: e
        }
      })
      dispatch({
        type: 'pos/setListPaymentDetail',
        payload: e
      })
      dispatch({
        type: 'pos/showPrintModal'
      })
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

  return (
    <div className="content-inner">
      <Browse {...browseProps} />
      <Modal {...modalProps} />
      <ModalCancel {...modalCancelProps} />
    </div>
  )
}

Pos.propTypes = {
  pos: PropTypes.object,
  app: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object
}


export default connect(({ pos, loading, app }) => ({ pos, loading, app }))(Pos)

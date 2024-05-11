import React from 'react'
import { connect } from 'dva'
import { posTotal, lstorage } from 'utils'
import moment from 'moment'
import { LocaleProvider } from 'antd'
import enUS from 'antd/lib/locale-provider/en_US'
import styles from './index.less'
import Header from './Header'
import Body from './Body'
import Total from './Total'
import Footer from './Footer'
import MerchantCopy from './MerchantCopy'
import Member from './Member'
import TaxInfo from './TaxInfo'
import { groupProduct } from './utils'
import ModalConfirm from './ModalConfirm'

class Invoice extends React.Component {
  state = {
    timeout: null
  }

  componentDidMount () {
    const millisecond = 1000
    const second = 60
    const minute = lstorage.getInvoiceTimeLimit() || 10
    const totalTime = Number(minute) * second * millisecond
    let timeout = setTimeout(() => {
      window.close()
    }, totalTime)
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      timeout
    })
  }

  componentWillUnmount () {
    const { timeout } = this.state
    clearTimeout(timeout)
  }

  render () {
    const { dispatch, posInvoice, app } = this.props
    const {
      listPaymentDetail,
      memberPrint,
      mechanicPrint,
      posData,
      modalConfirmVisible,
      standardInvoice,

      directPrinting,

      listAmount,
      listAmountInvoice,

      listOpts

    } = posInvoice
    const { storeInfo, user } = app
    const data = {
      posData,
      data: listPaymentDetail.data,
      bundling: listPaymentDetail.bundling,
      memberPrint,
      mechanicPrint,
      companyPrint: storeInfo
    }
    let dataPos = []
    let dataService = []
    let dataGroup = []
    let dataBundle = data.bundling
    if (data && data.data) {
      for (let n = 0; n < data.data.length; n += 1) {
        if (data.data[n].typeCode === 'P' && data.data[n].bundlingId === null) {
          let productId = data.data[n].productCode
          let productName = data.data[n].productName
          dataPos.push({
            no: '',
            code: productId,
            name: productName,
            bundlingId: data.data[n].bundlingId,
            bundlingCode: data.data[n].bundlingCode,
            bundlingName: data.data[n].bundlingName,
            qty: data.data[n].qty,
            price: data.data[n].sellingPrice,
            sellPrice: data.data[n].sellPrice,
            discount: data.data[n].discount,
            disc1: data.data[n].disc1,
            disc2: data.data[n].disc2,
            disc3: data.data[n].disc3,
            total: posTotal(data.data[n])
          })
        } else if (data.data[n].typeCode === 'S' && data.data[n].bundlingId === null) {
          let productId = data.data[n].serviceCode
          let productName = data.data[n].serviceName
          dataService.push({
            no: '',
            code: productId,
            name: productName,
            bundlingId: data.data[n].bundlingId,
            bundlingCode: data.data[n].bundlingCode,
            bundlingName: data.data[n].bundlingName,
            qty: data.data[n].qty,
            price: data.data[n].sellingPrice,
            sellPrice: data.data[n].sellPrice,
            discount: data.data[n].discount,
            disc1: data.data[n].disc1,
            disc2: data.data[n].disc2,
            disc3: data.data[n].disc3,
            total: posTotal(data.data[n])
          })
        } else if (data.data[n].bundlingId !== null) {
          let productId = data.data[n].productCode || data.data[n].serviceCode
          let productName = data.data[n].productName || data.data[n].serviceName
          dataGroup.push({
            no: '',
            code: productId,
            name: productName,
            bundlingId: data.data[n].bundlingId,
            bundlingCode: data.data[n].bundlingCode,
            bundlingName: data.data[n].bundlingName,
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
    }
    for (let j = 0; j < dataService.length; j += 1) {
      dataService[j].no = j + 1
    }
    for (let k = 0; k < dataPos.length; k += 1) {
      dataPos[k].no = k + 1
    }

    const invoiceInfo = {
      dataPos,
      dataService,
      posData,
      dataGroup: groupProduct(dataGroup, dataBundle),
      transDatePrint: moment(`${posData.transDate} ${posData.transTime}`, 'YYYY-MM-DD HH:mm:ss').format('DD MMM YYYY HH:mm'),
      memberId: data.memberPrint.memberCode,
      gender: data.memberPrint.gender,
      company: data.companyPrint,
      lastTransNo: listPaymentDetail.id,
      consignmentNo: data.posData.consignmentNo,
      unitInfo: {
        ...listPaymentDetail
      },
      storeInfo,
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

    const onShowDeliveryOrder = () => {
      dispatch({
        type: 'posInvoice/updateState',
        payload: {
          modalConfirmVisible: true
        }
      })
    }

    const formConfirmOpts = {
      listItem: invoiceInfo.dataPos,
      itemHeader: {
        storeId: {
          label: lstorage.getCurrentUserStoreName()
        },
        employeeId: {},
        ...posData
      }
    }

    const modalOpts = {
      visible: modalConfirmVisible,
      modalConfirmVisible,
      user,
      printNo: 1,
      storeInfo,
      ...formConfirmOpts,
      onShowModal () {
        dispatch({
          type: 'posInvoice/updateState',
          payload: {
            modalConfirmVisible: true
          }
        })
      },
      onOkPrint () {
        dispatch({
          type: 'posInvoice/updateState',
          payload: {
            modalConfirmVisible: false
          }
        })
      },
      onCancel () {
        dispatch({
          type: 'posInvoice/updateState',
          payload: {
            modalConfirmVisible: false
          }
        })
      }
    }

    return (
      <LocaleProvider locale={enUS}>
        <div className={styles.invoiceMini}>
          <Header onShowDeliveryOrder={onShowDeliveryOrder} invoiceInfo={invoiceInfo} />
          <Body
            user={app.user}
            standardInvoice={standardInvoice}
            dataPos={invoiceInfo.dataPos || []}
            dataService={invoiceInfo.dataService || []}
            dataGroup={invoiceInfo.dataGroup || []}
            dataConsignment={listPaymentDetail.dataConsignment || []}
          />
          <Total
            directPrinting={directPrinting}
            posData={posData}
            listAmount={listAmount}
            listOpts={listOpts}
            dataPos={invoiceInfo.dataPos || []}
            dataService={invoiceInfo.dataService || []}
            dataGroup={invoiceInfo.dataGroup || []}
            dataConsignment={listPaymentDetail.dataConsignment || []}
          />
          <Member invoiceInfo={invoiceInfo} />
          <TaxInfo posData={posData} />
          {/* <div className={styles.separator} /> */}
          <Footer />
          <MerchantCopy
            posData={posData}
            dataPos={invoiceInfo.dataPos || []}
            dataService={invoiceInfo.dataService || []}
            dataConsignment={listPaymentDetail.dataConsignment || []}
            dataGroup={invoiceInfo.dataGroup || []}
            invoiceInfo={invoiceInfo}
            listAmount={listAmountInvoice}
          />
          {modalConfirmVisible && <ModalConfirm {...modalOpts} />}
        </div>
      </LocaleProvider>
    )
  }
}

export default connect(({
  posInvoice,
  loading,
  app
}) => ({
  posInvoice,
  loading,
  app
}))(Invoice)

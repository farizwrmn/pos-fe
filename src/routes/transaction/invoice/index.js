import React from 'react'
import { connect } from 'dva'
import { posTotal } from 'utils'
import moment from 'moment'
import styles from './index.less'
import Header from './Header'
import Body from './Body'
import Total from './Total'
import Footer from './Footer'
import MerchantCopy from './MerchantCopy'
import Member from './Member'
import { groupProduct } from './utils'

const Invoice = ({ pos, paymentOpts, paymentDetail, app, payment }) => {
  const {
    listPaymentDetail,
    memberPrint,
    mechanicPrint,
    posData
  } = pos
  const {
    listAmount
  } = paymentDetail
  const {
    listOpts
  } = paymentOpts
  const { storeInfo } = app
  const { companyInfo } = payment
  const data = {
    posData,
    data: listPaymentDetail.data,
    memberPrint,
    mechanicPrint,
    companyPrint: storeInfo
  }
  let dataPos = []
  let dataService = []
  let dataGroup = []
  if (data && data.data) {
    for (let n = 0; n < data.data.length; n += 1) {
      if (data.data[n].productCode !== null && data.data[n].bundlingId === null) {
        let productId = data.data[n].productCode
        let productName = data.data[n].productName
        dataPos.push({
          no: '',
          code: productId,
          name: productName,
          bundlingId: data.data[n].bundlingId,
          qty: data.data[n].qty,
          price: data.data[n].sellingPrice,
          sellPrice: data.data[n].sellPrice,
          discount: data.data[n].discount,
          disc1: data.data[n].disc1,
          disc2: data.data[n].disc2,
          disc3: data.data[n].disc3,
          total: posTotal(data.data[n])
        })
      } else if (data.data[n].serviceCode !== null && data.data[n].bundlingId === null) {
        let productId = data.data[n].serviceCode
        let productName = data.data[n].serviceName
        dataService.push({
          no: '',
          code: productId,
          name: productName,
          bundlingId: data.data[n].bundlingId,
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
        let productId = data.data[n].productCode
        let productName = data.data[n].productName
        dataGroup.push({
          no: '',
          code: productId,
          name: productName,
          bundlingId: data.data[n].bundlingId,
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
    dataGroup: groupProduct(dataGroup),
    transDatePrint: moment(`${posData.transDate} ${posData.transNo}`, 'YYYY-MM-DD HH:mm:ss').format('DD MMM YYYY HH:mm'),
    memberId: data.memberPrint.memberCode,
    gender: data.memberPrint.gender,
    company: data.companyPrint,
    lastTransNo: listPaymentDetail.id,
    unitInfo: {
      ...listPaymentDetail
    },
    companyInfo,
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

  return (
    <div className={styles.invoiceMini}>
      <Header invoiceInfo={invoiceInfo} />
      <Body
        dataPos={invoiceInfo.dataPos || []}
        dataService={invoiceInfo.dataService || []}
        dataGroup={invoiceInfo.dataGroup || []}
      />
      <Total
        posData={posData}
        listAmount={listAmount}
        listOpts={listOpts}
        dataPos={invoiceInfo.dataPos || []}
        dataService={invoiceInfo.dataService || []}
      />
      <div className={styles.separator} />
      <Footer />
      <MerchantCopy
        posData={posData}
        dataPos={invoiceInfo.dataPos || []}
        dataService={invoiceInfo.dataService || []}
        invoiceInfo={invoiceInfo}
      />
      <Member invoiceInfo={invoiceInfo} />
    </div>
  )
}

export default connect(({
  pos,
  payment,
  paymentOpts,
  paymentDetail,
  loading,
  app
}) => ({
  pos,
  payment,
  paymentOpts,
  paymentDetail,
  loading,
  app
}))(Invoice)

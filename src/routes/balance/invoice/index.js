import React from 'react'
import { connect } from 'dva'
import moment from 'moment'
// import { lstorage } from 'utils'
import { LocaleProvider } from 'antd'
import enUS from 'antd/lib/locale-provider/en_US'
import styles from './index.less'
import Header from './Header'
import Body from './Body'
import ListPhysicMoneyDeposit from './ListPhysicMoneyDeposit'
// import Footer from './Footer'

const Invoice = ({ posSetoran, physicalMoneyDeposit, balance, balanceDetail, paymentOpts }) => {
  // let defaultRole = (lstorage.getStorageKey('udi')[2] || '')
  const { /* currentItem: pejabatTokoItem, */ list: listPhysicalMoneyDeposit, paymentOptionCashItem } = physicalMoneyDeposit
  const { listEdc, listVoid, listEdcInput, listVoidInput, listTransaction, listVoidTransaction } = posSetoran
  const { currentItem, listBalanceDetail } = balanceDetail
  const { currentItem: balanceItem } = balance
  const { listOpts } = paymentOpts
  if (!currentItem.id) return null
  if (!balanceItem && !balanceItem.approveUser && !balanceItem.approveUser.userName) return null
  // if (!pejabatTokoItem.userName) return null

  const invoiceInfo = {
    pejabatTokoName: balanceItem.approveUser.userName,
    employeeName: currentItem.user.userName,
    dataPos: listBalanceDetail,
    id: currentItem.id,
    userName: currentItem.user.userName,
    storeName: currentItem.store.storeName,
    shift: currentItem.shift.shiftName,
    openDate: moment(currentItem.open).format('DD-MMM-YYYY HH:mm'),
    closeDate: moment(currentItem.closed).format('DD-MMM-YYYY HH:mm')
  }

  const listPhysicMoneyDepositProps = {
    pagination: false,
    defaultExpandAllRows: true,
    currentItem: listPhysicalMoneyDeposit,
    dataSource: listPhysicalMoneyDeposit.detail
  }

  return (
    <LocaleProvider locale={enUS}>
      <div className={styles.invoiceMini}>
        <Header invoiceInfo={invoiceInfo} />
        <Body
          listTransaction={listTransaction}
          listVoidTransaction={listVoidTransaction}
          listEdc={listEdc}
          listVoid={listVoid}
          listEdcInput={listEdcInput}
          listVoidInput={listVoidInput}
          paymentOptionCashId={paymentOptionCashItem.id || 1}
          dataPos={invoiceInfo.dataPos || []}
          listOpts={listOpts || []}
        />
        <ListPhysicMoneyDeposit {...listPhysicMoneyDepositProps} />
        {/* {currentItem && currentItem.closed && moment(moment(currentItem.closed).format('YYYY-MM-DD'), 'YYYY-MM-DD').isBefore(moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD')) ? (defaultRole === 'HKS' || defaultRole === 'ADF' || defaultRole === 'SFC' || defaultRole === 'HFC') ? (
          <div>
            <Body
              dataPos={invoiceInfo.dataPos || []}
              listOpts={listOpts || []}
            />
          </div>
        ) : 'Invalid Role to see the detail' : 'Wait until tommorrow to see the detail'} */}
      </div>
    </LocaleProvider>
  )
}

export default connect(({
  posSetoran, physicalMoneyDeposit, balance, balanceDetail, shift, paymentOpts, loading, app
}) => ({
  posSetoran, physicalMoneyDeposit, balance, balanceDetail, shift, paymentOpts, loading, app
}))(Invoice)

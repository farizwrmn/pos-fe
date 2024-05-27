import React from 'react'

import { Row, Col } from 'antd'
import { BALANCE_TYPE_TRANSACTION } from 'utils/variable'
import { currencyFormatter } from 'utils/string'
import { calculateBalance } from './utils'
import BodyItem from './BodyItem'
import styles from './index.less'

const Body = ({
  listTransaction,
  listVoidTransaction,
  listEdc,
  listVoid,
  listEdcInput,
  listVoidInput,
  dataPos = [],
  paymentOptionCashId = 1
}) => {
  const totalAmountSetoran = calculateBalance(dataPos, paymentOptionCashId)
  const itemListEdcAmount = listEdc.reduce((acc, curr) => acc + curr.amount, 0)
  const itemListEdcInputAmount = listEdcInput.reduce((acc, curr) => acc + curr.total, 0)
  const itemListVoidAmount = listVoid.reduce((acc, curr) => acc + curr.amount, 0)
  const itemListVoidInputAmount = listVoidInput.reduce((acc, curr) => acc + curr.total, 0)
  const lembarListEdcAmount = listEdc.reduce((acc, curr) => acc + curr.lembar, 0)
  const lembarListEdcInputAmount = listEdcInput.reduce((acc, curr) => acc + curr.amount, 0)
  const lembarListVoidAmount = listVoid.reduce((acc, curr) => acc + curr.lembar, 0)
  const lembarListVoidInputAmount = listVoidInput.reduce((acc, curr) => acc + curr.amount, 0)
  const sisaAmountEdc = itemListEdcAmount - itemListEdcInputAmount
  const sisaAmountVoid = itemListVoidAmount - itemListVoidInputAmount
  const sisaLembarEdc = lembarListEdcAmount - lembarListEdcInputAmount
  const sisaLembarVoid = lembarListVoidAmount - lembarListVoidInputAmount


  // list transaction
  let itemXq = (listTransaction || []).filter(item => item.typeCode === 'XQ')
  let itemAGI = (listTransaction || []).filter(item => item.typeCode === 'AGI')
  let itemGM = (listTransaction || []).filter(item => item.typeCode === 'GM')
  let itemVourcher = (listTransaction || []).filter(item => item.typeCode === 'V')
  let itemK3express = (listTransaction || []).filter(item => item.typeCode === 'KX')

  return (
    <div>
      <div className={styles.borderedSection}>
        {dataPos && dataPos
          .map((item, index) => {
            const filteredBalance = dataPos.filter(filteredItem => filteredItem.balanceType === BALANCE_TYPE_TRANSACTION
              && filteredItem.paymentOption.typeCode === item.paymentOption.typeCode)
            let itemTransaction = {}
            if (filteredBalance && filteredBalance[0]) {
              itemTransaction = filteredBalance[0]
            }
            if (item.paymentOption.typeCode === 'C') {
              return (
                <BodyItem key={index} item={item} itemTransaction={itemTransaction} />
              )
            }
            return null
          })}
        <div>
          <div className={styles.item} />
          <Row>
            <Col span={24} className={styles.left}><p>Sales - EDC(DEBIT,CREDIT, QRIS APOS)</p></Col>
          </Row>
          <Row>
            <Col span={12} className={styles.left}>
              <div>
                <p>POS:</p>
                <p>{`(${lembarListEdcAmount} Lembar)`}</p>
                <p>{currencyFormatter(itemListEdcAmount)}</p>
              </div>
            </Col>
            <Col span={12} className={styles.right}>
              <div>
                <p>INPUT:</p>
                <p>{`(${lembarListEdcInputAmount} Lembar)`}</p>
                <p> {currencyFormatter(itemListEdcInputAmount)}</p>
                <p>{`(${sisaLembarEdc} Lembar)`}</p>
                <p>{`(${currencyFormatter(sisaAmountEdc)})`}</p>
              </div>
            </Col>
          </Row>
          <div style={{ margin: '1em' }} />
          <div className={styles.item} />
          <Row>
            <Col span={24} className={styles.left}><p>Void Transaction</p></Col>
          </Row>
          <Row>
            <Col span={12} className={styles.left}>
              <div>
                <p>POS:</p>
                <p>{`(${lembarListVoidAmount} Lembar)`}</p>
                <p>{currencyFormatter(itemListVoidAmount)}</p>
              </div>
            </Col>
            <Col span={12} className={styles.right}>
              <p>INPUT:</p>
              <p>{`(${lembarListVoidInputAmount} Lembar)`}</p>
              <p>{currencyFormatter(itemListVoidInputAmount)}</p>
              <p>{`(${sisaLembarVoid} Lembar)`}</p>
              <p>{`(${currencyFormatter(sisaAmountVoid)})`}</p>
            </Col>
          </Row>
        </div>
        <div style={{ margin: '1em' }} />
        <div className={styles.item} />
        <Row>
          <Col style={{ textAlign: 'left' }}>
            <h3><b>Total Uang Tunai Yang Mau Disetor</b></h3>
          </Col>
          <Col style={{ textAlign: 'left' }}>
            <h3><b>{currencyFormatter(totalAmountSetoran)}</b></h3>
          </Col>
        </Row>
        <div style={{ margin: '1em' }} />
        <div className={styles.item} />
        <Row>
          <Col style={{ textAlign: 'left' }}>
            <h3><b>List Transaksi</b></h3>
          </Col>
          <Col style={{ textAlign: 'left' }}>
            <p>QR AGI: {currencyFormatter(itemAGI && itemAGI.length > 0 && itemAGI[0].balanceIn)}</p>
            <p>XQRIS: {currencyFormatter(itemXq && itemXq.length > 0 && itemXq[0].balanceIn)}</p>
            <p>GRABMART: {currencyFormatter(itemGM && itemGM.length > 0 && itemGM[0].balanceIn)}</p>
            <p>Voucher: {currencyFormatter(itemVourcher && itemVourcher.length > 0 && itemVourcher[0].balanceIn)}</p>
            <p>K3 EXPRESS: {currencyFormatter(itemK3express && itemK3express.length > 0 && itemK3express[0].balanceIn)}</p>
          </Col>
        </Row>
        <div style={{ margin: '1em' }} />
        <div className={styles.item} />
        <Row>
          <Col style={{ textAlign: 'left' }}>
            <h3><b>List Void History</b></h3>
          </Col>
          <Col style={{ textAlign: 'left' }}>
            {(listVoidTransaction || []).map((item) => {
              return (
                <div styles={{ display: 'flex' }}>
                  <p>
                    {`${item.transNo}: ${currencyFormatter(item.total)}`}
                  </p>
                </div>
              )
            })}
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Body

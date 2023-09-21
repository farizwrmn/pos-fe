import React, { Component } from 'react'
import {
  Row,
  Col,
  Card,
  Button,
  Modal
} from 'antd'
import { connect } from 'dva'
import io from 'socket.io-client'
import { APISOCKET } from 'utils/config.company'
import { posTotal, posDiscount, numberFormat } from 'utils'
import styles from './index.less'
import CancelPos from './CancelPos'

const numberFormatter = numberFormat.numberFormatter

const options = {
  upgrade: true,
  transports: ['websocket'],
  pingTimeout: 100,
  pingInterval: 100
}

const socket = io(APISOCKET, options)

class SalesDiscount extends Component {
  componentDidMount () {
    socket.on('salesDiscountRequest', e => this.handleData(e))
  }

  componentWillUnmount () {
    socket.off('salesDiscountRequest')
  }

  handleData () {
    const { dispatch } = this.props
    dispatch({
      type: 'salesDiscount/query'
    })
  }

  render () {
    const {
      salesDiscount,
      loading,
      dispatch
    } = this.props
    const {
      listSalesDiscount,
      listRequestCancel
    } = salesDiscount

    const handleClick = (item) => {
      Modal.confirm({
        title: 'Approve this request',
        onOk () {
          dispatch({
            type: 'salesDiscount/approve',
            payload: {
              id: item.id,
              fingerprintId: item.fingerprintVerification.id
            }
          })
        },
        onCancel () {
          // Cancel
        }
      })
    }

    return (
      <div>
        <Row>
          <Col lg={12}>
            <h1>Approval</h1>
            <div className={styles.content} >
              {listSalesDiscount && listSalesDiscount.length > 0 ? listSalesDiscount.map((item) => {
                return (
                  <Card
                    title={item.value.transNo ? 'Cancel Invoice' : `${item.value.code} - ${item.value.name}`}
                    extra={<Button shape="circle" type="primary" loading={loading.effects['salesDiscount/query']} icon="check" onClick={() => handleClick(item)} />}
                    bordered
                  >
                    {item && item.value && item.value.transNo ? (
                      <CancelPos fingerprintId={item.fingerprintId} transNo={item.value.transNo} memo={item.value.memo} listRequestCancel={listRequestCancel} />
                    )
                      : item && item.discountUser && item.discountUser.fullName ? (
                        <div>
                          <div>{`Created By: ${item.discountUser.fullName}`}</div>
                          <div>{`Total: ${numberFormatter((parseFloat(item.value.sellingPrice || item.value.sellPrice)) * item.value.qty)}`}</div>
                          <div>{`Discount: ${numberFormatter(posDiscount(item.value))}`}</div>
                          <div>{`Netto: ${numberFormatter(posTotal(item.value))}`}</div>
                        </div>
                      ) : null}
                  </Card>
                )
              })
                : (
                  <div>{"Everything's done, have a nice day"} </div>
                )}
            </div>
          </Col>
          <Col lg={12} />
        </Row>
      </div>
    )
  }
}

export default connect(({ salesDiscount, loading }) => ({ salesDiscount, loading }))(SalesDiscount)

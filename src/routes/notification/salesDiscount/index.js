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

const numberFormatter = numberFormat.numberFormatter

const options = {
  upgrade: true,
  transports: ['websocket'],
  pingTimeout: 3000,
  pingInterval: 5000
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
      listSalesDiscount
    } = salesDiscount

    const handleClick = (item) => {
      Modal.confirm({
        title: 'Approve discount request',
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
          <Col lg={6}>
            <h1>Sales Discount</h1>
            <div className={styles.content} >
              {listSalesDiscount && listSalesDiscount.length > 0 ? listSalesDiscount.map((item) => {
                return (
                  <Card
                    title={`${item.value.code} - ${item.value.name}`}
                    extra={<Button shape="circle" type="primary" loading={loading.effects['salesDiscount/query']} icon="check" onClick={() => handleClick(item)} />}
                    bordered
                  >
                    <div>{`Created By: ${item.discountUser.fullName}`}</div>
                    <div>{`Total: ${numberFormatter((parseFloat(item.value.sellingPrice || item.value.sellPrice)) * item.value.qty)}`}</div>
                    <div>{`Discount: ${numberFormatter(posDiscount(item.value))}`}</div>
                    <div>{`Netto: ${numberFormatter(posTotal(item.value))}`}</div>
                  </Card>
                )
              })
                : (
                  <div>{"Everything's done, have a nice day"} </div>
                )}
            </div>
          </Col>
          <Col lg={18} />
        </Row>
      </div>
    )
  }
}

export default connect(({ salesDiscount, loading }) => ({ salesDiscount, loading }))(SalesDiscount)

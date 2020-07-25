import React, { Component } from 'react'
import {
  Row,
  Col,
  Card,
  Button,
  Modal
} from 'antd'
import { connect } from 'dva'
import { numberFormatter } from 'utils/numberFormat'
import styles from './index.less'

class SalesDiscount extends Component {
  handleData () {
    const { dispatch } = this.props
    dispatch({
      type: 'returnSales/query'
    })
  }

  render () {
    const {
      returnSales,
      loading,
      dispatch
    } = this.props
    const {
      list
    } = returnSales

    const handleClick = (item) => {
      Modal.confirm({
        title: 'Approve discount request',
        onOk () {
          dispatch({
            type: 'returnSales/approve',
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
            <h1>Return Request</h1>
            <div className={styles.content} >
              {list && list.length > 0 ? list.map((item) => {
                return (
                  <Card
                    title={`${item.transNo} - ${item.pos.transNo}`}
                    extra={<Button shape="circle" type="primary" loading={loading.effects['returnSales/query']} icon="check" onClick={() => handleClick(item)} />}
                    bordered
                  >
                    {item.memo && <div>{`Memo: ${item.memo}`}</div>}
                    {item.returnSalesDetail && item.returnSalesDetail.map((detail) => {
                      return (
                        <Row >
                          <Col span={12}>{detail.product.productCode}-{detail.product.productName}</Col>
                          <Col span={12} className={styles.right}>{detail.posDetail.qty}x{numberFormatter(detail.posDetail.DPP / detail.posDetail.qty)}</Col>
                        </Row>
                      )
                    })}
                    <div>{`Created By: ${item.createdBy || ''}`}</div>
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

export default connect(({ returnSales, loading }) => ({ returnSales, loading }))(SalesDiscount)

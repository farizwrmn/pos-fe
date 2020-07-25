import React, { Component } from 'react'
import {
  Row,
  Col,
  Card,
  Button,
  Modal
} from 'antd'
import { connect } from 'dva'
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
                    <div>{`Memo: ${item.memo || ''}`}</div>
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

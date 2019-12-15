import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { lstorage } from 'utils'
import { Form, Input, Row, Card } from 'antd'
import TransactionDetail from './TransactionDetail'

const { getCashierTrans } = lstorage
const FormItem = Form.Item

const formItemLayout1 = {
  labelCol: { span: 10 },
  wrapperCol: { span: 11 }
}

const Pos = ({
  dispatch,
  pos
}) => {
  const {
    memberInformation
  } = pos

  // Tambah Kode Ascii untuk shortcut baru di bawah (hanya untuk yang menggunakan kombinasi seperti Ctrl + M)
  let product = getCashierTrans()
  let service = localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')) : []
  let dataPos = product.concat(service)
  const totalDiscount = memberInformation.useLoyalty || 0
  let totalPayment = dataPos.reduce((cnt, o) => cnt + o.total, 0)
  let totalQty = dataPos.reduce((cnt, o) => { return cnt + parseInt(o.qty, 10) }, 0)

  const curNetto = (parseFloat(totalPayment) - parseFloat(totalDiscount)) || 0

  return (
    <div className="content-inner" >
      <Card bordered={false} bodyStyle={{ padding: 0, margin: 0 }} noHovering>
        <TransactionDetail pos={pos} dispatch={dispatch} />
        <Form>
          <div style={{ float: 'right' }}>
            <Row>
              <FormItem label="Total Qty" {...formItemLayout1}>
                <Input value={totalQty.toLocaleString()} style={{ fontSize: 20 }} />
              </FormItem>
            </Row>
            <Row>
              <FormItem label="Total" {...formItemLayout1}>
                <Input value={totalPayment.toLocaleString()} style={{ fontSize: 20 }} />
              </FormItem>
            </Row>
            <Row>
              <FormItem label="Disc. Cashback" {...formItemLayout1}>
                <Input value={totalDiscount.toLocaleString()} style={{ fontSize: 20 }} />
              </FormItem>
            </Row>
            <Row>
              <FormItem label="Netto" {...formItemLayout1}>
                <Input value={curNetto.toLocaleString()} style={{ fontSize: 20 }} />
              </FormItem>
            </Row>
          </div>
        </Form>
      </Card>
    </div >
  )
}

Pos.propTypes = {
  pos: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  loading: PropTypes.object.isRequired
}

export default connect(({
  pos, loading
}) => ({
  pos, loading
}))(Pos)

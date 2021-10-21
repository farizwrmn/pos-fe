import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { lstorage } from 'utils'
import { Form, Input, Row, Col, Card } from 'antd'
import { IMAGEURL } from 'utils/config.company'
import TransactionDetail from './TransactionDetail'
import { groupProduct } from './utils'

const { getCashierTrans, getBundleTrans, getServiceTrans, getConsignment } = lstorage
const FormItem = Form.Item

const formItemLayout1 = {
  labelCol: { span: 10 },
  wrapperCol: { span: 11 }
}

function addHandler (ele, trigger, handler) {
  if (window.addEventListener) {
    ele.addEventListener(trigger, handler, false)
    return false
  }
  window.attachEvent(trigger, handler)
}

function removeHandler (ele, trigger, handler) {
  if (window.addEventListener) {
    ele.removeEventListener(trigger, handler, false)
    return false
  }
  window.attachEvent(trigger, handler)
}

class Pos extends Component {
  state = {
    dineInTax: localStorage.getItem('dineInTax') ? Number(localStorage.getItem('dineInTax')) : 0,
    product: [],
    bundle: [],
    service: [],
    consignment: [],
    memberInformation: {}
  }

  componentDidMount () {
    addHandler(window, 'storage', data => this.setListData(data))
    this.setListData({ key: 'cashier_trans' })
  }

  componentWillUnmount () {
    removeHandler(window, 'storage', data => this.setListData(data))
  }

  setListData (data) {
    if (data && (data.key === 'dineInTax' || data.key === 'member' || data.key === 'bundle_promo' || data.key === 'cashier_trans' || data.key === 'consignment' || data.key === 'service_detail')) {
      this.setState({ loading: true })
      const bundleItem = getBundleTrans()
      const product = getCashierTrans()
      const service = getServiceTrans()
      const consignment = getConsignment()
      const bundle = groupProduct((product.filter(filtered => filtered.bundleId))
        .concat(service.filter(filtered => filtered.bundleId)), bundleItem)
      this.setState({
        dineInTax: Number(localStorage.getItem('dineInTax')),
        bundle,
        product,
        service: service.filter(filtered => !filtered.bundleId),
        consignment,
        memberInformation: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0] : []
      })
      this.setState({ loading: false })
    }
  }

  render () {
    const { dispatch, pos } = this.props
    const {
      dineInTax,
      product,
      bundle,
      service,
      consignment,
      loading,
      memberInformation
    } = this.state
    const { currentStore } = pos

    // Tambah Kode Ascii untuk shortcut baru di bawah (hanya untuk yang menggunakan kombinasi seperti Ctrl + M)
    let dataPos = product.filter(filtered => !filtered.bundleId).concat(bundle).concat(service).concat(consignment)
    const totalDiscount = memberInformation.useLoyalty || 0
    let totalPayment = dataPos.reduce((cnt, o) => cnt + o.total, 0)
    let totalQty = dataPos.reduce((cnt, o) => { return cnt + parseInt(o.qty, 10) }, 0)

    const curNetto = (parseFloat(totalPayment) - parseFloat(totalDiscount)) || 0
    const dineIn = curNetto * (dineInTax / 100)

    return (
      <div className="content-inner" >
        <Card bordered={false} bodyStyle={{ padding: 0, margin: 0 }} noHovering>
          <Row>
            <Col span={16}>
              <TransactionDetail
                pos={pos}
                dispatch={dispatch}
                bundle={bundle}
                product={product}
                service={service}
                consignment={consignment}
                loading={loading}
              />
            </Col>
            <Col span={8} style={{ alignItems: 'center', textAlign: 'center' }} >
              <Card bordered={false} bodyStyle={{ padding: 0, margin: 0 }} noHovering>
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
                      <FormItem label="Service Charge" {...formItemLayout1}>
                        <Input value={dineIn.toLocaleString()} style={{ fontSize: 20 }} />
                      </FormItem>
                      <FormItem label="Netto" {...formItemLayout1}>
                        <Input value={(parseFloat(curNetto) + parseFloat(dineIn)).toLocaleString()} style={{ fontSize: 20 }} />
                      </FormItem>
                    </Row>
                  </div>
                </Form>
              </Card>
              <img src={`${IMAGEURL}/${currentStore.photoQris}`} width="auto" height="400px" alt="img_qris.png" />
            </Col>
          </Row>
        </Card>
      </div>
    )
  }
}

Pos.propTypes = {
  pos: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  loading: PropTypes.object.isRequired
}

export default connect(({
  pos, loading
}) => ({
  pos, loading
}))(Pos)

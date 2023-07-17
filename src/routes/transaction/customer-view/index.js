import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { lstorage } from 'utils'
import {
  Form,
  Input,
  Row,
  Col,
  Card
} from 'antd'
import { IMAGEURL } from 'utils/config.company'
import TransactionDetail from './TransactionDetail'
import { groupProduct } from './utils'
import Advertising from '../pos/Advertising'
import DynamicQrisTemplate from './DynamicQrisTemplate'

const {
  getQrisImage,
  getDynamicQrisImage,
  getCashierTrans,
  getBundleTrans,
  getServiceTrans,
  getConsignment,
  getDynamicQrisTimeLimit
} = lstorage
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
    memberInformation: {},
    qrisImage: null,
    dynamicQrisImage: null,
    dynamicQrisTimeLimit: null
  }

  componentDidMount () {
    addHandler(window, 'storage', data => this.setListData(data))
    this.setListData({ key: 'cashier_trans' })
    this.setListData({ key: 'qris_image' })
    this.setListData({ key: 'dynamic_qris_image' })
    this.setListData({ key: 'dynamic_qris_time_limit' })
  }

  componentWillUnmount () {
    removeHandler(window, 'storage', data => this.setListData(data))
  }

  setListData (data) {
    if (data && data.key === 'dynamic_qris_time_limit') {
      const timeLimit = getDynamicQrisTimeLimit()
      this.setState({ dynamicQrisTimeLimit: Number(timeLimit) })
    }
    if (data && data.key === 'qris_image') {
      const qrisImage = getQrisImage()
      this.setState({ qrisImage })
    }
    if (data && data.key === 'dynamic_qris_image') {
      const dynamicQrisImage = getDynamicQrisImage()
      this.setState({ dynamicQrisImage })
    }
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
      memberInformation,
      qrisImage,
      dynamicQrisImage,
      dynamicQrisTimeLimit
    } = this.state
    const { listAdvertisingCustomer } = pos

    // Tambah Kode Ascii untuk shortcut baru di bawah (hanya untuk yang menggunakan kombinasi seperti Ctrl + M)
    let dataPos = product.filter(filtered => !filtered.bundleId).concat(bundle).concat(service).concat(consignment)
    const totalDiscount = memberInformation.useLoyalty || 0
    let totalPayment = dataPos.reduce((cnt, o) => cnt + o.total, 0)
    let totalQty = dataPos.reduce((cnt, o) => { return cnt + parseInt(o.qty, 10) }, 0)

    const curNetto = (parseFloat(totalPayment) - parseFloat(totalDiscount)) || 0
    const dineIn = curNetto * (dineInTax / 100)

    const dynamicQrisTemplateProps = {
      total: totalPayment,
      qrisImage: dynamicQrisImage,
      dynamicQrisTimeLimit
    }

    return (
      <div className="content-inner" >
        <Card bordered={false} bodyStyle={{ padding: 0, margin: 0 }} noHovering>
          <Row style={{ overflowY: 'scroll' }}>
            <Col span={14}>
              <Card bordered={false} bodyStyle={{ padding: 0, margin: 0 }} noHovering>
                <Form>
                  <div style={{ float: 'right' }}>
                    <Row>
                      <FormItem label="Total Qty" {...formItemLayout1}>
                        <Input value={totalQty.toLocaleString()} style={{ fontSize: 20 }} />
                      </FormItem>
                      <FormItem label="Netto" {...formItemLayout1}>
                        <Input value={(parseFloat(curNetto) + parseFloat(dineIn)).toLocaleString()} style={{ fontSize: 20 }} />
                      </FormItem>
                    </Row>
                  </div>
                </Form>
              </Card>
              <TransactionDetail
                qty={totalQty || 0}
                netto={parseFloat(curNetto) + parseFloat(dineIn)}
                pos={pos}
                dispatch={dispatch}
                bundle={bundle}
                product={product}
                service={service}
                consignment={consignment}
                loading={loading}
              />
            </Col>
            <Col span={10} style={{ alignItems: 'center', textAlign: 'center' }} >
              {qrisImage ? <img src={`${IMAGEURL}/${qrisImage}`} width="auto" height="400px" alt="img_qris.png" />
                : (dynamicQrisImage && dynamicQrisTimeLimit > 0) ? (
                  <DynamicQrisTemplate {...dynamicQrisTemplateProps} />
                ) : (
                  <Advertising list={listAdvertisingCustomer} />
                )}
              {/* <img src={`${IMAGEURL}/${currentStore.photoQris}`} width="auto" height="400px" alt="img_qris.png" /> */}
              {/* <Card bordered={false} bodyStyle={{ padding: 0, margin: 0 }} noHovering>
                <Form>
                  <div style={{ float: 'right' }}>
                    <Row>
                      <FormItem label="Total Qty" {...formItemLayout1}>
                        <Input value={totalQty.toLocaleString()} style={{ fontSize: 20 }} />
                      </FormItem>
                      <FormItem label="Netto" {...formItemLayout1}>
                        <Input value={(parseFloat(curNetto) + parseFloat(dineIn)).toLocaleString()} style={{ fontSize: 20 }} />
                      </FormItem>
                    </Row>
                  </div>
                </Form>
              </Card> */}
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
  dispatch: PropTypes.func.isRequired
  // loading: PropTypes.object.isRequired
}

export default connect(({
  pos, loading
}) => ({
  pos, loading
}))(Pos)

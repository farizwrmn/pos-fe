import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { lstorage } from 'utils'
import {
  Form,
  Input,
  Row,
  Col,
  Card,
  Button,
  Icon
} from 'antd'
import { IMAGEURL } from 'utils/config.company'
import TransactionDetail from './TransactionDetail'
import { groupProduct } from './utils'
import Advertising from '../pos/Advertising'
import DynamicQrisTemplate from './DynamicQrisTemplate'
import LatestTransaction from './LatestTransaction'
import styles from './index.less'

const {
  getQrisImage,
  getDynamicQrisImage,
  getQrisMerchantTradeNo,
  getCashierTrans,
  getBundleTrans,
  getServiceTrans,
  getConsignment,
  getDynamicQrisTimeLimit,
  getDynamicQrisImageTTL,
  getQrisPaymentLastTransaction
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
    qrisMerchantTradeNo: null,
    dynamicQrisTimeLimit: null,
    dynamicQrisLatestTransaction: null
  }

  componentDidMount () {
    addHandler(window, 'storage', data => this.setListData(data))
    this.setListData({ key: 'cashier_trans' })
    this.setListData({ key: 'qris_image' })
    this.setListData({ key: 'paylabs_dynamic_qris_image' })
    this.setListData({ key: 'dynamic_qris_time_limit' })
    this.setListData({ key: 'qris_latest_transaction' })
  }

  componentWillUnmount () {
    removeHandler(window, 'storage', data => this.setListData(data))
  }

  setListData (data) {
    if (data && data.key === 'qris_latest_transaction') {
      const qrisLatestTransaction = getQrisPaymentLastTransaction()
      this.setState({ dynamicQrisLatestTransaction: qrisLatestTransaction })
    }
    if (data && data.key === 'qris_merchant_trade_number') {
      const qrisMerchantTradeNo = getQrisMerchantTradeNo()
      this.setState({ qrisMerchantTradeNo })
    }
    if (data && data.key === 'dynamic_qris_time_limit') {
      const dynamicQrisTTL = getDynamicQrisImageTTL()
      const dynamicQrisTimeLimit = getDynamicQrisTimeLimit()
      const timeLimit = Number(dynamicQrisTTL || dynamicQrisTimeLimit)
      this.setState({ dynamicQrisTimeLimit: timeLimit })
    }
    if (data && data.key === 'qris_image') {
      const qrisImage = getQrisImage()
      this.setState({ qrisImage })
    }
    if (data && data.key === 'paylabs_dynamic_qris_image') {
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
      qrisMerchantTradeNo,
      dynamicQrisTimeLimit,
      dynamicQrisLatestTransaction
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
      dynamicQrisTimeLimit,
      qrisMerchantTradeNo,
      onTimeout: () => {
        this.setState({
          dynamicQrisImage: null
        })
      }
    }

    const latestTransactionProps = {
      dynamicQrisLatestTransaction,
      onTimeOut: () => {
        this.setState({
          dynamicQrisLatestTransaction: null
        })
      }
    }

    const total = (parseFloat(curNetto) + parseFloat(dineIn)).toLocaleString()
    const totalFormatCurrency = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')

    return (
      <div className="content-inner" >
        <Card bordered={false} bodyStyle={{ padding: 0, margin: 0 }} noHovering>
          <Row gutter={40}  style={{ overflowY: 'scroll' }}>
            <Col span={14}>
              <Row style={{ backgroundColor: '#FFEAF5', padding: 20, marginBottom: 40, borderRadius: 5 }}>
                <Col md={24} lg={18}>
                  <div className={styles.textSmall}>안녕 하세요 | Anyeonghaseo</div>
                  <div className={styles.textMemberName}>{memberInformation.memberName}</div>
                  <Button
                    type="button"
                    className={styles.row}
                  >
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      <div className={`${styles.textSmall} `} style={{ color: 'rgb(255, 255, 255)', marginRight: 4 }}>You have{' '}</div>
                      <div className={`${styles.textSmallBold}`} style={{ color: 'rgb(255, 255, 255)' }}>
                        {memberInformation.cashback} Coins
                      </div>
                    </div>
                  </Button>
                </Col>

                <Col md={24} lg={6} style={{ textAlign: 'center' }}>
                  <div className={styles.rowSpaceBetween}>
                    <div className={styles.textMedium}>Quantity: </div>
                    <div className={styles.textMediumBold}>{totalQty.toLocaleString()}</div>
                  </div>
                  <div className={styles.rowSpaceBetween}>
                    <div className={styles.textMedium}>Price: </div>
                    <div className={styles.textMediumBold}>Rp {totalFormatCurrency}</div>
                  </div>
                </Col>
              </Row>
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
              {dynamicQrisLatestTransaction && (
                <LatestTransaction {...latestTransactionProps} />
              )}
              {qrisImage ? <img src={`${IMAGEURL}/${qrisImage}`} width="auto" height="400px" alt="img_qris.png" />
                : (dynamicQrisImage !== null && dynamicQrisTimeLimit > 0) ? (
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

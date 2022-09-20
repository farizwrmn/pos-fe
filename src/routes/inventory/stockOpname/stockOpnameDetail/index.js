import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import {
  Modal,
  Row,
  Col,
  Tag,
  Spin,
  Button,
  Form,
  Select
} from 'antd'
import io from 'socket.io-client'
import { APISOCKET } from 'utils/config.company'
import TransDetail from './TransDetail'
import styles from './index.less'
import ModalEdit from './ModalEdit'

const { Option } = Select

const options = {
  upgrade: true,
  transports: ['websocket'],
  pingTimeout: 40000,
  pingInterval: 4000
}

const formItemLayout = {
  labelCol: {
    span: 10
  },
  wrapperCol: {
    span: 14
  }
}

const socket = io(APISOCKET, options)

const FormItem = Form.Item

class Detail extends Component {
  componentDidMount () {
    this.setSocket()
  }

  componentWillUnmount () {
    const { stockOpname } = this.props
    const { detailData } = stockOpname
    if (detailData && detailData.id) {
      socket.off(`stock-opname/${detailData.id}`)
    }
  }

  setSocket = () => {
    const { stockOpname } = this.props
    const { detailData } = stockOpname
    if (detailData && detailData.id) {
      socket.on(`stock-opname/${detailData.id}`, this.handleData)
    }
  }

  handleData = () => {
    const { dispatch, stockOpname } = this.props
    const { detailData } = stockOpname
    dispatch({
      type: 'stockOpname/queryDetailData',
      payload: {
        page: 1,
        pageSize: 40,
        status: ['DIFF', 'CONFLICT', 'MISS'],
        order: '-updatedAt',
        transId: detailData.id,
        storeId: detailData.storeId,
        batchId: detailData.activeBatch.id
      }
    })
  }

  render () {
    const {
      stockOpname,
      loading,
      form: { getFieldDecorator, validateFields, getFieldsValue, resetFields },
      dispatch
    } = this.props
    const { listDetail, listDetailFinish, listEmployee, modalEditVisible, modalEditItem, detailData, detailPagination } = stockOpname
    const content = []
    for (let key in detailData) {
      if ({}.hasOwnProperty.call(detailData, key)) {
        if (key !== 'policeNoId' && key !== 'storeId' && key !== 'id' && key !== 'memberId') {
          content.push(
            <div key={key} className={styles.item}>
              <div>{key}</div>
              <div>{String(detailData[key])}</div>
            </div>
          )
        }
      }
    }

    const getTag = (record) => {
      if (record.status === 1) {
        return <Tag color="green">Finish</Tag>
      }
      return <Tag color="yellow">In Progress</Tag>
    }

    if (!detailData.id) {
      return <Spin size="large" />
    }

    const BackToList = () => {
      dispatch(routerRedux.push('/stock-opname?activeKey=0'))
    }

    const formDetailProps = {
      dataSource: listDetail,
      loading: loading.effects['stockOpname/queryDetailData'],
      dispatch,
      detailData,
      pagination: detailPagination,
      onRowClick (record) {
        dispatch({
          type: 'stockOpname/updateState',
          payload: {
            modalEditItem: record,
            modalEditVisible: true
          }
        })
      }
    }

    const formDetailFinishProps = {
      dataSource: listDetailFinish,
      loading: loading.effects['stockOpname/queryDetailDataFinished'],
      dispatch,
      detailData,
      onRowClick () {

      }
    }

    const onBatch2 = () => {
      validateFields((errors) => {
        if (errors) return
        const data = getFieldsValue()
        Modal.confirm({
          title: 'Finish batch',
          content: 'This process cannot be undone',
          onOk () {
            dispatch({
              type: 'stockOpname/insertBatchTwo',
              payload: {
                transId: detailData.id,
                userId: data.userId,
                batchNumber: 2,
                description: null,
                reset: resetFields
              }
            })
          },
          onCancel () {

          }
        })
      })
    }

    const modalEditProps = {
      visible: modalEditVisible,
      item: modalEditItem,
      detailData,
      loading: loading.effects['pos/queryPosDetail'],
      maskClosable: false,
      title: 'Update as finish?',
      confirmLoading: loading.effects['stockOpname/finishLine'] || loading.effects['stockOpname/editQty'],
      wrapClassName: 'vertical-center-modal',
      onOk (data) {
        dispatch({
          type: 'stockOpname/finishLine',
          payload: data
        })
      },
      onCancel () {
        dispatch({
          type: 'stockOpname/updateState',
          payload: {
            modalEditVisible: false
          }
        })
      }
    }

    const childrenEmployee = listEmployee && listEmployee.length > 0 ? listEmployee.map(list => <Option value={list.id}>{list.employeeName}</Option>) : []

    return (<div className="wrapper">
      <Row>
        <Col lg={8}>
          <div className="content-inner-zero-min-height">
            <Button type="primary" icon="rollback" onClick={() => BackToList()}>Back</Button>
            <h1>Detail Info</h1>
            <div className={styles.content}>
              <Row>
                <Col span={12}><strong>STORE</strong></Col>
                <Col span={12}><strong>{detailData && detailData.store ? detailData.store.storeName : ''}</strong></Col>
              </Row>
              <Row>
                <Col span={12}>BATCH NUMBER</Col>
                <Col span={12}>{`Phase ${detailData && detailData.activeBatch ? detailData.activeBatch.batchNumber : ''}`}</Col>
              </Row>
              <Row>
                <Col span={12}>Status</Col>
                <Col span={12}>{getTag(detailData)}</Col>
              </Row>
              <Row>
                <Form layout="horizontal">
                  <FormItem label="PIC" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('userId', {
                      rules: [
                        {
                          required: true
                        }
                      ]
                    })(
                      <Select
                        showSearch
                        allowClear
                        multiple
                        optionFilterProp="children"
                        placeholder="Choose Employee"
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
                      >
                        {childrenEmployee}
                      </Select>
                    )}
                  </FormItem>
                </Form>
              </Row>
            </div>
          </div>
        </Col>
        <Col lg={24}>
          <div className="content-inner-zero-min-height">
            {detailData && detailData.batch && detailData.activeBatch && detailData.activeBatch.batchNumber === 1 ? <Button disabled={loading.effects['stockOpname/insertBatchTwo']} type="primary" icon="save" onClick={() => onBatch2()}>Go To Batch Two</Button> : null}
            <h1>Items</h1>
            <Row style={{ padding: '10px', margin: '4px' }}>
              <TransDetail {...formDetailProps} />
              <br />
              <br />
              <TransDetail {...formDetailFinishProps} />
              {modalEditVisible && <ModalEdit {...modalEditProps} />}
            </Row>
          </div>
        </Col>
      </Row>
    </div>)
  }
}

Detail.propTypes = {
  loading: PropTypes.object,
  app: PropTypes.object,
  stockOpname: PropTypes.object
}

export default connect(({ loading, app, stockOpname }) => ({ loading, app, stockOpname }))(Form.create()(Detail))

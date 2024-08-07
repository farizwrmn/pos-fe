import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { lstorage } from 'utils'
import numberFormat from 'utils/numberFormat'
import {
  Modal,
  Row,
  Col,
  Tag,
  Spin,
  Button
} from 'antd'
import io from 'socket.io-client'
import { APISOCKET } from 'utils/config.company'
import TransDetail from './TransDetail'
import styles from './index.less'
// import ModalEdit from './ModalEdit'
import ModalEmployee from './ModalEmployee'
import ModalPhaseTwo from './ModalPhaseTwo'
import ListEmployee from './ListEmployee'
import ListEmployeePhase2 from './ListEmployeePhase2'
import PrintXLS from './PrintXLS'

const { numberFormatter } = numberFormat

const options = {
  upgrade: true,
  transports: ['websocket'],
  pingTimeout: 40000,
  pingInterval: 4000
}

const socket = io(APISOCKET, options)

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
      type: 'stockOpname/queryDetail',
      payload: {
        id: detailData.id,
        storeId: lstorage.getCurrentUserStore()
      }
    })
  }

  render () {
    const {
      stockOpname,
      loading,
      app,
      dispatch
    } = this.props
    const { storeInfo } = app
    const { modalPhaseOneVisible, modalPhaseTwoVisible, listEmployeePhase2, listEmployeeOnCharge, modalAddEmployeeVisible, listEmployee, listDetail, listReport, listDetailFinish, detailData, finishPagination, detailPagination
      // modalEditVisible, modalEditItem,
    } = stockOpname
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

    const printProps = {
      listTrans: listReport,
      storeInfo
    }

    const listEmployeeProps = {
      dataSource: listEmployeeOnCharge
    }

    const listEmployeePhase2Props = {
      dataSource: listEmployeePhase2
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
      window.history.back()
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

    const onBatch1 = () => {
      dispatch({
        type: 'stockOpname/updateState',
        payload: {
          modalPhaseOneVisible: true
        }
      })
    }

    const onBatch2 = () => {
      dispatch({
        type: 'stockOpname/updateState',
        payload: {
          modalPhaseTwoVisible: true
        }
      })
    }

    const onShowAdjustDialog = () => {
      Modal.confirm({
        title: 'Finish Batch 2',
        content: 'Are you sure ?',
        onOk () {
          dispatch({
            type: 'stockOpname/updateFinishBatch2',
            payload: {
              detailData
            }
          })
        }
      })
    }

    // const modalEditProps = {
    //   visible: modalEditVisible,
    //   item: modalEditItem,
    //   detailData,
    //   loading: loading.effects['pos/queryPosDetail'],
    //   maskClosable: false,
    //   title: modalEditItem ? modalEditItem.productCode : 'Update as finish?',
    //   confirmLoading: loading.effects['stockOpname/finishLine'] || loading.effects['stockOpname/editQty'],
    //   wrapClassName: 'vertical-center-modal',
    //   onOk (data) {
    //     dispatch({
    //       type: 'stockOpname/finishLine',
    //       payload: data
    //     })
    //   },
    //   onCancel () {
    //     dispatch({
    //       type: 'stockOpname/updateState',
    //       payload: {
    //         modalEditVisible: false
    //       }
    //     })
    //   }
    // }

    const modalAddEmployeeProps = {
      listEmployee,
      detailData,
      title: 'Modal Add Employee',
      visible: modalAddEmployeeVisible,
      onOk (data, reset) {
        dispatch({
          type: 'stockOpname/insertEmployee',
          payload: {
            data,
            detailData,
            reset
          }
        })
      },
      onCancel () {
        dispatch({
          type: 'stockOpname/updateState',
          payload: {
            modalAddEmployeeVisible: false
          }
        })
      }
    }

    const modalPhaseOneProps = {
      listEmployee,
      detailData,
      phaseNumber: 1,
      title: 'Modal Phase 1',
      visible: modalPhaseOneVisible,
      onOk (data, resetFields) {
        dispatch({
          type: 'stockOpname/updateState',
          payload: {
            modalPhaseOneVisible: false
          }
        })
        dispatch({
          type: 'stockOpname/insertBatchTwo',
          payload: {
            transId: detailData.id,
            storeId: detailData.storeId,
            userId: data.userId,
            batchNumber: 1,
            description: null,
            reset: resetFields
          }
        })
      },
      onCancel () {
        dispatch({
          type: 'stockOpname/updateState',
          payload: {
            modalPhaseOneVisible: false
          }
        })
      }
    }

    const modalPhaseTwoProps = {
      listEmployee,
      detailData,
      phaseNumber: 2,
      title: 'Modal Phase 2',
      visible: modalPhaseTwoVisible,
      onOk (data, resetFields) {
        dispatch({
          type: 'stockOpname/updateState',
          payload: {
            modalPhaseTwoVisible: false
          }
        })
        dispatch({
          type: 'stockOpname/insertBatchTwo',
          payload: {
            transId: detailData.id,
            storeId: detailData.storeId,
            userId: data.userId,
            batchNumber: 2,
            description: null,
            reset: resetFields
          }
        })
      },
      onCancel () {
        dispatch({
          type: 'stockOpname/updateState',
          payload: {
            modalPhaseTwoVisible: false
          }
        })
      }
    }

    const onAddEmployee = () => {
      dispatch({
        type: 'stockOpname/updateState',
        payload: {
          modalAddEmployeeVisible: true
        }
      })
    }

    // const childrenEmployee = listEmployee && listEmployee.length > 0 ? listEmployee.map(list => <Option value={list.id}>{list.employeeName}</Option>) : []

    return (<div className="wrapper">
      <Row>
        <div className="content-inner-zero-min-height">
          <Button type="default" icon="rollback" style={{ marginRight: '10px' }} onClick={() => BackToList()}>Back</Button>
          {detailData && detailData.batch && detailData.batch.length === 0
            ? <Button style={{ marginRight: '10px' }} disabled={loading.effects['stockOpname/insertBatchTwo']} type="primary" icon="save" onClick={() => onBatch1()}>{'Start Massive Checking (Phase 1)'}</Button>
            : detailData && detailData.batch && detailData.activeBatch && detailData.activeBatch.batchNumber === 1 && !detailData.activeBatch.status
              ? <Button style={{ marginRight: '10px' }} disabled={loading.effects['stockOpname/insertBatchTwo']} type="primary" icon="save" onClick={() => onBatch2()}>{'Start Delegate Checking (Phase 2)'}</Button>
              : detailData && detailData.batch && detailData.activeBatch && detailData.activeBatch.batchNumber === 2 && !detailData.activeBatch.status
                ? <Button style={{ marginRight: '10px' }} disabled={loading.effects['stockOpname/insertBatchTwo'] || loading.effects['stockOpname/updateFinishBatch2']} type="primary" icon="save" onClick={() => onShowAdjustDialog()}>{'Finish (Phase 2)'}</Button> : null}
          <PrintXLS {...printProps} />
        </div>
      </Row>
      <Row>
        <Col lg={12}>
          <div className="content-inner-zero-min-height">
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
              {detailData && detailData.adjustInId ? <Row>
                <Col span={12}>Adjust In</Col>
                <Col span={12}><a target="_blank" href={`/transaction/adjust/${detailData.adjustInId}`}>{detailData.adjustInId}</a></Col>
              </Row> : null}
              {detailData && detailData.adjustOutId ? <Row>
                <Col span={12}>Adjust Out</Col>
                <Col span={12}><a target="_blank" href={`/transaction/adjust/${detailData.adjustOutId}`}>{detailData.adjustOutId}</a></Col>
              </Row> : null}
            </div>
          </div>
        </Col>
        <Col lg={12}>
          <div className="content-inner-zero-min-height">
            <h1>Product Info</h1>
            <div className={styles.content}>
              {detailData && detailData.batch && detailData.activeBatch && detailData.activeBatch.batchNumber === 1 && !detailData.activeBatch.status ? (
                <Row>
                  <Col span={12}>Total Balance</Col>
                  <Col span={12}>{detailData && detailData.totalBalance ? numberFormatter(detailData.totalBalance) : 0}</Col>
                </Row>) : null
              }
              <Row>
                <Col span={12}>Total Checked</Col>
                <Col span={12}>{detailData && detailData.totalChecked ? numberFormatter(detailData.totalChecked) : 0}</Col>
              </Row>
              <Row style={{ color: 'red' }}>
                <Col span={12}>Total Biaya</Col>
                <Col span={12}>{detailData && detailData.totalCost ? `Rp ${numberFormatter(detailData.totalCost)}` : 0}</Col>
              </Row>
              <Row style={{ color: 'green' }}>
                <Col span={12}>Plus</Col>
                <Col span={12}>{detailData && detailData.totalPlus ? `Rp ${numberFormatter(detailData.totalPlus)}` : 0}</Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col lg={24}>
          <div className="content-inner-zero-min-height">
            {detailData && detailData.batch && detailData.activeBatch && detailData.activeBatch.batchNumber === 1 && !detailData.activeBatch.status ? (
              <Row style={{ padding: '10px', margin: '4px' }}>
                <div>
                  <Col md={24} lg={24}><Button disabled={loading.effects['stockOpname/insertEmployeePhase1']} type="primary" icon="save" onClick={() => onAddEmployee()}>Add Employee</Button></Col>
                  <Col md={24} lg={12}><ListEmployee {...listEmployeeProps} /></Col>
                </div>
              </Row>
            ) : null}
            {detailData && detailData.batch && detailData.activeBatch && detailData.activeBatch.batchNumber === 2 && !detailData.activeBatch.status ? (
              <Row style={{ padding: '10px', margin: '4px' }}>
                <div>
                  <Col md={24} lg={12}><ListEmployeePhase2 {...listEmployeePhase2Props} /></Col>
                </div>
              </Row>
            ) : null}
            <Row style={{ padding: '10px', margin: '4px' }}>
              {listDetail && listDetail.length > 0 && listDetailFinish && listDetailFinish.length > 0 ? <h1>Conflict ({detailPagination ? detailPagination.total : 0})</h1> : null}
              {listDetail && listDetail.length > 0 ? <TransDetail {...formDetailProps} /> : null}
              <br />
              <br />
              {listDetail && listDetail.length > 0 && listDetailFinish && listDetailFinish.length > 0 ? <h1>Checked ({finishPagination ? finishPagination.total : 0})</h1> : null}
              {listDetailFinish && listDetailFinish.length > 0 ? <TransDetail {...formDetailFinishProps} /> : null}
              {/* {modalEditVisible && <ModalEdit {...modalEditProps} />} */}
            </Row>
          </div>
        </Col>
      </Row>
      {modalAddEmployeeVisible && <ModalEmployee {...modalAddEmployeeProps} />}
      {modalPhaseOneVisible && <ModalPhaseTwo {...modalPhaseOneProps} />}
      {modalPhaseTwoVisible && <ModalPhaseTwo {...modalPhaseTwoProps} />}
    </div >)
  }
}

Detail.propTypes = {
  loading: PropTypes.object,
  app: PropTypes.object,
  stockOpname: PropTypes.object
}

export default connect(({ loading, app, stockOpname }) => ({ loading, app, stockOpname }))(Detail)

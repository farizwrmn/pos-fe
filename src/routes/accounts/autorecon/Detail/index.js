import { Button, Col, Icon, Modal, Row, message } from 'antd'
import { connect } from 'dva'
import moment from 'moment'
import { routerRedux } from 'dva/router'
import ListPayment from './List/ListPayment'
import ListPaymentImport from './List/ListPaymentImport'
import ListLedger from './List/ListLedger'
import FormEntry from './FormEntry'
import ListEntry from './List/ListEntry'
import Form from './Form'

const paymentColumnProps = {
  xs: 24,
  sm: 24,
  md: 11,
  lg: 11,
  xl: 11
}

const parentColumnProps = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 12,
  xl: 12
}

const Detail = ({ autorecon, loading, dispatch, accountRule }) => {
  const { detail, modalVisible, ledgerEntry, currentLedgerEntry, resolveModalVisible } = autorecon
  const { data, accountLedgerData, paymentImportData, paymentData } = detail
  const { listAccountCodeLov } = accountRule

  let listPaymentProps = {
    paymentData,
    loading
  }

  let listPaymentImportProps = {
    paymentImportData,
    loading
  }

  let listLedgerProps = {
    dataSource: accountLedgerData,
    loading
  }

  const showModalInfo = () => {
    const rowStyle = { marginBottom: '10px', fontSize: '14px' }
    const rightColumnStyle = { textAlign: 'end' }
    Modal.info({
      okText: 'Close',
      title: 'Resolve Info',
      content: (
        <Col>
          <Row style={rowStyle}>
            <Col span={12}>
              Created By
            </Col>
            <Col span={12} style={rightColumnStyle}>
              {data.createdByAdmin ? data.createdByAdmin.userName : '-'}
            </Col>
          </Row>
          <Row style={rowStyle}>
            <Col span={12}>
              Created At
            </Col>
            <Col span={12} style={rightColumnStyle}>
              {data.createdAt ? moment(data.createdAt).format('DD MMM YYYY, HH:mm') : '-'}
            </Col>
          </Row>
          <Row style={rowStyle}>
            <Col span={12}>
              Resolved By
            </Col>
            <Col span={12} style={rightColumnStyle}>
              {data.resolvedByAdmin ? data.resolvedByAdmin.userName : '-'}
            </Col>
          </Row>
          <Row style={rowStyle}>
            <Col span={12}>
              Resolved At
            </Col>
            <Col span={12} style={rightColumnStyle}>
              {data.resolvedAt ? moment(data.resolvedAt).format('DD MMM YYYY, HH:mm') : '-'}
            </Col>
          </Row>
          <Row style={rowStyle}>
            Description
          </Row>
          <Row style={rowStyle}>
            {data.description}
          </Row>
        </Col>
      ),
      width: 450
    })
  }

  const onSubmit = (description) => {
    const header = {
      description,
      transNo: paymentData.pos.transNo,
      transactionId: paymentData.id
    }

    let detail = ledgerEntry

    let debit = detail.reduce((prev, record) => {
      return prev + (record.debit || 0)
    }, 0)

    let credit = detail.reduce((prev, record) => {
      return prev + (record.credit || 0)
    }, 0)

    if (debit !== credit) {
      message.error('Debit and Credit have to balanced')
      return
    }

    let payload = {
      header,
      detail,
      paymentConflict: data,
      paymentData,
      paymentImportData
    }

    dispatch({
      type: 'autorecon/resolve',
      payload: {
        ...payload,
        location
      }
    })
  }

  let formEntryProps = {
    currentLedgerEntry,
    listAccountCode: listAccountCodeLov,
    visible: modalVisible,
    closeModal () {
      dispatch({
        type: 'autorecon/updateState',
        payload: {
          modalVisible: false
        }
      })
    },
    onSubmit ({ data, resetFields }) {
      let tempLedgerEntry = ledgerEntry
      if (data && data.no) {
        tempLedgerEntry = tempLedgerEntry.map((record) => {
          if (record.no === data.no) {
            return data
          }
          return record
        })
      } else {
        tempLedgerEntry = [...tempLedgerEntry, { ...data, no: ledgerEntry.length + 1 }]
      }
      dispatch({
        type: 'autorecon/updateState',
        payload: {
          ledgerEntry: [...tempLedgerEntry],
          modalVisible: false,
          currentLedgerEntry: {}
        }
      })
      resetFields()
    },
    onDelete (no) {
      dispatch({
        type: 'autorecon/updateState',
        payload: {
          ledgerEntry: ledgerEntry.filter(filtered => filtered.no !== no)
            .map((record, index) => ({ ...record, no: index + 1 })),
          currentLedgerEntry: {},
          modalVisible: false
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'autorecon/updateState',
        payload: {
          modalVisible: false,
          currentLedgerEntry: {}
        }
      })
    }
  }

  const handleModal = () => {
    dispatch({
      type: 'autorecon/updateState',
      payload: {
        modalVisible: true
      }
    })
  }

  let listEntryProps = {
    dataSource: ledgerEntry,
    listAccountCode: listAccountCodeLov,
    loading,
    handleEditList (record) {
      dispatch({
        type: 'autorecon/updateState',
        payload: {
          currentLedgerEntry: record,
          modalVisible: true
        }
      })
    }
  }

  const handleResolveModal = () => {
    dispatch({
      type: 'autorecon/updateState',
      payload: {
        resolveModalVisible: !resolveModalVisible
      }
    })
  }

  let formProps = {
    resolveModalVisible,
    loading,
    handleResolveModal,
    onSubmit
  }

  return (
    <div className="content-inner">
      <Form {...formProps} />
      <FormEntry {...formEntryProps} />
      <Row>
        <Button
          type="primary"
          icon="rollback"
          onClick={() => {
            dispatch({
              type: 'autorecon/updateState',
              payload: {
                detail: {}
              }
            })
            dispatch(routerRedux.goBack())
          }}
        >
          Back
        </Button>
      </Row>
      <Row type="flex" justify="end" align="middle">
        <Col {...parentColumnProps}>
          <Row style={{ marginBottom: '10px' }} justify="end" type="flex">
            <Button type="primary" disabled={(data && data.resolved) || resolveModalVisible} onClick={handleResolveModal} loading={loading.effects['autorecon/resolve'] || loading.effects['autorecon/queryDetail']}>
              {data && data.resolved ? 'Resolved' : 'Resolve Conflict'}
            </Button>
            <Button shape="circle" icon="info" style={{ marginLeft: '10px' }} type="ghost" onClick={() => showModalInfo()} loading={loading.effects['autorecon/resolve'] || loading.effects['autorecon/queryDetail']} />
          </Row>
          <Row style={{ marginBottom: '10px' }} align="middle" type="flex">
            <Col {...paymentColumnProps} style={{ padding: '10px' }}>
              <ListPayment {...listPaymentProps} />
            </Col>
            <Col span={2}>
              <Icon type="swap" style={{ fontSize: '24px', textAlign: 'center', width: '100%' }} />
            </Col>
            <Col {...paymentColumnProps} style={{ padding: '10px' }}>
              <ListPaymentImport {...listPaymentImportProps} />
            </Col>
          </Row>
        </Col>
      </Row>
      {data && !data.resolved && (
        <div>
          <Row style={{ marginBottom: '10px' }}>
            <Button type="primary" disabled={data && data.resolved} onClick={() => handleModal()} loading={loading.effects['autorecon/resolve'] || loading.effects['autorecon/queryDetail']}>New Entry</Button>
          </Row>
          <Row style={{ marginBottom: '10px' }}>
            <ListEntry {...listEntryProps} />
          </Row>
        </div>
      )}
      <Row style={{ padding: '10px' }}>
        <ListLedger {...listLedgerProps} />
      </Row>
    </div>
  )
}

export default connect(({
  autorecon,
  loading,
  accountRule
}) => ({ autorecon, loading, accountRule }))(Detail)

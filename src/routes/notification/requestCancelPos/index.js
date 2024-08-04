import React from 'react'
// import io from 'socket.io-client'
import { Button, Card, Col, Row, Modal } from 'antd'
import { connect } from 'dva'
import { CANCEL_INPUT, CANCEL_INVOICE } from 'utils/variable'
// import { APISOCKET } from 'utils/config.company'
import ModalDetail from './ModalDetail'

const columnProps = {
  xs: 24,
  sm: 24,
  md: 8,
  lg: 6,
  xl: 6
}

// const options = {
//   upgrade: true,
//   transports: ['websocket'],
//   pingTimeout: 100,
//   pingInterval: 100
// }

// const socket = io(APISOCKET, options)

class RequestCancelPos extends React.Component {
  state = {
    visibleModalDetail: false,
    currentItem: {}
  }

  // componentDidMount () {
  //   socket.on('requestCancelPos', e => this.handleData(e))
  // }

  // componentWillUnmount () {
  //   socket.off('requestCancelPos')
  // }

  // handleData () {
  //   const { dispatch } = this.props
  //   dispatch({
  //     type: 'requestCancelPos/queryPending'
  //   })
  // }

  render () {
    const {
      loading,
      dispatch,

      requestCancelPos
    } = this.props

    const {
      listPending,

      currentItem,
      visibleModalDetail
    } = requestCancelPos

    const handleModalDetailVisible = (item = {}) => {
      dispatch({
        type: 'requestCancelPos/updateState',
        payload: {
          visibleModalDetail: !visibleModalDetail,
          currentItem: item
        }
      })
    }

    const handleApprove = (data) => {
      Modal.confirm({
        title: 'Approve Request',
        content: 'Are you sure to approve this request?',
        onOk: () => {
          dispatch({
            type: 'requestCancelPos/approve',
            payload: {
              id: data.id,
              fingerprintId: data.fingerprintId
            }
          })
        }
      })
    }

    const modalDetailProps = {
      loading,
      currentItem,
      visible: visibleModalDetail,
      onCancel: handleModalDetailVisible,
      onApprove: handleApprove
    }

    return (
      <div className="content-inner">
        {visibleModalDetail && <ModalDetail {...modalDetailProps} />}
        <Row>
          <h2 style={{ fontWeight: 'bold' }}>
            Approval
          </h2>
        </Row>
        <Row gutter={2}>
          {listPending && Array.isArray(listPending) && listPending.length > 0
            ? listPending.map((record) => {
              return (
                <Col {...columnProps} style={{ padding: '10px' }}>
                  <Card
                    title={(
                      <Row>
                        {record.transType === CANCEL_INPUT ? 'Cancel Input' : record.transType === CANCEL_INVOICE ? 'Cancel Invoice' : 'Undefined!'}
                      </Row>
                    )}
                    extra={<Button shape="circle" type="primary" icon="check" onClick={() => handleApprove(record)} loading={loading.effects['requestCancelPos/approve']} />}
                    bordered
                    loading={loading.effects['requestCancelPos/queryPending']}
                  >
                    <Row type="flex" style={{ marginBottom: '10px' }}>
                      <div style={{ flex: 1, fontWeight: 'bold' }}>
                        Trans No
                      </div>
                      <div>
                        {record.transNo}
                      </div>
                    </Row>
                    <Row type="flex" style={{ marginBottom: '10px' }}>
                      <div style={{ flex: 1, fontWeight: 'bold' }}>
                        Memo
                      </div>
                      <div>
                        {record.memo}
                      </div>
                    </Row>
                    <Row type="flex">
                      <Button
                        type="primary"
                        icon="bars"
                        size="large"
                        onClick={() => handleModalDetailVisible(record)}
                        style={{ flex: 1 }}
                        loading={loading.effects['requestCancelPos/approve']}
                      >
                        See Detail
                      </Button>
                    </Row>
                  </Card>
                </Col>
              )
            })
            : (
              <h3 style={{ marginTop: '10px' }}>
                {'everything\'s done, have a nice day'}
              </h3>
            )}
        </Row>
      </div>
    )
  }
}

export default connect(({
  loading,
  requestCancelPos
}) => ({
  loading,
  requestCancelPos
}))(RequestCancelPos)

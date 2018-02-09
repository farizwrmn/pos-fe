import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Modal } from 'antd'
import { ModalListHistory } from '../components'

const History = ({ history, loading, dispatch }) => {
  const { listTrans, modalVisible, policeNoId, memberCode } = history

  // const removeDuplicates = (array, prop) => {
  //   return array.filter((obj, pos, arr) => {
  //     return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos
  //   })
  // }

  // let platNumbers = removeDuplicates(list, 'policeNo')

  const onClickButton = () => {
    dispatch({
      type: 'history/query',
      payload: {
        memberCode,
        policeNoId
      }
    })

    dispatch({
      type: 'history/updateState',
      payload: {
        modalVisible: true
      }
    })
  }

  let totalPrice = listTrans.reduce((cnt, o) => cnt + parseFloat(o.nettoTotal), 0)

  const modalProps = {
    visible: modalVisible,
    maskClosable: false,
    footer: ['Total: ', totalPrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 0, maximumFractionDigits: 2 })],
    wrapClassName: 'vertical-center-modal',
    onCancel () {
      dispatch({
        type: 'history/updateState',
        payload: {
          modalVisible: false
        }
      })
    }
  }

  const columns = [
    {
      title: 'Member Code',
      dataIndex: 'memberCode',
      key: 'memberCode',
      width: 45
    }, {
      title: 'Member Name',
      dataIndex: 'memberName',
      key: 'memberName',
      width: 100
    }, {
      title: 'Police No',
      dataIndex: 'policeNo',
      key: 'policeNo',
      width: 50
    }, {
      title: 'Total',
      dataIndex: 'nettoTotal',
      key: 'nettoTotal',
      width: 40,
      render: (text) => {
        return text.toLocaleString(['ban', 'id'], { minimumFractionDigits: 0, maximumFractionDigits: 2 })
      }
    }
  ]

  const modalListHistory = {
    columns,
    dataSource: listTrans,
    loading: loading.effects['history/query'],
    changeDate (fromDate, toDate) {
      dispatch({
        type: 'history/queryTrans',
        payload: {
          memberCode,
          from: fromDate,
          to: toDate,
          policeNoId
        }
      })
    }
  }
  return (
    <div className="content-inner">
      <Button onClick={() => onClickButton()}>Show history</Button>
      {modalVisible && <Modal {...modalProps} ><ModalListHistory {...modalListHistory} /></Modal>}
    </div>
  )
}

History.propTypes = {
  history: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ history, loading, app }) => ({ history, loading, app }))(History)

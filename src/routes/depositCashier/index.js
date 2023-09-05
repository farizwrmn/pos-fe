import React from 'react'
import { connect } from 'dva'
import { Button, Row } from 'antd'
import List from './List'
import ModalAdd from './ModalAdd'

class DepositCashier extends React.Component {
  render () {
    const {
      loading,
      dispatch,
      depositCashier
    } = this.props

    const {
      visibleAddDepositModal,

      list
    } = depositCashier

    const listProps = {
      dataSource: list
    }

    const handleAddDepositModal = () => {
      dispatch({
        type: 'depositCashier/updateState',
        payload: {
          visibleAddDepositModal: !visibleAddDepositModal
        }
      })
    }

    const modalAddProps = {
      loading,
      visible: visibleAddDepositModal,
      onCancel: handleAddDepositModal,
      onSubmit: (data) => {
        const { transDate } = data
        if (transDate) {
          dispatch({
            type: 'depositCashier/add',
            payload: {
              transDate
            }
          })
        }
      }
    }

    return (
      <div className="content-inner">
        {visibleAddDepositModal && <ModalAdd {...modalAddProps} />}
        <Row justify="end" type="flex" style={{ marginBottom: '10px' }}>
          <Button type="primary" icon="plus" onClick={handleAddDepositModal}>Add Deposit</Button>
        </Row>
        <Row>
          <List {...listProps} />
        </Row>
      </div>
    )
  }
}

export default connect(({
  loading,
  depositCashier
}) => ({
  loading,
  depositCashier
}))(DepositCashier)

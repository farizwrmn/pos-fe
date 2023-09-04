import React from 'react'
import moment from 'moment'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Row } from 'antd'
import List from './List'
import ModalAdd from './ModalAdd'

class DepositCashier extends React.Component {
  render () {
    const {
      dispatch,
      setoranCashier
    } = this.props

    const {
      visibleAddDepositModal,

      list
    } = setoranCashier

    const listProps = {
      dataSource: list
    }

    const handleSetoranNewModal = () => {
      dispatch({
        type: 'depositCashier/updateState',
        payload: {
          visibleAddDepositModal: !visibleAddDepositModal
        }
      })
    }

    const modalAddProps = {
      visible: visibleAddDepositModal,
      onCancel: handleSetoranNewModal,
      onSubmit: (data) => {
        const { transDate } = data
        if (transDate && transDate.length > 0) {
          dispatch(routerRedux.push({
            pathname: '/setoran/cashier/new',
            query: {
              from: moment(transDate[0]).format('YYYY-MM-DD'),
              to: moment(transDate[1]).format('YYYY-MM-DD')
            }
          }))
        }
      }
    }

    return (
      <div className="content-inner">
        {visibleAddDepositModal && <ModalAdd {...modalAddProps} />}
        <Row justify="end" type="flex" style={{ marginBottom: '10px' }}>
          <Button type="primary" icon="plus" onClick={handleSetoranNewModal}>Add Deposit</Button>
        </Row>
        <Row>
          <List {...listProps} />
        </Row>
      </div>
    )
  }
}

export default connect(({
  setoranCashier
}) => ({
  setoranCashier
}))(DepositCashier)

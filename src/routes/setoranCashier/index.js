import React from 'react'
import moment from 'moment'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Row } from 'antd'
import List from './List'
import ModalAdd from './ModalAdd'

class SetoranCashier extends React.Component {
  render () {
    const {
      dispatch,
      setoranCashier
    } = this.props

    const {
      visibleAddSetoranModal,

      list
    } = setoranCashier

    const listProps = {
      dataSource: list
    }

    const handleSetoranNewModal = () => {
      dispatch({
        type: 'setoranCashier/updateState',
        payload: {
          visibleAddSetoranModal: !visibleAddSetoranModal
        }
      })
    }

    const modalAddProps = {
      visible: visibleAddSetoranModal,
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
        {visibleAddSetoranModal && <ModalAdd {...modalAddProps} />}
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
}))(SetoranCashier)

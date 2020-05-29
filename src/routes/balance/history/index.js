import React from 'react'
import PropTypes from 'prop-types'
import { Checkbox } from 'antd'
import { connect } from 'dva'
import { lstorage } from 'utils'
import moment from 'moment'
import List from './List'
import ModalDetail from './ModalDetail'

class Container extends React.Component {
  state = {
    allStore: false
  }

  onChange = () => {
    const { dispatch, balance } = this.props
    const { allStore } = this.state
    const { currentDate } = balance
    const month = moment(currentDate).format('MM')
    const year = moment(currentDate).format('YYYY')
    this.setState({
      allStore: !allStore
    })
    dispatch({
      type: 'balance/query',
      payload: {
        relationship: 1,
        history: 1,
        month,
        year,
        storeId: !allStore ? undefined : lstorage.getCurrentUserStore()
      }
    })
  }

  render () {
    const {
      app,
      dispatch,
      balance,
      balanceDetail,
      paymentOpts
    } = this.props
    const { allStore } = this.state
    const { listBalance, modalDetailVisible } = balance
    const { currentItem, listBalanceDetail } = balanceDetail
    const { listOpts } = paymentOpts
    const { user } = app
    const listProps = {
      allStore,
      dispatch,
      listBalance
    }

    const modalDetailProps = {
      dataSource: listBalanceDetail,
      listOpts,
      item: currentItem,
      visible: modalDetailVisible,
      onOk () {
        dispatch({
          type: 'balance/updateState',
          payload: {
            modalDetailVisible: false,
            currentItem: {}
          }
        })
      },
      onCancel () {
        dispatch({
          type: 'balance/updateState',
          payload: {
            modalDetailVisible: false,
            currentItem: {}
          }
        })
      }
    }

    return (
      <div className="content-inner">
        {user
          && user.permissions
          && (
            user.permissions.role === 'OWN'
            || user.permissions.role === 'SPR'
            || user.permissions.role === 'ADM'
          )
          && <Checkbox onChange={() => this.onChange()} checked={allStore}>All Store</Checkbox>}
        <List {...listProps} />
        {modalDetailVisible && <ModalDetail {...modalDetailProps} />}
      </div>
    )
  }
}

Container.propTypes = {
  balance: PropTypes.object,
  // loading: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(
  ({
    balance,
    balanceDetail,
    paymentOpts,
    loading,
    app
  }) =>
    ({
      balance,
      balanceDetail,
      paymentOpts,
      loading,
      app
    })
)(Container)

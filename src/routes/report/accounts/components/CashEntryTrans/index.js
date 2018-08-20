/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import moment from 'moment'
import { ModalFilter } from 'components'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, loading, cashEntryReport, app }) => {
  const { listTrans, from, to, modalFilterCashEntryByTrans } = cashEntryReport
  const { user, storeInfo } = app

  const showFilter = () => {
    dispatch({
      type: 'cashEntryReport/updateState',
      payload: {
        modalFilterCashEntryByTrans: !modalFilterCashEntryByTrans
      }
    })
  }

  const browseProps = {
    dataSource: listTrans,
    loading: loading.effects['cashEntryReport/queryTrans']
  }

  const filterProps = {
    listTrans,
    user,
    storeInfo,
    from,
    to,
    showFilter,
    onListReset () {
      dispatch({
        type: 'cashEntryReport/setListNull'
      })
      dispatch({
        type: 'cashier/resetFilter'
      })
    }
  }

  const modalProps = {
    visible: modalFilterCashEntryByTrans,
    date: [moment(from, 'YYYY-MM-DD'), moment(to, 'YYYY-MM-DD')],
    title: 'Filter',
    onCancel () {
      showFilter()
    },
    onSubmitFilter (data) {
      const { date, ...other } = data
      dispatch({
        type: 'cashEntryReport/queryTrans',
        payload: {
          from: moment(date[0]).format('YYYY-MM-DD'),
          to: moment(date[1]).format('YYYY-MM-DD'),
          field: 'id,transNo,transDate,reference,amountIn,amountOut',
          order: 'transDate,transNo,id',
          ...other
        }
      })
      dispatch({
        type: 'cashEntryReport/setDate',
        payload: {
          from: moment(date[0]).format('YYYY-MM-DD'),
          to: moment(date[1]).format('YYYY-MM-DD')
        }
      })
      showFilter()
    }
  }

  return (
    <div className="content-inner">
      {modalFilterCashEntryByTrans && <ModalFilter {...modalProps} />}
      <Filter {...filterProps} />
      <Browse {...browseProps} />
    </div>
  )
}

Report.propTyps = {
  dispatch: PropTypes.func.isRequired,
  app: PropTypes.object,
  cashEntryReport: PropTypes.object
}

export default connect(({ cashEntryReport, loading, app }) => ({ cashEntryReport, loading, app }))(Report)

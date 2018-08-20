/**
 * Created by Veirry on 19/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import moment from 'moment'
import { ModalFilter } from 'components'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, loading, posReport, app }) => {
  const { listTrans, fromDate, toDate, modalFilterPOSByCancel } = posReport
  const { user, storeInfo } = app

  const showFilter = () => {
    dispatch({
      type: 'posReport/updateState',
      payload: {
        modalFilterPOSByCancel: !modalFilterPOSByCancel
      }
    })
  }

  const browseProps = {
    dataSource: listTrans,
    loading: loading.effects['posReport/queryTransCancel']
  }

  const filterProps = {
    listTrans,
    user,
    storeInfo,
    fromDate,
    toDate,
    showFilter,
    onListReset () {
      dispatch({
        type: 'posReport/setListNull'
      })
      dispatch({
        type: 'cashier/resetFilter'
      })
    }
  }

  const modalProps = {
    visible: modalFilterPOSByCancel,
    date: [moment(fromDate, 'YYYY-MM-DD'), moment(toDate, 'YYYY-MM-DD')],
    title: 'Filter',
    onCancel () {
      showFilter()
    },
    onSubmitFilter (data) {
      const { date, ...other } = data
      dispatch({
        type: 'posReport/queryTransCancel',
        payload: {
          from: moment(date[0]).format('YYYY-MM-DD'),
          to: moment(date[1]).format('YYYY-MM-DD'),
          ...other
        }
      })
      dispatch({
        type: 'posReport/setDate',
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
      {modalFilterPOSByCancel && <ModalFilter {...modalProps} />}
      <Filter {...filterProps} />
      <Browse {...browseProps} />
    </div>
  )
}

Report.propTyps = {
  dispatch: PropTypes.func.isRequired,
  app: PropTypes.object,
  posReport: PropTypes.object,
  location: PropTypes.object,
  loading: PropTypes.object
}

export default connect(({ loading, posReport, app }) => ({ loading, posReport, app }))(Report)

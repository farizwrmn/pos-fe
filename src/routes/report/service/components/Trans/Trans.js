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

const Report = ({ dispatch, loading, serviceReport, app }) => {
  const { list, fromDate, toDate, modalFilterServiceByTrans } = serviceReport
  const { user, storeInfo } = app

  const showFilter = () => {
    dispatch({
      type: 'serviceReport/updateState',
      payload: {
        modalFilterServiceByTrans: !modalFilterServiceByTrans
      }
    })
  }

  const browseProps = {
    dataSource: list,
    loading: loading.effects['posReport/queryTransCancel']
  }

  const filterProps = {
    list,
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
    visible: modalFilterServiceByTrans,
    date: [moment(fromDate, 'YYYY-MM-DD'), moment(toDate, 'YYYY-MM-DD')],
    title: 'Filter',
    onCancel () {
      showFilter()
    },
    onSubmitFilter (data) {
      const { date, ...other } = data
      dispatch({
        type: 'serviceReport/query',
        payload: {
          from: moment(date[0]).format('YYYY-MM-DD'),
          to: moment(date[1]).format('YYYY-MM-DD'),
          ...other
        }
      })
      dispatch({
        type: 'serviceReport/setDate',
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
      {modalFilterServiceByTrans && <ModalFilter {...modalProps} />}
      <Filter {...filterProps} />
      <Browse {...browseProps} />
    </div>
  )
}

Report.propTyps = {
  dispatch: PropTypes.func,
  app: PropTypes.app,
  serviceReport: PropTypes.object
}

export default connect(({ serviceReport, loading, app }) => ({ serviceReport, loading, app }))(Report)

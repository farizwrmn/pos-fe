import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import moment from 'moment'
import { ModalFilter } from 'components'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, loading, posReport, app }) => {
  const { listPOS, listPOSDetail, fromDate, toDate, modalFilterPOSByDetail } = posReport
  const { user, storeInfo } = app
  const browseProps = {
    dataSource: listPOSDetail,
    loading: loading.effects['posReport/queryPOSDetail']
  }

  const showFilter = () => {
    dispatch({
      type: 'posReport/updateState',
      payload: {
        modalFilterPOSByDetail: !modalFilterPOSByDetail
      }
    })
  }

  const listData = _.map(listPOS, (item) => {
    return Object.assign(item, {
      items: _.filter(listPOSDetail, { transNo: item.transNo })
    })
  })

  const filterProps = {
    listData,
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
    visible: modalFilterPOSByDetail,
    date: [moment(fromDate, 'YYYY-MM-DD'), moment(toDate, 'YYYY-MM-DD')],
    title: 'Filter',
    onCancel () {
      showFilter()
    },
    onSubmitFilter (data) {
      const { date, ...other } = data
      dispatch({
        type: 'posReport/queryPOSDetail',
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
      {modalFilterPOSByDetail && <ModalFilter {...modalProps} />}
      <Filter {...filterProps} />
      <Browse {...browseProps} />
    </div>
  )
}

Report.propTyps = {
  dispatch: PropTypes.func.isRequired,
  app: PropTypes.object,
  posReport: PropTypes.object,
  loading: PropTypes.object
}

export default connect(({ loading, posReport, app }) => ({ loading, posReport, app }))(Report)

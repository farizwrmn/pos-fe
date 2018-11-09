/**
 * Created by Veirry on 19/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import moment from 'moment'
import { Select } from 'antd'
import { ModalFilter } from 'components'
import Browse from './Browse'
import Filter from './Filter'

const Option = Select.Option

const Report = ({ dispatch, loading, posReport, app }) => {
  const { listTrans, listStore, fromDate, toDate, modalFilterPOSByUnit } = posReport
  const { user, storeInfo } = app

  const showFilter = () => {
    dispatch({
      type: 'posReport/updateState',
      payload: {
        modalFilterPOSByUnit: !modalFilterPOSByUnit
      }
    })
  }

  const browseProps = {
    dataSource: listTrans,
    loading: loading.effects['posReport/queryTransAllGroup']
  }

  const filterProps = {
    listTrans,
    user,
    storeInfo,
    dispatch,
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

  const listOptionStore = listStore.map(x => (<Option value={x.value}>{x.label}</Option>))

  const modalProps = {
    visible: modalFilterPOSByUnit,
    date: [moment(fromDate, 'YYYY-MM-DD'), moment(toDate, 'YYYY-MM-DD')],
    title: 'Filter',
    addOn: [
      {
        label: 'Store ID',
        decorator: 'storeId',
        component: (
          <Select mode="multiple" allowClear>
            {listOptionStore}
          </Select>
        )
      }
    ],
    onCancel () {
      showFilter()
    },
    onSubmitFilter (data) {
      const { date, ...other } = data
      dispatch({
        type: 'posReport/queryTransAllGroup',
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
      {modalFilterPOSByUnit &&
        <ModalFilter {...modalProps} />}
      <Filter {...filterProps} />
      <Browse {...browseProps} />
    </div>
  )
}

Report.propTypes = {
  dispatch: PropTypes.func.isRequired,
  app: PropTypes.object,
  posReport: PropTypes.object,
  location: PropTypes.object,
  loading: PropTypes.object,
  listStoreId: PropTypes.array
}

Report.defaultProps = {
  listStoreId: []
}

export default connect(({ loading, posReport, app }) => ({ loading, posReport, app }))(Report)

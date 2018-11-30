/**
 * Created by Veirry on 19/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import { connect } from 'dva'
import { ModalFilter } from 'components'
import moment from 'moment'
import Browse from './Browse'
import Filter from './Filter'

const Option = Select.Option

const Report = ({ dispatch, loading, posReport, app }) => {
  const { listTrans, fromDate, toDate, modalFilterPOSByProductAndService } = posReport
  const { user, storeInfo } = app

  const showFilter = () => {
    dispatch({
      type: 'posReport/updateState',
      payload: {
        modalFilterPOSByProductAndService: !modalFilterPOSByProductAndService
      }
    })
  }

  const browseProps = {
    dataSource: listTrans,
    loading: loading.effects['posReport/queryTransAll']
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

  const modalProps = {
    visible: modalFilterPOSByProductAndService,
    date: [moment(fromDate, 'YYYY-MM-DD'), moment(toDate, 'YYYY-MM-DD')],
    title: 'Filter',
    addOn: [
      {
        label: 'Value',
        decorator: 'value',
        component: (
          <Select
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            mode="multiple"
            allowClear
          >
            <Option key="1" value="1">Good</Option>
            <Option key="2" value="2">Normal</Option>
            <Option key="3" value="3">Bad</Option>
            <Option key="4" value="4">Not-checked</Option>
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
        type: 'posReport/queryWoCheck',
        payload: {
          transDate: [
            moment(date[0]).format('YYYY-MM-DD'),
            moment(date[1]).format('YYYY-MM-DD')
          ],
          ...other
        }
      })
      showFilter()
    }
  }

  return (
    <div className="content-inner">
      {modalFilterPOSByProductAndService && <ModalFilter {...modalProps} />}
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

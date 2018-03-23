import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Filter from './Filter'
import List from './List'

const ServiceHistory = ({ serviceReport, service, employee, dispatch, app, loading }) => {
  const { listMechanic, listService, fromDate, toDate } = serviceReport
  const { user, storeInfo } = app
  const { list, listServiceType } = service
  const { list: listEmployee } = employee
  const groupServiceCode = (listData, key) => {
    return listData.map(data => data[key]).filter((e, index, array) => index === array.indexOf(e))
  }

  const getServiceCode = listService.length > 0 ? groupServiceCode(listService, 'serviceCode') : []
  let services = []
  if (list.length > 0) {
    list.map(data => data).filter((x) => {
      getServiceCode.map((code) => {
        x.serviceCode === code ? services.push(x) : []
        return code
      })
      return x
    })
  }

  const printProps = {
    listMechanic,
    user,
    storeInfo,
    fromDate,
    toDate
  }

  const filterProps = {
    ...printProps,
    listServiceType,
    listEmployee,
    listServices: services,
    onSearchClick (from, to, serviceType, technicianId) {
      dispatch({
        type: 'serviceReport/queryService',
        payload: {
          from,
          to,
          serviceType,
          technicianId
        }
      })
      dispatch({
        type: 'serviceReport/queryMechanic',
        payload: {
          from,
          to,
          serviceType,
          technicianId
        }
      })
    },
    onSearchClickWithService (from, to, serviceType, technicianId, serviceCode) {
      dispatch({
        type: 'serviceReport/queryMechanic',
        payload: {
          from,
          to,
          serviceType,
          technicianId,
          serviceCode
        }
      })
    },
    onResetClick () {
      dispatch({
        type: 'serviceReport/updateState',
        payload: {
          listMechanic: [],
          listService: [],
          fromDate: '',
          toDate: ''
        }
      })
    }
  }

  const listProps = {
    dataSource: listMechanic,
    loading: loading.effects['serviceReport/queryMechanic'],
    style: { marginTop: 15 }
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <List {...listProps} />
    </div>
  )
}

ServiceHistory.propTypes = {
  serviceReport: PropTypes.object,
  service: PropTypes.object,
  employee: PropTypes.object,
  loading: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.object
}

export default connect(({ serviceReport, service, employee, app, loading }) => ({ serviceReport, service, employee, app, loading }))(ServiceHistory)


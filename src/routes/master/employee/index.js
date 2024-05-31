import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Tabs, Dropdown, Icon, Menu, Button } from 'antd'
import Form from './Form'
import List from './List'
import Filter from './Filter'
import PrintPDF from './PrintPDF'
import PrintXLS from './PrintXLS'

const TabPane = Tabs.TabPane

const Employee = ({ contractType, division, employee, store, jobposition, misc, city, loading, dispatch, location, app }) => {
  const { list, display, isChecked, sequence, modalType, currentItem, activeKey, show } = employee
  const { list: listDvision } = division
  const { list: listContractType } = contractType
  const { listStoreLov } = store
  const { listLovJobPosition } = jobposition
  const { listLov, code } = misc
  const listIdType = listLov && listLov[code] ? listLov[code] : []
  const { listCity } = city
  const { user, storeInfo } = app
  const filterProps = {
    display,
    isChecked,
    show,
    filter: {
      ...location.query
    },
    onFilterChange (value) {
      dispatch({
        type: 'employee/query',
        payload: {
          ...value
        }
      })
    },
    switchIsChecked () {
      dispatch({
        type: 'employee/switchIsChecked',
        payload: `${isChecked ? 'none' : 'block'}`
      })
    },
    onResetClick () {
      dispatch({
        type: 'employee/resetEmployeeList'
      })
      dispatch({
        type: 'employee/updateState',
        payload: {
          pagination: { total: 0 },
          filterText: ''
        }
      })
    }
  }

  const listProps = {
    dataSource: list.filter(filtered => filtered.employeeId !== 'ownerPOS'
      && filtered.employeeId !== '000001'),
    user,
    storeInfo,
    loading: loading.effects['employee/query'],
    location,
    editItem (item) {
      dispatch({
        type: 'employee/updateState',
        payload: {
          modalType: 'edit',
          activeKey: '0',
          currentItem: item,
          sequence: item.employeeId,
          disable: 'disabled'
        }
      })
      dispatch({
        type: 'jobposition/lov'
      })
      dispatch({
        type: 'city/query'
      })
      const { pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          activeKey: 0
        }
      }))
    },
    deleteItem (id) {
      dispatch({
        type: 'employee/delete',
        payload: id
      })
    }
  }

  const formProps = {
    listLovJobPosition,
    listContractType,
    listDvision,
    listCity,
    listStoreLov,
    item: currentItem,
    sequence,
    disabled: true,
    modalType,
    loading: loading.effects['employee/querySequenceEmployee'],
    button: `${modalType === 'add' ? 'Simpan' : 'Update'}`,
    listIdType,
    showIdType () {
      dispatch({
        type: 'misc/lov',
        payload: {
          code: 'IDTYPE'
        }
      })
    },
    registerFingerprint (payload) {
      dispatch({
        type: 'employee/registerFingerprint',
        payload
      })
    },
    onSubmit (id, data) {
      dispatch({
        type: `employee/${modalType}`,
        payload: {
          id,
          data
        }
      })
      dispatch({ type: 'employee/querySequenceEmployee' })
    },
    onCancel () {
      const { pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          activeKey: '1'
        }
      }))
      dispatch({
        type: 'employee/updateState',
        payload: {
          currentItem: {}
        }
      })
    },
    showPosition () {
      dispatch({
        type: 'jobposition/lov'
      })
    }
  }

  const changeTab = (key) => {
    dispatch({
      type: 'employee/updateState',
      payload: {
        activeKey: key,
        modalType: 'add',
        disable: '',
        currentItem: {}
      }
    })
    const { query, pathname } = location
    dispatch(routerRedux.push({
      pathname,
      query: {
        ...query,
        activeKey: key
      }
    }))
    dispatch({
      type: 'employee/querySequence',
      payload: {
        seqCode: 'EMP',
        type: 1 // storeId
      }
    })
    dispatch({
      type: 'employee/resetEmployeeList'
    })
  }

  const clickBrowse = () => {
    dispatch({
      type: 'employee/updateState',
      payload: {
        activeKey: '1'
      }
    })
    dispatch({
      type: 'employee/resetEmployeeList'
    })
  }

  const onShowHideSearch = () => {
    dispatch({
      type: 'employee/updateState',
      payload: {
        show: !show
      }
    })
  }

  const printProps = {
    dataSource: list,
    user,
    storeInfo
  }

  const menu = (
    <Menu>
      <Menu.Item key="1"><PrintPDF {...printProps} /></Menu.Item>
      <Menu.Item key="2"><PrintXLS {...printProps} /></Menu.Item>
    </Menu>
  )

  const moreButtonTab = activeKey === '0' ? <Button onClick={() => clickBrowse()}>Browse</Button> : (<div> <Button onClick={() => onShowHideSearch()}>{`${show ? 'Hide' : 'Show'} Search`}</Button> <Dropdown overlay={menu}>
    <Button style={{ marginLeft: 8 }}>
      <Icon type="printer" /> Print
    </Button>
  </Dropdown> </div>)

  return (
    <div className="content-inner">
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} tabBarExtraContent={moreButtonTab} type="card">
        <TabPane tab="Form" key="0" >
          {activeKey === '0' && <Form {...formProps} />}
        </TabPane>
        <TabPane tab="Browse" key="1">
          <Filter {...filterProps} />
          <List {...listProps} />
        </TabPane>
      </Tabs>
    </div>
  )
}

Employee.propTypes = {
  employee: PropTypes.object,
  misc: PropTypes.object.isRequired,
  contractType: PropTypes.object,
  division: PropTypes.object,
  jobposition: PropTypes.object,
  city: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ contractType, division, employee, store, misc, jobposition, city, loading, app }) => ({ contractType, division, employee, store, misc, jobposition, city, loading, app }))(Employee)

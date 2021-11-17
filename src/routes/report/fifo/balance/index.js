/**
 * Created by Veirry on 09/09/2017.
*/
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Tabs } from 'antd'
import Browse from './Browse'
import Filter from './Filter'

const TabPane = Tabs.TabPane

const Report = ({ dispatch, fifoReport, productcategory, productbrand, app, loading }) => {
  const { period, year, activeKey, listProduct } = fifoReport
  const { listCategory } = productcategory
  const { listBrand } = productbrand
  let { listRekap, tmpListRekap } = fifoReport

  const { user, storeInfo } = app
  const browseProps = {
    activeKey,
    dataSource: activeKey === '1' ? listRekap.filter(filtered => filtered.count > 0) : listRekap,
    loading: loading.effects['fifoReport/queryCard']
  }

  const filterProps = {
    activeKey,
    // productCode,
    // productName,
    listProduct,
    listRekap: activeKey === '1' ? listRekap.filter(filtered => filtered.count > 0) : listRekap,
    user,
    listCategory,
    listBrand,
    dispatch,
    storeInfo,
    period,
    year,
    onUpdateDataSource (value) {
      const reg = new RegExp(value, 'gi')
      let newData = tmpListRekap.map((record) => {
        const match = record.productCode.match(reg) || record.productName.match(reg)
        if (!match) {
          return null
        }
        return {
          ...record
        }
      }).filter(record => !!record)
      if (value !== '') {
        dispatch({
          type: 'fifoReport/updateState',
          payload: {
            listRekap: newData
          }
        })
      }
      if (value === '') {
        dispatch({
          type: 'fifoReport/updateState',
          payload: {
            listRekap: tmpListRekap
          }
        })
      }
    },
    onListReset () {
      if (activeKey === '3') {
        dispatch({
          type: 'fifoReport/setNullProduct'
        })
      }
      dispatch({
        type: 'setNull'
      })
    },
    onOk (month, yearPeriod, data) {
      dispatch({
        type: 'fifoReport/queryCard',
        payload: {
          period: month,
          year: yearPeriod,
          productCode: (data.productCode || '').toString(),
          productName: (data.productName || '').toString()
        }
      })
    },
    onChangePeriod (month, yearPeriod) {
      dispatch({
        type: 'setPeriod',
        payload: {
          month,
          yearPeriod
        }
      })
      dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
          period: month,
          year: yearPeriod,
          activeKey
        }
      }))
    },
    onShowCategories () {
      dispatch({ type: 'productcategory/query' })
    },
    onShowBrands () {
      dispatch({ type: 'productbrand/query' })
    }
  }

  const changeTab = (key) => {
    dispatch({
      type: 'fifoReport/updateState',
      payload: {
        activeKey: key
      }
    })
    dispatch({
      type: 'fifoReport/setNull'
    })
    const { query, pathname } = location
    dispatch(routerRedux.push({
      pathname,
      query: {
        ...query,
        activeKey: key
      }
    }))
  }

  return (
    <div className="content-inner">
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} type="card">
        <TabPane tab="Summary" key="0" >
          <Filter {...filterProps} />
          <Browse {...browseProps} />
        </TabPane>
        <TabPane tab="Balance" key="1" >
          <Filter {...filterProps} />
          <Browse {...browseProps} />
        </TabPane>
        <TabPane tab="Inventory Value" key="2" >
          <Filter {...filterProps} />
          <Browse {...browseProps} />
        </TabPane>
        <TabPane tab="Stock Card" key="3" >
          <Filter {...filterProps} />
          <Browse {...browseProps} />
        </TabPane>
      </Tabs>
    </div>
  )
}

Report.propTypes = {
  dispatch: PropTypes.func.isRequired,
  app: PropTypes.object.isRequired,
  fifoReport: PropTypes.object.isRequired,
  productcategory: PropTypes.object.isRequired,
  productbrand: PropTypes.object.isRequired
}

export default connect(({ fifoReport, productcategory, productbrand, app, loading }) => ({ fifoReport, productcategory, productbrand, app, loading }))(Report)

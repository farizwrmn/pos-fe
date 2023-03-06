import React from 'react'
import { connect } from 'dva'
import { Modal, Table, Tabs } from 'antd'
import moment from 'moment'
import { routerRedux } from 'dva/router'
import { numberFormat } from 'utils'
import Preview from './preview'
import Detail from './detail'

const TabPane = Tabs.TabPane
const numberFormatter = numberFormat.numberFormatter

function Dashboard ({ consignmentDashboard, consignmentOutlet, dispatch }) {
  const {
    activeKey,
    consignmentId,

    modalDetail,

    modalRange,
    modalPeriod,
    salesData,
    salesSummary,
    typeText,

    boxList
  } = consignmentDashboard
  const { selectedOutlet } = consignmentOutlet

  const changeTab = (key) => {
    const { query, pathname } = location
    dispatch(routerRedux.push({
      pathname,
      query: {
        ...query,
        activeKey: key
      }
    }))
    dispatch({ type: 'consignmentDashboard/updateState', payload: { activeKey: key } })
  }

  const showModalDetail = (item) => {
    const id = `00000000${item.id}`
    const columns = [
      {
        title: 'ID Permintaan Sewa',
        dataIndex: 'name',
        width: '150px'
      }, {
        title: `BR-${item.formatID}${id.slice(id.length - 8)}`,
        dataIndex: 'value'
      }
    ]
    const formattedData = [
      {
        name: 'Status',
        value: item.status ? String(item.status).toUpperCase() : '-'
      },
      {
        name: 'Outlet',
        value: item.outlet_name || '-'
      },
      {
        name: 'Vendor',
        value: item['vendor.name'] || '-'
      },
      {
        name: 'Tanggal Mulai',
        value: item.start_date ? moment(item.start_date).format('DD MMM YYYY') : '-'
      },
      {
        name: 'Tanggal Berakhir',
        value: item.end_date ? moment(item.end_date).format('DD MMM YYYY') : '-'
      },
      {
        name: 'Boxes',
        value: item.box_code || '-'
      },
      {
        name: 'Harga',
        value: `Rp ${numberFormatter(item.price)}` || '-'
      },
      {
        name: 'Diskon',
        value: `Rp ${numberFormatter(item.discount)}` || '-'
      },
      {
        name: 'Harga Final',
        value: `Rp ${numberFormatter(item.final_price)}` || '-'
      },
      {
        name: 'Dibuat Pada',
        value: moment(item.created_at).format('DD MMM YYYY') || '-'
      },
      {
        name: 'Dipegang Oleh',
        value: item['handled.name'] || '-'
      },
      {
        name: 'Dipegang Pada',
        value: moment(item.approved_at).format('DD MMM YYYY') || '-'
      }
    ]
    // const filteredData = currentItem.filter(filtered => filtered !== currentItem[0])
    Modal.info({
      width: '600px',
      title: 'Rent Information',
      content: (<Table pagination={false} bordered columns={columns} dataSource={formattedData} />),
      onOk () { },
      onCancel () { }
    })
  }

  const previewProps = {
    dispatch,
    salesData,
    boxList,
    typeText,
    modalDetail,
    modalRange,
    modalPeriod,
    consignmentId,
    selectedOutlet,
    changeTab,
    showModalDetail,
    onClickDetail (key) {
      dispatch({
        type: 'consignmentDashboard/updateState',
        payload: {
          activeKey: key
        }
      })
    }
  }

  const detailProps = {
    boxList,
    salesSummary,
    selectedOutlet,
    showModalDetail,
    endRent (item) {
      dispatch({
        type: 'consignmentDashboard/cancelRentRequest',
        payload: {
          id: item.id
        }
      })
    }
  }

  if (!consignmentId) {
    return (
      <div>Consignment not linked to this store, please contact your administrator</div>
    )
  }

  return (
    <div className="content-inner">
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} type="card">
        <TabPane tab={'Preview'} key="0" >
          {activeKey === '0' &&
            <Preview {...previewProps} />
          }
        </TabPane>
        <TabPane tab="Detail" key="1" >
          {activeKey === '1' &&
            <Detail {...detailProps} />
          }
        </TabPane>
      </Tabs>
    </div>
  )
}

export default connect(({
  consignmentDashboard,
  consignmentOutlet,
  dispatch
}) => ({ consignmentDashboard, consignmentOutlet, dispatch }))(Dashboard)

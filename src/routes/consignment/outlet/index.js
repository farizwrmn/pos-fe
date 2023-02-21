import React from 'react'
import { connect } from 'dva'
import { Modal, Table, Tabs } from 'antd'
import { routerRedux } from 'dva/router'
import List from './List'
import Filter from './Filter'
import Form from './Form'

const TabPane = Tabs.TabPane

function Outlet ({ consignmentOutlet, dispatch, loading }) {
  const { list, currentOutlet, activeKey, formType, q, pagination } = consignmentOutlet

  const changeTab = (key) => {
    dispatch({
      type: 'consignmentOutlet/updateState',
      payload: {
        activeKey: key
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
  }

  const listProps = {
    dataSource: list,
    pagination,
    loading: loading.effects['consignmentOutlet/query'],
    showConfirmation (record) {
      const columns = [
        {
          title: 'Keterangan',
          dataIndex: 'description',
          key: 'description',
          width: '200px'
        },
        {
          title: 'Value',
          dataIndex: 'value',
          key: 'value',
          render: text => <div style={{ textAlign: 'center' }}>{text}</div>
        }
      ]
      const informationData = [
        {
          description: 'Food Commission',
          value: record.commission_food
        },
        {
          description: 'Non Food Commission',
          value: record.commission_non_food
        },
        {
          description: 'Payment Charge',
          value: record.include_payment_charge === 1 ? 'yes' : 'no'
        },
        {
          description: 'Bank Name',
          value: record.bank_name
        },
        {
          description: 'Nomor Rekening',
          value: record.account_number
        },
        {
          description: 'Pemilik rekening',
          value: record.account_name
        },
        {
          description: 'No. HP',
          value: record.phone
        },
        {
          description: 'Sewa Box A',
          value: record.default_price_box_a
        },
        {
          description: 'Sewa Box B',
          value: record.default_price_box_b
        },
        {
          description: 'Sewa Box C',
          value: record.default_price_box_c
        },
        {
          description: 'Sewa Box D',
          value: record.default_price_box_d
        },
        {
          description: 'Sewa Box E',
          value: record.default_price_box_e
        },
        {
          description: 'Sewa Box F',
          value: record.default_price_box_f
        },
        {
          description: 'Sewa Box G',
          value: record.default_price_box_g
        },
        {
          description: 'Sewa Box H',
          value: record.default_price_box_h
        },
        {
          description: 'Sewa Box I',
          value: record.default_price_box_i
        },
        {
          description: 'Sewa Box J',
          value: record.default_price_box_j
        },
        {
          description: 'Sewa Box K',
          value: record.default_price_box_k
        },
        {
          description: 'Sewa Box L',
          value: record.default_price_box_l
        },
        {
          description: 'Sewa Box M',
          value: record.default_price_box_m
        },
        {
          description: 'Sewa Box N',
          value: record.default_price_box_n
        }
      ]
      Modal.info({
        title: 'More Information',
        width: '550px',
        content: (
          <Table
            dataSource={informationData}
            bordered
            columns={columns}
            pagination={false}
            simple
            scroll={{ x: 400 }}
            rowKey={record => record.id}
          />
        ),
        onOk () {
        }
      })
    },
    editItem (item) {
      dispatch({
        type: 'consignmentOutlet/updateState',
        payload: {
          currentOutlet: item,
          activeKey: '0',
          formType: 'edit'
        }
      })
    },
    deleteItem (item) {
      dispatch({
        type: 'consignmentOutlet/queryDestroy',
        payload: {
          id: item.id
        }
      })
    },
    onFilterChange ({ pagination }) {
      const { current, pageSize } = pagination
      dispatch({
        type: 'consignmentOutlet/query',
        payload: {
          q,
          current,
          pageSize
        }
      })
    }
  }

  const filterProps = {
    onFilterChange (value) {
      dispatch({
        type: 'consignmentOutlet/query',
        payload: {
          q: value
        }
      })
    }
  }

  const formProps = {
    formType,
    currentOutlet,
    insertData (data, resetFields) {
      dispatch({
        type: 'consignmentOutlet/queryAdd',
        payload: {
          ...data,
          resetFields
        }
      })
    },
    editData (data, resetFields) {
      dispatch({
        type: 'consignmentOutlet/queryEdit',
        payload: {
          ...data,
          id: currentOutlet.id,
          resetFields
        }
      })
    },
    cancelEdit () {
      dispatch({
        type: 'consignmentOutlet/updateState',
        payload: {
          currentOutlet: {},
          formType: 'add'
        }
      })
    }
  }

  return (
    <div className="content-inner">
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} type="card">
        <TabPane tab="Form" key="0">
          {activeKey === '0' &&
            <div>
              <Form {...formProps} />
            </div>
          }
        </TabPane>
        <TabPane tab="List" key="1" >
          {activeKey === '1' &&
            <div>
              <Filter {...filterProps} />
              <List {...listProps} />
            </div>
          }
        </TabPane>
      </Tabs>
    </div>
  )
}

export default connect(({ consignmentOutlet, dispatch, loading }) => ({ consignmentOutlet, dispatch, loading }))(Outlet)

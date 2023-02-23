import React from 'react'
import { connect } from 'dva'
import { Col, Row, Tabs } from 'antd'
import { routerRedux } from 'dva/router'
import List from './List'
import SubList from './SubList'
import ModalMainForm from './component/modalMainForm'

const TabPane = Tabs.TabPane

const listColumn = {
  xs: 24,
  sm: 24,
  md: 8,
  lg: 6,
  xl: 6
}

function Product ({ consignmentCategory, dispatch, loading }) {
  const { list, subList, currentItem, activeKey, modalForm, modalType, formType } = consignmentCategory

  const changeTab = (key) => {
    dispatch({
      type: 'consignmentCategory/updateState',
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

  const updateCurrentItem = ({ value }) => {
    if (value.name) {
      dispatch({
        type: 'consignmentCategory/updateState',
        payload: {
          currentItem: value,
          formType: 'edit'
        }
      })
    }
  }

  const showModalForm = ({ value = null, type = null }) => {
    if (value && value.id) {
      updateCurrentItem({ value })
    } else {
      dispatch({
        type: 'consignmentCategory/updateState',
        payload: {
          currentItem: {},
          formType: 'add'
        }
      })
    }
    if (type) {
      dispatch({
        type: 'consignmentCategory/updateState',
        payload: {
          modalType: type
        }
      })
    }
    dispatch({
      type: 'consignmentCategory/updateState',
      payload: {
        modalForm: !modalForm
      }
    })
  }

  const listProps = {
    dataSource: list,
    showModalForm
  }

  const subListProps = {
    list,
    dataSource: subList,
    showModalForm
  }

  const modalFormProps = {
    list,
    modalForm,
    modalType,
    currentItem,
    formType,
    loading: (loading.effects['consignmentCategory/queryAdd']
      || loading.effects['consignmentCategory/queryEdit']
      || loading.effects['consignmentCategory/subQueryAdd']
      || loading.effects['consignmentCategory/subQueryEdit']
    ),
    showModalForm,
    onSubmit (data) {
      if (modalType === 'main') {
        if (formType === 'add') {
          dispatch({
            type: 'consignmentCategory/queryAdd',
            payload: {
              ...data,
              id: currentItem.id
            }
          })
        } else {
          dispatch({
            type: 'consignmentCategory/queryEdit',
            payload: {
              ...data,
              id: currentItem.id
            }
          })
        }
        return true
      }
      if (formType === 'add') {
        dispatch({
          type: 'consignmentCategory/subQueryAdd',
          payload: {
            ...data,
            id: currentItem.id,
            categoryId: data.mainCategory
          }
        })
      } else {
        dispatch({
          type: 'consignmentCategory/subQueryEdit',
          payload: {
            ...data,
            id: currentItem.id,
            categoryId: data.mainCategory
          }
        })
      }
    }
  }

  return (
    <div className="content-inner">
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} type="card">
        <TabPane tab="Category List" key="0" >
          {activeKey === '0' &&
            <Row>
              <Col {...listColumn}>
                <List {...listProps} />
              </Col>
            </Row>
          }
        </TabPane>
        <TabPane tab="Sub-Category List" key="1" >
          {activeKey === '1' &&
            <Row>
              <Col {...listColumn}>
                <SubList {...subListProps} />
              </Col>
            </Row>
          }
        </TabPane>
      </Tabs>

      {modalForm && <ModalMainForm {...modalFormProps} />}
    </div>
  )
}

export default connect(({ consignmentCategory, dispatch, loading }) => ({ consignmentCategory, dispatch, loading }))(Product)

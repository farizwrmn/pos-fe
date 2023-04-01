import React from 'react'
import { connect } from 'dva'
import { Button, Col, Row } from 'antd'
import { routerRedux } from 'dva/router'
import Form from './Form'
import FormImport from './FormImport'
import ConflictedList from './ConflictedList'
import List from './List'
import FormSearch from './FormSearch'

const listColumnProps = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 6,
  xl: 6
}

const autoReconColumnProps = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 18,
  xl: 18
}

const AutoReconciliation = ({ loading, accountRule, dispatch, autorecon, location }) => {
  const {
    modalVisible,
    conflictedCSV,
    conflictedPayment
  } = autorecon
  const { listAccountCode } = accountRule

  const formProps = {
    listAccountCode,
    loading,
    query: location.query,
    showImportModal () {
      dispatch({
        type: 'autorecon/updateState',
        payload: {
          modalVisible: true
        }
      })
    },
    onSubmit (params) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          ...params
        }
      }))
    }
  }

  const formImportProps = {
    modalVisible,
    loading,
    importCSV (array, filename) {
      dispatch({
        type: 'autorecon/importCsv',
        payload: {
          list: array,
          filename
        }
      })
    },
    onCloseModal () {
      dispatch({
        type: 'autorecon/updateState',
        payload: {
          modalVisible: false
        }
      })
    }
  }

  const conflictedListProps = {
    conflictedCSV,
    conflictedPayment
  }

  const formSearchProps = {
    searchQuery (value) {
      console.log('search', value)
    }
  }

  const listProps = {

  }

  return (
    <Row>
      <Col {...listColumnProps} style={{ paddingRight: '10px', marginBottom: '10px' }}>
        <div className="content-inner">
          <FormSearch {...formSearchProps} />
          <List {...listProps} />
        </div>
      </Col>
      <Col {...autoReconColumnProps} style={{ paddingRight: '10px', marginBottom: '10px' }}>
        <div className="content-inner">
          <FormImport {...formImportProps} />
          <Row>
            <Form {...formProps} />
          </Row>
          <Row>
            <Button type="primary" size="default" >Conflict</Button>
          </Row>
          <Row>
            <ConflictedList {...conflictedListProps} />
          </Row>
        </div>
      </Col>
    </Row>
  )
}

export default connect(({
  accountRule,
  autorecon,
  loading,
  pos
}) => ({ loading, pos, autorecon, accountRule }))(AutoReconciliation)

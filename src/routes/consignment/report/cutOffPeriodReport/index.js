import React from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Button, Card, Col, Modal, Pagination, Row, Tabs } from 'antd'
import { routerRedux } from 'dva/router'
import Information from './Information'
import LastCutOff from './LastCutOff'
import Form from './Form'

const TabPane = Tabs.TabPane

function CutOffPeriodReport ({ consignmentCutOffPeriodReport, dispatch, loading }) {
  const { activeKey, list, lastCutOffDate, pagination } = consignmentCutOffPeriodReport

  const changeTab = (key) => {
    dispatch({
      type: 'consignmentCutOffPeriodReport/updateState',
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

  const sendEmail = (record) => {
    Modal.confirm({
      title: 'Blast Cut Off Emails',
      content: 'Are you sure?',
      onOk: () => {
        dispatch({
          type: 'consignmentCutOffPeriodReport/querySendEmail',
          payload: {
            record
          }
        })
      }
    })
  }

  const changePage = (page) => {
    dispatch({
      type: 'consignmentCutOffPeriodReport/query',
      payload: {
        page
      }
    })
  }

  const formProps = {
    loading: loading.effects['consignmentCutOffPeriodReport/queryAdd'],
    onSubmit (value) {
      dispatch({
        type: 'consignmentCutOffPeriodReport/queryAdd',
        payload: {
          period: moment(value).format('YYYY-MM-DD')
        }
      })
    }
  }

  return (
    <div className="content-inner">
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} type="card">
        <TabPane tab="Period" key="0" >
          {activeKey === '0' &&
            <div>
              <Information />
              <LastCutOff lastCutOffDate={lastCutOffDate} />
              <Form {...formProps} />
              {list && list.length > 0 &&
                <Row gutter={24}>
                  {list.map(record => (
                    <Col lg={4} md={6} xs={12} sm={12} style={{ marginTop: '8px' }} key={record.id}>
                      <Card>
                        <div style={{ marginBottom: '15px' }}>
                          <div>{moment(record.period).format('DD MMM YYYY')}</div>
                        </div>
                        <Button icon="mail" type="primary" onClick={() => sendEmail(record)} loading={loading.effects['consignmentCutOffPeriodReport/querySendEmail']} disabled={record.emailSent !== 1}>
                          {record.emailSent === 1 ? 'Kirim Email' : 'Sent'}
                        </Button>
                      </Card>
                    </Col>
                  ))}
                </Row>}
              <Pagination {...pagination} onChange={changePage} />
            </div>
          }
        </TabPane>
      </Tabs>
    </div>
  )
}

export default connect(({ consignmentCutOffPeriodReport, dispatch, loading }) => ({ consignmentCutOffPeriodReport, dispatch, loading }))(CutOffPeriodReport)

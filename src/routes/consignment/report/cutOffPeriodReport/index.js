import React from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Button, Card, Col, Pagination, Row, Tabs } from 'antd'
import { routerRedux } from 'dva/router'
import Information from './Information'
import LastCutOff from './LastCutOff'
import Form from './Form'

const TabPane = Tabs.TabPane

function CutOffPeriodReport ({ consignmentCutOffPeriodReport, dispatch }) {
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
    dispatch({
      type: 'consignmentCutOffPeriodReport/querySendEmail',
      payload: {
        record
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
                    <Col lg={6} md={12} style={{ marginTop: '8px' }}>
                      <Card>
                        <div style={{ height: '60px' }}>
                          <div>{moment(record.period).format('DD MMM YYYY')}</div>
                          <div>{record['outlet.outlet_name']}</div>
                        </div>
                        <Button icon="mail" type="primary" onClick={() => sendEmail(record)}>KIRIM EMAIL</Button>
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

export default connect(({ consignmentCutOffPeriodReport, dispatch }) => ({ consignmentCutOffPeriodReport, dispatch }))(CutOffPeriodReport)

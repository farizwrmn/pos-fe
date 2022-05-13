import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import moment from 'moment'
import {
  Row,
  Col,
  Modal,
  // Tag,
  Button
} from 'antd'
import TransDetail from './TransDetail'
import styles from './index.less'

const Detail = ({ grabmartCampaign, loading, dispatch }) => {
  const { listDetail, data } = grabmartCampaign
  const content = []
  for (let key in data) {
    if ({}.hasOwnProperty.call(data, key)) {
      if (key !== 'policeNoId' && key !== 'storeId' && key !== 'id' && key !== 'memberId') {
        content.push(
          <div key={key} className={styles.item}>
            <div>{key}</div>
            <div>{String(data[key])}</div>
          </div>
        )
      }
    }
  }

  const BackToList = () => {
    dispatch(routerRedux.push('/integration/grabmart-campaign?activeKey=1'))
  }

  const formDetailProps = {
    dataSource: listDetail,
    loading,
    onDeleteStore (item) {
      Modal.confirm({
        title: 'Delete this campaign',
        content: 'Are you sure ?',
        onOk () {
          dispatch({
            type: 'grabmartCampaign/deleteGrabmart',
            payload: {
              data: {
                id: item.id,
                campaignId: data.id
              }
            }
          })
        }
      })
    },
    onUploadStore (item) {
      Modal.confirm({
        title: 'Upload to grabmart campaign; ETA: 5 Minutes',
        content: 'Are you sure ?',
        onOk () {
          dispatch({
            type: 'grabmartCampaign/uploadGrabmart',
            payload: {
              data: {
                id: item.id,
                campaignId: data.id,
                merchantId: item.grabStore.merchantId,
                name: data.name,
                quotasTotalCount: data.quotasTotalCount,
                quotasTotalCountPerUser: data.quotasTotalCountPerUser,
                conditionsStartTime: data.conditionsStartTime,
                conditionsEndTime: data.conditionsEndTime,
                conditionsWorkingHourStartTime: moment(data.conditionsWorkingHourStartTime, 'HH:mm:ss').format('HH:mm'),
                conditionsWorkingHourEndTime: moment(data.conditionsWorkingHourEndTime, 'HH:mm:ss').format('HH:mm'),
                conditionsEaterType: data.conditionsEaterType,
                conditionsMinBasketAmount: data.conditionsMinBasketAmount,
                discountCap: data.discountCap,
                discountValue: data.discountValue,
                discountType: data.discountType,
                discountScopeType: data.discountScopeType,
                discountObjectId: item.grabProductId
              }
            }
          })
        }
      })
    }
  }

  return (<div className="wrapper">
    <Row>
      <Col lg={10}>
        <div className="content-inner-zero-min-height">
          <Button type="primary" icon="rollback" onClick={() => BackToList()}>Back</Button>
          <h1>Invoice Info</h1>
          <div className={styles.content}>
            {content}
          </div>
        </div>
      </Col>
      <Col lg={14}>
        <div className="content-inner-zero-min-height">
          <h1>Items</h1>
          <Row style={{ padding: '10px', margin: '4px' }}>
            <TransDetail {...formDetailProps} />
          </Row>
        </div>
      </Col>
    </Row>
  </div>)
}

Detail.propTypes = {
  app: PropTypes.object,
  grabmartCampaign: PropTypes.object
}

export default connect(({ app, loading, grabmartCampaign }) => ({ app, loading, grabmartCampaign }))(Detail)

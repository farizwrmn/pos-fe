import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
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
    onUploadStore (data) {
      Modal.confirm({
        title: 'Upload to grabmart campaign',
        content: 'Are you sure ?',
        onOk () {
          dispatch({
            type: 'grabmartCampaign/uploadGrabmart',
            payload: {
              data
            }
          })
        }
      })
    }
  }

  return (<div className="wrapper">
    <Row>
      <Col lg={12}>
        <div className="content-inner-zero-min-height">
          <Button type="primary" icon="rollback" onClick={() => BackToList()}>Back</Button>
          <h1>Invoice Info</h1>
          <div className={styles.content}>
            {content}
          </div>
        </div>
      </Col>
      <Col lg={12}>
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

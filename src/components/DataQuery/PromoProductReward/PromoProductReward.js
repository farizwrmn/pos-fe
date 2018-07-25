import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Popover, Tag, Row, Col, Button, Table } from 'antd'
import styles from '../../../themes/index.less'

const width = 500
const PromoProductReward = ({
  dispatch,
  className,
  loading,
  currentId = null,
  columnsRules = [
    {
      title: 'type',
      dataIndex: 'type',
      key: 'type',
      width: `${width * 0.15}px`,
      render: (text) => {
        return (
          <span>
            <Tag color={text === 'P' ? 'green' : 'blue'}>
              {text === 'P' ? 'Product' : 'Service'}
            </Tag>
          </span>)
      }
    },
    {
      title: 'Code',
      dataIndex: 'productCode',
      key: 'productCode',
      width: `${width * 0.15}px`
    },
    {
      title: 'Item',
      dataIndex: 'productName',
      key: 'productName',
      width: `${width * 0.15}px`
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      width: `${width * 0.15}px`
    }
  ],
  columnsReward = [
    {
      title: 'type',
      dataIndex: 'type',
      key: 'type',
      width: `${width * 0.15}px`,
      render: (text) => {
        return (
          <span>
            <Tag color={text === 'P' ? 'green' : 'blue'}>
              {text === 'P' ? 'Product' : 'Service'}
            </Tag>
          </span>)
      }
    },
    {
      title: 'Code',
      dataIndex: 'productCode',
      key: 'productCode',
      width: `${width * 0.15}px`
    },
    {
      title: 'Item',
      dataIndex: 'productName',
      key: 'productName',
      width: `${width * 0.15}px`
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      className: styles.alignRight,
      width: `${width * 0.15}px`
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      className: styles.alignRight,
      width: `${width * 0.15}px`
    }
  ],
  onRowClick,
  bundlingRules,
  bundlingReward,
  ...tableProps
}) => {
  const { listRules } = bundlingRules
  const { listReward } = bundlingReward
  const content = (
    <div>
      <h3>Rules</h3>
      <Table
        {...tableProps}
        dataSource={listRules}
        loading={loading.effects['bundlingRules/query']}
        scroll={{ x: 500, y: 388 }}
        columns={columnsRules}
        simple
        rowKey={record => record.id}
        onRowClick={onRowClick}
      />
      <h3>Reward</h3>
      <Table
        {...tableProps}
        dataSource={listReward}
        loading={loading.effects['bundlingReward/query']}
        scroll={{ x: 500, y: 388 }}
        columns={columnsReward}
        simple
        rowKey={record => record.id}
        onRowClick={onRowClick}
      />
    </div>
  )

  const queryView = () => {
    dispatch({
      type: 'bundlingRules/query',
      payload: {
        type: 'all',
        bundleId: currentId
      }
    })
    dispatch({
      type: 'bundlingReward/query',
      payload: {
        type: 'all',
        bundleId: currentId
      }
    })
  }

  const choosePromo = () => {
    new Promise((resolve, reject) => {
      dispatch({
        type: 'pospromo/addPosPromo',
        payload: {
          type: 'all',
          bundleId: currentId,
          currentBundle: localStorage.getItem('bundle_promo') ? JSON.parse(localStorage.getItem('bundle_promo')) : [],
          currentProduct: localStorage.getItem('cashier_trans') ? JSON.parse(localStorage.getItem('cashier_trans')) : [],
          currentService: localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')) : [],
          resolve,
          reject
        }
      })
    }).then((res) => {
      console.log(res)
      dispatch({
        type: 'promo/updateState',
        payload: {
          modalPromoVisible: false
        }
      })
    }).catch((err) => {
      console.log(err)
    })
  }
  const titlePopover = () => {
    return (
      <Row>
        <Col span={8}>
          <h2>Promo Detail</h2>
        </Col>
        <Col span={1} offset={12}>
          <Button
            type="primary"
            onClick={() => choosePromo()}
          >
            Choose
          </Button>
        </Col>
      </Row>
    )
  }

  return (
    <div>
      <Popover placement="leftTop" content={content} title={titlePopover()} trigger="click">
        <Button onClick={queryView}>View</Button>
      </Popover>
    </div>
  )
}

PromoProductReward.propTypes = {
  form: PropTypes.object.isRequired,
  pospromo: PropTypes.object.isRequired,
  promo: PropTypes.object.isRequired,
  bundlingRules: PropTypes.object.isRequired,
  bundlingReward: PropTypes.object.isRequired,
  loading: PropTypes.object
}

export default connect(({ bundlingRules, bundlingReward, pospromo, promo, loading }) => ({ bundlingRules, bundlingReward, pospromo, promo, loading }))(PromoProductReward)

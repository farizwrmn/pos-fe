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
  enableChoosePromoDetail,
  app,
  item,
  // columnsRules = [
  //   {
  //     title: 'type',
  //     dataIndex: 'type',
  //     key: 'type',
  //     width: `${width * 0.15}px`,
  //     render: (text) => {
  //       return (
  //         <span>
  //           <Tag color={text === 'P' ? 'green' : 'blue'}>
  //             {text === 'P' ? 'Product' : 'Service'}
  //           </Tag>
  //         </span>)
  //     }
  //   },
  //   {
  //     title: 'Code',
  //     dataIndex: 'productCode',
  //     key: 'productCode',
  //     width: `${width * 0.15}px`
  //   },
  //   {
  //     title: 'Item',
  //     dataIndex: 'productName',
  //     key: 'productName',
  //     width: `${width * 0.15}px`
  //   },
  //   {
  //     title: 'Qty',
  //     dataIndex: 'qty',
  //     key: 'qty',
  //     width: `${width * 0.15}px`
  //   }
  // ],
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
  pos,
  ...tableProps
}) => {
  const { listReward } = bundlingReward
  // const { listRules } = bundlingRules
  const content = (
    <div>
      {/* <h3>Reward</h3> */}
      <Table
        {...tableProps}
        dataSource={listReward}
        loading={loading.effects['bundlingReward/query']}
        scroll={{ x: 500, y: 388 }}
        columns={columnsReward}
        simple
        pagination={false}
        rowKey={record => record.id}
        onRowClick={onRowClick}
      />
      {/* <h3>Rules</h3>
      <Table
        {...tableProps}
        dataSource={listRules}
        loading={loading.effects['bundlingRules/query']}
        scroll={{ x: 500, y: 388 }}
        columns={columnsRules}
        simple
        rowKey={record => record.id}
        onRowClick={onRowClick}
      /> */}
    </div>
  )

  const queryView = () => {
    dispatch({
      type: 'bundlingRules/updateState',
      payload: {
        listRules: []
      }
    })
    dispatch({
      type: 'bundlingReward/updateState',
      payload: {
        listReward: []
      }
    })
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
    dispatch({
      type: 'pospromo/addPosPromo',
      payload: {
        bundleId: currentId
      }
    })
    dispatch({
      type: 'promo/updateState',
      payload: {
        visiblePopover: false,
        modalPromoVisible: false
      }
    })
  }

  return (
    <div>
      <Popover
        placement="leftTop"
        content={content}
        title={(
          <Row>
            <Col span={8}>
              <h2>Promo Detail</h2>
            </Col>
            <Col span={1} offset={12}>
              {enableChoosePromoDetail && <Button
                type="primary"
                disabled={loading.effects['pospromo/addPosPromo']}
                onClick={() => choosePromo()}
              >
                Choose
              </Button>}
            </Col>
          </Row>
        )}
        trigger="click"
      >
        <Button onClick={queryView}>View</Button>
      </Popover>
    </div>
  )
}

PromoProductReward.propTypes = {
  pos: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  pospromo: PropTypes.object.isRequired,
  promo: PropTypes.object.isRequired,
  bundlingRules: PropTypes.object.isRequired,
  bundlingReward: PropTypes.object.isRequired,
  loading: PropTypes.object
}

export default connect(({ pos, app, bundlingRules, bundlingReward, pospromo, promo, loading }) => ({ pos, app, bundlingRules, bundlingReward, pospromo, promo, loading }))(PromoProductReward)

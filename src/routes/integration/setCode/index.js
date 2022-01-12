import React from 'react'
import PropTypes from 'prop-types'
import { Button, Spin } from 'antd'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'


const ShopeeIntegration = ({ shopeeIntegration, dispatch, loading }) => {
  const { setCodeMessage } = shopeeIntegration
  const onClickHome = () => {
    dispatch(routerRedux.push({
      pathname: '/balance/current'
    }))
  }

  if (setCodeMessage) {
    return (
      <div className="content-inner">
        <h1>{setCodeMessage}</h1>
        <Button type="primary" icon="home" onClick={onClickHome}>Go To Home</Button>
      </div>
    )
  }

  if (loading.effects['shopeeIntegration/setCode']) {
    return (
      <div className="content-inner">
        <Spin />
      </div>
    )
  }

  return null
}

ShopeeIntegration.propTypes = {
  shopeeIntegration: PropTypes.object,
  loading: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ shopeeIntegration, loading, app }) => ({ shopeeIntegration, loading, app }))(ShopeeIntegration)

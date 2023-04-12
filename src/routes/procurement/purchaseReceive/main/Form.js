import React from 'react'
import PropTypes from 'prop-types'
import { Form, Collapse, Spin } from 'antd'
import { Link } from 'dva/router'
import Detail from './Detail'

const { Panel } = Collapse

const FormCounter = ({
  onGetDetailData,
  loading,
  listTrans,
  listDetail
}) => {
  const onGetDetail = (value) => {
    if (value) {
      onGetDetailData(value)
    }
  }
  return (
    <Form layout="horizontal">
      {listTrans && listTrans.length > 0 ? (
        <Collapse accordion onChange={onGetDetail}>
          {listTrans.map(item => (
            <Panel header={`${item.supplierName} Count: ${item.countSupplier}`} key={item.supplierId}>
              {listDetail
                && !loading.effects['purchaseReceive/queryDetail']
                ? <Detail loading={loading} dataSource={listDetail} /> : <Spin />}
            </Panel>
          ))}
        </Collapse>
      ) : <div>No Transaction. To create new <Link to="/transaction/procurement/order">click here</Link></div>}
    </Form>
  )
}

FormCounter.propTypes = {
  onGetDetailData: PropTypes.func,
  loading: PropTypes.object,
  listTrans: PropTypes.array,
  listDetail: PropTypes.array
}

export default FormCounter

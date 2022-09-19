import React from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Row
} from 'antd'
import List from './ListDetail'


const TransDetail = ({
  dataSource,
  dispatch,
  loading,
  detailData,
  onRowClick
}) => {
  const listProps = {
    pagination: false,
    dataSource,
    loading,
    editList (record) {
      onRowClick(record)
    },
    onChange (page) {
      dispatch({
        type: 'stockOpname/queryDetailData',
        payload: {
          page: page.current,
          pageSize: 40,
          status: ['DIFF', 'CONFLICT'],
          order: '-updatedAt',
          transId: detailData.id,
          storeId: detailData.storeId,
          batchId: detailData.activeBatch.id
        }
      })
    }
  }

  return (
    <Form layout="horizontal">
      <Row>
        <List {...listProps} />
      </Row>
    </Form>
  )
}

TransDetail.propTypes = {
  form: PropTypes.object.isRequired,
  disabled: PropTypes.string,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  changeTab: PropTypes.func,
  listDetail: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired
    })
  ).isRequired,
  clickBrowse: PropTypes.func,
  activeKey: PropTypes.string,
  button: PropTypes.string
}

export default Form.create()(TransDetail)

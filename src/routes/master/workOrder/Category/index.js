import React from 'react'
import { connect } from 'dva'
import { Row, Col, Table, Button, Checkbox } from 'antd'
import styles from '../../../../themes/index.less'

const WorkOrderCategory = ({
  workorder,
  productcategory,
  dispatch
}) => {
  const { listWorkOrderCategoryTemp, checkAllCategories } = workorder
  const { listCategory } = productcategory

  const checkSelected = (obj, arr) => {
    for (let key in arr) {
      if (arr[key].productCategoryId === obj.id) {
        return true
      }
    }
    return checkAllCategories || false
  }

  let categories = []
  if (listCategory && listCategory.length) {
    for (let key in listCategory) {
      categories.push(Object.assign(listCategory[key], { selected: checkSelected(listCategory[key], listWorkOrderCategoryTemp) }))
    }
  }

  const check = (val, record) => {
    dispatch({
      type: 'workorder/selectOne',
      payload: { val, record, total: listCategory.length }
    })
  }

  const checkAll = (val) => {
    dispatch({
      type: 'workorder/selectAll',
      payload: { val, list: listCategory }
    })
  }

  const handleSubmit = () => {
    dispatch({ type: 'workorder/saveWOCategory', payload: listWorkOrderCategoryTemp })
  }

  const columns = [
    {
      title: 'Category',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 400
    },
    {
      title: (<Checkbox checked={listWorkOrderCategoryTemp.length === listCategory.length ? true : checkAllCategories} onChange={e => checkAll(e.target.checked)} />),
      dataIndex: 'id',
      key: 'id',
      className: styles.alignCenter,
      width: 100,
      render: (text, record) => {
        return (<Checkbox value={text} checked={record.selected} onChange={e => check(e.target.checked, record)} />)
      }
    }
  ]

  const tableProps = {
    dataSource: categories,
    columns,
    bordered: true
  }

  return (
    <div className="content-inner">
      <h2 style={{ fontWeight: 'bold' }}>Add Checklist</h2>
      <Row style={{ marginTop: 20 }}>
        <Col xs={24} sm={18} md={16} lg={12}>
          <Table {...tableProps} />
          <Button size="large" type="primary" onClick={handleSubmit} style={{ float: 'right' }}>Save</Button>
        </Col>
      </Row>
    </div>
  )
}

export default connect(({ workorder, productcategory }) => ({ workorder, productcategory }))(WorkOrderCategory)

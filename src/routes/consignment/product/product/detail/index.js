import React from 'react'
import { connect } from 'dva'
import { Button, Col, Row } from 'antd'
import { routerRedux } from 'dva/router'
import Form from './Form'


function Detail ({ consignmentProduct, consignmentCategory, dispatch }) {
  const { selectedProduct, formType } = consignmentProduct
  const {
    list: categoryList,
    subList: subCategoryList
  } = consignmentCategory

  const BackToList = () => {
    dispatch(routerRedux.push('/integration/consignment/product?activeKey=0'))
  }

  const formProps = {
    categoryList,
    subCategoryList,
    formType,
    selectedProduct,
    onSubmit (data) {
      dispatch({
        type: 'consignmentProduct/queryEdit',
        payload: {
          data: {
            ...data,
            id: selectedProduct.id
          }
        }
      })
    }
  }

  return (
    <div className="wrapper">
      <Row>
        <Col lg={12}>

          <div className="content-inner-zero-min-height">
            <Button type="primary" icon="rollback" onClick={() => BackToList()}>Back</Button>
            <h1>Form</h1>

            <Form {...formProps} />
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default connect(({
  consignmentProduct,
  consignmentCategory,
  dispatch
}) => ({ consignmentProduct, consignmentCategory, dispatch }))(Detail)

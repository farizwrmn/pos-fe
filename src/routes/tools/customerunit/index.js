import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Button, Form } from 'antd'
import { connect } from 'dva'
import FormUnit from '../../master/customer/components/unit/FormUnit'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    xs: { span: 10 },
    sm: { span: 8 },
    md: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 14 },
    sm: { span: 14 },
    md: { span: 14 }
  }
}

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const Maintenance = ({ maintenance, customerunit, loading, dispatch }) => {
  const { modalCustomerAssetVisible } = maintenance
  const { selected } = customerunit
  const { unitItem } = customerunit

  const handleShowCustomerUnit = () => {
    dispatch({
      type: 'customerunit/getMemberAssets',
      payload: {
        license: ''
      }
    })
    dispatch({
      type: 'maintenance/updateState',
      payload: {
        modalCustomerAssetVisible: true
      }
    })
  }

  const formUnitProps = {
    item: unitItem,
    modalType: 'maintenance',
    button: 'Maintenance',
    modalCustomerAssetVisible,
    loading,
    dispatch,
    child: [
      {
        label: 'Memo',
        name: 'memo',
        options: {
          initialValue: null,
          rules: [
            {
              required: true
            }
          ]
        }
      }
    ],
    prefix: (
      <FormItem label="Customer Unit" hasFeedback {...formItemLayout}>
        <Button onClick={handleShowCustomerUnit}>Customer Unit</Button>
      </FormItem>
    ),
    onSubmit (data) {
      dispatch({
        type: 'maintenance/addCustomerUnitLog',
        payload: data
      })
    },
    onCancelAssets () {
      dispatch({
        type: 'maintenance/updateState',
        payload: {
          modalCustomerAssetVisible: false
        }
      })
    },
    onRowClick () {
      dispatch({
        type: 'maintenance/updateState',
        payload: {
          modalCustomerAssetVisible: false
        }
      })
    },
    onFocusBrand () {
      dispatch({ type: 'customerunit/queryCarBrands' })
    },
    onFocusModel () {
      if (Object.keys(selected.brand).length) {
        dispatch({ type: 'customerunit/queryCarModels', payload: { code: selected.brand.key } })
      }
    },
    onFocusType () {
      if (Object.keys(selected.model).length) {
        dispatch({ type: 'customerunit/queryCarTypes', payload: { code: selected.model.key } })
      }
    },
    onSelectBrand (brand) {
      dispatch({
        type: 'customerunit/updateState',
        payload: {
          selected: {
            brand,
            model: selected.model,
            type: selected.type
          }
        }
      })
    },
    onSelectModel (model) {
      dispatch({
        type: 'customerunit/updateState',
        payload: {
          selected: {
            brand: selected.brand,
            model,
            type: selected.type
          }
        }
      })
    },
    onSelectType (type) {
      dispatch({
        type: 'customerunit/updateState',
        payload: {
          selected: {
            brand: selected.brand,
            model: selected.model,
            type
          }
        }
      })
    },
    resetCars () {
      dispatch({
        type: 'customerunit/updateState',
        payload: {
          listBrand: [],
          listModel: [],
          listType: []
        }
      })
    }
  }

  return (
    <div className="content-inner">
      <Row>
        <Col {...column}>
          <FormUnit {...formUnitProps} />
        </Col>
        <Col {...column} />
      </Row>
    </div>
  )
}
Maintenance.propTypes = {
  maintenance: PropTypes.object.isRequired,
  customerunit: PropTypes.object.isRequired,
  dispatch: PropTypes.func,
  loading: PropTypes.object.isRequired
}

Maintenance.defaultProps = {
  maintenance: {},
  loading: {},
  customerunit: {}
}

export default connect(({ maintenance, customerunit, loading, app }) => ({ maintenance, customerunit, loading, app }))(Maintenance)

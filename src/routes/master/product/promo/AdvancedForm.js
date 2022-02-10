import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Row, Col, Card, Table, Tag, Icon, Modal, message } from 'antd'
import { FooterToolbar } from 'components'
import ModalProduct from './ModalProduct'
import styles from '../../../../themes/index.less'

const { TextArea } = Input
const FormItem = Form.Item

const formItemLayout = {
  style: {
    marginTop: 8
  },
  labelCol: {
    xs: { span: 9 },
    sm: { span: 8 },
    md: { span: 8 },
    lg: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 15 },
    sm: { span: 16 },
    md: { span: 16 },
    lg: { span: 16 }
  }
}

const column = {
  md: { span: 24 },
  lg: { span: 12 }
}

const AdvancedForm = ({
  item = {},
  onSubmit,
  onCancel,
  loadingButton,
  modalProductVisible,
  dispatch,
  paginationProduct,
  searchText,
  onGetProduct,
  tmpProductData,
  searchTextProduct,
  button,
  listItem,
  modalType,
  onSearchProductData,
  onSearchProduct,
  onChooseProduct,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
    resetFields
  }
}) => {
  const tailFormItemLayout = {
    wrapperCol: {
      span: 24,
      xs: {
        offset: modalType === 'edit' ? 10 : 18
      },
      sm: {
        offset: modalType === 'edit' ? 17 : 22
      },
      md: {
        offset: modalType === 'edit' ? 18 : 22
      },
      lg: {
        offset: modalType === 'edit' ? 11 : 19
      }
    }
  }

  const handleCancel = () => {
    onCancel()
    resetFields()
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      if (!getFieldValue('variant') && getFieldValue('useVariant') && !item.productParentId) {
        message.warning('Must Choose Product')
        return
      }
      if (getFieldValue('useVariant') && !data.variantId.key) {
        message.warning('Must Choose Variant')
        return
      }
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          const data = getFieldsValue()
          data.productName = data.productName ? data.productName.label : null
          data.productCode = data.productCode ? data.productCode.label : null
          data.program = data.program ? data.program.label : null
          data.level = data.level ? data.level.label : null
          onSubmit(data.productCode, data, resetFields)
        },
        onCancel () { }
      })
    })
  }

  const hdlSearchPagination = (page) => {
    const query = {
      q: searchTextProduct,
      page: page.current,
      pageSize: page.pageSize
    }
    onSearchProductData(query)
  }

  const hdlSearch = (e) => {
    onSearchProduct(e, tmpProductData)
  }

  const modalProductProps = {
    title: 'Product',
    visible: modalProductVisible,
    footer: null,
    hdlSearch,
    searchText,
    onCancel () {
      dispatch({
        type: 'productstock/updateState',
        payload: {
          modalProductVisible: false
        }
      })
    }
  }

  const handleMenuClick = (record) => {
    onChooseProduct(record)
    dispatch({
      type: 'productstock/updateState',
      payload: {
        modalProductVisible: false
      }
    })
  }

  const hdlGetProduct = () => {
    onGetProduct()
    dispatch({
      type: 'productstock/updateState',
      payload: {
        modalProductVisible: true
      }
    })
  }

  const columns = [
    {
      title: 'Active',
      dataIndex: 'active',
      key: 'active',
      render: (text) => {
        return <Tag color={text ? 'blue' : 'red'}>{text ? 'Active' : 'Non-Active'}</Tag>
      }
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      key: 'productCode'
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName'
    },
    {
      title: 'Qty',
      dataIndex: 'count',
      key: 'count',
      width: '50px',
      className: styles.alignRight,
      render: (text) => {
        if (!loadingButton.effects['pos/showProductQty']) {
          return text || 0
        }
        return <Icon type="loading" />
      }
    }
  ]

  const buttonProductProps = {
    type: 'primary',
    onClick () {
      hdlGetProduct()
    }
  }

  const cardProps = {
    bordered: true,
    style: {
      padding: 8,
      marginLeft: 8,
      marginBottom: 8
    },
    title: (
      <Row>
        <Col md={12} lg={3}>
          <h3>Suba Promo</h3>
        </Col>
      </Row>
    )
  }

  return (
    <Form layout="horizontal">
      <FooterToolbar>
        <FormItem {...tailFormItemLayout}>
          {modalType === 'edit' && <Button disabled={loadingButton && (loadingButton.effects['productstock/add'] || loadingButton.effects['productstock/edit'])} type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
          <Button type="primary" disabled={loadingButton && (loadingButton.effects['productstock/add'] || loadingButton.effects['productstock/edit'])} onClick={handleSubmit}>{button}</Button>
        </FormItem>
      </FooterToolbar>
      <Card {...cardProps}>
        <Row>
          <Col {...column}>
            <FormItem label="Program" hasFeedback {...formItemLayout}>
              {getFieldDecorator('program', {
                rules: [
                  {
                    required: true,
                    pattern: /^[a-z0-9/\n _-]{20,100}$/i,
                    message: 'At least 20 character'
                  }
                ]
              })(<TextArea maxLength={100} autosize={{ minRows: 2, maxRows: 6 }} />)}
            </FormItem>
            <FormItem label="Level" hasFeedback {...formItemLayout}>
              {getFieldDecorator('level', {
                // initialValue: item.productName,
                rules: [
                  {
                    required: true,
                    message: 'a-Z & 0-9'
                  }
                ]
              })(<Input maxLength={3} />)}
            </FormItem>
            {/* cari product promo */}
            <FormItem label="Search Product" {...formItemLayout}>
              <Button {...buttonProductProps} size="default">{item.productCode && item.productName ? `${item.productName.substring(0, 12)} (${item.productCode})` : 'Search Product'}</Button>
            </FormItem>
            <FormItem label="Product Code" {...formItemLayout}>
              <p>{item.productCode}</p>
            </FormItem>
            <FormItem label="Product Name" {...formItemLayout}>
              <p>{item.productName}</p>
            </FormItem>
          </Col>
        </Row>
      </Card>
      {modalProductVisible && (
        <ModalProduct {...modalProductProps}>
          <Table
            bordered
            pagination={paginationProduct}
            scroll={{ x: 500 }}
            columns={columns}
            simple
            loading={loadingButton.effects['productstock/query']}
            dataSource={listItem}
            size="small"
            pageSize={10}
            onChange={hdlSearchPagination}
            onRowClick={_record => handleMenuClick(_record)}
          />
        </ModalProduct>
      )}
    </Form>
  )
}

AdvancedForm.propTypes = {
  form: PropTypes.object.isRequired,
  disabled: PropTypes.string,
  modalType: PropTypes.string,
  item: PropTypes.object,
  listCategory: PropTypes.object,
  listBrand: PropTypes.object,
  onSubmit: PropTypes.func,
  showBrands: PropTypes.func,
  showCategories: PropTypes.func,
  changeTab: PropTypes.func,
  clickBrowse: PropTypes.func,
  activeKey: PropTypes.string,
  button: PropTypes.string
}

export default Form.create()(AdvancedForm)

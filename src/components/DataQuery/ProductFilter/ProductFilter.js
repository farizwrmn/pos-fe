import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table, Modal, Form, Input, Button, Select } from 'antd'
import { numberFormat } from 'utils'
import { getDistPriceName } from 'utils/string'
// import Spec from './Spec'

const formatNumberIndonesia = numberFormat.formatNumberIndonesia
const Option = Select.Option
const FormItem = Form.Item

const ProductFilter = ({
  dispatch,
  className,
  visible = false,
  isModal = true,
  enableFilter = true,
  showPagination = true,
  form: {
    getFieldDecorator,
    getFieldsValue
  },
  productstock,
  onRowClick,
  productcategory,
  productbrand,
  variant,
  specification,
  ...tableProps
}) => {
  const { listCategory } = productcategory
  const { listBrand } = productbrand
  const { searchText, list, pagination, filteredInfo, selectedRowKeys } = productstock

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '70px'
    },
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      key: 'productCode',
      width: '150px'
    }, {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
      width: '300px'
    }, {
      title: 'Category',
      dataIndex: 'categoryId',
      key: 'categoryId',
      width: '100px',
      filteredInfo: filteredInfo.categoryId || null,
      render: (text, record) => record.categoryName,
      filters: listCategory.map(x => ({ text: x.categoryName, value: x.id }))
    }, {
      title: 'Brand',
      dataIndex: 'brandId',
      key: 'brandId',
      width: '100px',
      filteredInfo: filteredInfo.brandId || null,
      render: (text, record) => record.brandName,
      filters: listBrand.map(x => ({ text: x.brandName, value: x.id }))
    }, {
      title: getDistPriceName('sellPrice'),
      dataIndex: 'sellPrice',
      key: 'sellPrice',
      width: '100px',
      render: text => formatNumberIndonesia(text)
    }, {
      title: getDistPriceName('distPrice01'),
      dataIndex: 'distPrice01',
      key: 'distPrice01',
      width: '100px',
      render: text => formatNumberIndonesia(text)
    }, {
      title: getDistPriceName('distPrice02'),
      dataIndex: 'distPrice02',
      key: 'distPrice02',
      width: '100px',
      render: text => formatNumberIndonesia(text)
    }, {
      title: getDistPriceName('distPrice03'),
      dataIndex: 'distPrice03',
      key: 'distPrice03',
      width: '100px',
      render: text => formatNumberIndonesia(text)
    }, {
      title: getDistPriceName('distPrice04'),
      dataIndex: 'distPrice04',
      key: 'distPrice04',
      width: '100px',
      render: text => formatNumberIndonesia(text)
    }, {
      title: getDistPriceName('distPrice05'),
      dataIndex: 'distPrice05',
      key: 'distPrice05',
      width: '100px',
      render: text => formatNumberIndonesia(text)
    }, {
      title: getDistPriceName('distPrice06'),
      dataIndex: 'distPrice06',
      key: 'distPrice06',
      width: '100px',
      render: text => formatNumberIndonesia(text)
    }, {
      title: getDistPriceName('distPrice07'),
      dataIndex: 'distPrice07',
      key: 'distPrice07',
      width: '100px',
      render: text => formatNumberIndonesia(text)
    }, {
      title: getDistPriceName('distPrice08'),
      dataIndex: 'distPrice08',
      key: 'distPrice08',
      width: '100px',
      render: text => formatNumberIndonesia(text)
    }, {
      title: getDistPriceName('distPrice09'),
      dataIndex: 'distPrice09',
      key: 'distPrice09',
      width: '100px',
      render: text => formatNumberIndonesia(text)
    }
  ]

  const { listVariant } = variant
  // const { modalShowSpecificationLovModalVisible, currentItem } = specification
  const productVariant = (listVariant || []).length > 0 ? listVariant.map(b => <Option value={b.id} key={b.id}>{b.name}</Option>) : []

  // const { pagination } = tableProps
  const handleSearch = () => {
    const data = getFieldsValue()
    data.variantId = data.variantId.key
    dispatch({
      type: 'productstock/query',
      payload: {
        page: 1,
        pageSize: 10,
        q: searchText,
        ...data,
        ...filteredInfo
      }
    })
  }
  const handleChange = (e) => {
    const { value } = e.target

    dispatch({
      type: 'productstock/updateState',
      payload: {
        searchText: value,
        selectedRowKeys: []
      }
    })
  }
  const handleReset = () => {
    dispatch({
      type: 'productstock/query',
      payload: {
        page: 1,
        pageSize: pagination.pageSize,
        q: null
      }
    })
    dispatch({
      type: 'productstock/updateState',
      payload: {
        searchText: null,
        filteredInfo: {}
      }
    })
  }
  const changeProduct = (page, filters) => {
    dispatch({
      type: 'productstock/updateState',
      payload: {
        filteredInfo: filters
      }
    })
    dispatch({
      type: 'productstock/query',
      payload: {
        q: searchText,
        page: page.current,
        pageSize: page.pageSize,
        ...filters
      }
    })
  }
  // const modalSpecificationSpecProps = {
  //   item: currentItem,
  //   specification,
  //   productcategory,
  //   dispatch,
  //   visible: modalShowSpecificationLovModalVisible,
  //   onCancel () {
  //     dispatch({
  //       type: 'specification/updateState',
  //       payload: {
  //         modalShowSpecificationLovModalVisible: false
  //       }
  //     })
  //   }
  // }

  const showStockSpecificationFilter = () => {
    dispatch({
      type: 'specification/updateState',
      payload: {
        modalShowSpecificationLovModalVisible: true
      }
    })
  }
  const updateSelectedKey = (key) => {
    dispatch({
      type: 'productstock/updateState',
      payload: {
        selectedRowKeys: key
      }
    })
  }
  const rowSelection = {
    onChange: (selectedRowKeys) => {
      updateSelectedKey(selectedRowKeys)
    }
  }
  const handleRowClick = (record) => {
    Modal.confirm({
      title: 'Choose Item',
      content: `Choose ${record.productCode} - ${record.productName}`,
      onOk () {
        onRowClick(record)
      }
    })
  }

  const handleClickChoose = () => {
    dispatch({
      type: 'bundling/querySomeProducts',
      payload: {
        selectedRowKeys
      }
    })

    dispatch({
      type: 'coupon/querySomeProducts',
      payload: {
        selectedRowKeys
      }
    })
  }

  return (
    <div>
      {isModal && <Modal
        className={className}
        visible={visible}
        width="80%"
        height="80%"
        footer={null}
        {...tableProps}
      >
        {enableFilter && <Form layout="inline">
          <FormItem>
            <Input placeholder="Search Product"
              value={searchText}
              onChange={e => handleChange(e)}
              onPressEnter={handleSearch}
              style={{ marginBottom: 16 }}
            />
          </FormItem>
          <FormItem>
            <Button type="primary" onClick={handleSearch}>Search</Button>
          </FormItem>
          <FormItem>
            <Button type="primary" onClick={handleReset}>Reset</Button>
          </FormItem>
        </Form>}
        <Table
          {...tableProps}
          pagination={showPagination ? pagination : false}
          dataSource={list}
          bordered
          scroll={{ x: 1000, y: 388 }}
          columns={columns}
          simple
          onChange={changeProduct}
          rowKey={record => record.id}
          onRowClick={handleRowClick}
        />
      </Modal>}
      {!isModal &&
        (<div>
          {enableFilter && <Form layout="inline">
            <FormItem>
              <Input
                placeholder="Search Product"
                autoFocus
                value={searchText}
                onChange={e => handleChange(e)}
                onPressEnter={handleSearch}
                style={{ marginBottom: 16 }}
              />
            </FormItem>
            <FormItem>
              <Button type="primary" onClick={handleSearch}>Search</Button>
            </FormItem>
            <FormItem>
              <Button onClick={handleReset}>Reset</Button>
            </FormItem>
            <FormItem>
              {getFieldDecorator('variantId', {
                initialValue: {}
              })(
                <Select
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  labelInValue
                  placeholder="Choose Variant"
                  style={{ width: '200px' }}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
                >{productVariant}
                </Select>
              )}
            </FormItem>
            <FormItem>
              <Button onClick={showStockSpecificationFilter}>Specification</Button>
            </FormItem>
            <FormItem>
              {(selectedRowKeys || []).length > 0 &&
                <Button onClick={handleClickChoose} type="primary">
                  Choose
                </Button>
              }
            </FormItem>
          </Form>}
          <Table
            {...tableProps}
            pagination={showPagination ? pagination : false}
            dataSource={list}
            bordered
            scroll={{ x: 1620, y: 388 }}
            rowSelection={rowSelection}
            selectedRowKeys={selectedRowKeys}
            columns={columns}
            simple
            onChange={changeProduct}
            rowKey={record => record.id}
            onRowClick={handleRowClick}
          />
        </div>)
      }
      {/* {modalShowSpecificationLovModalVisible && <Spec {...modalSpecificationSpecProps} />} */}
    </div>
  )
}

ProductFilter.propTypes = {
  form: PropTypes.object.isRequired,
  productstock: PropTypes.object.isRequired,
  productbrand: PropTypes.object.isRequired,
  variant: PropTypes.object.isRequired,
  specification: PropTypes.object.isRequired,
  productcategory: PropTypes.object.isRequired,
  bundling: PropTypes.object.isRequired
}

export default connect(
  ({
    productstock,
    bundling,
    productcategory,
    productbrand,
    variant,
    specification
  }) =>
  ({
    productstock,
    bundling,
    productcategory,
    productbrand,
    variant,
    specification
  })
)(Form.create()(ProductFilter))

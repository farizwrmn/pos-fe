import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Input, Form, Select } from 'antd'

const Option = Select.Option
const FormItem = Form.Item

const Specification = ({
  dispatch,
  className,
  visible = false,
  isModal = true,
  onRowClick,
  specification,
  specificationStock,
  item,
  form: {
    getFieldDecorator
  },
  modalType,
  editListItem,
  productcategory,
  ...tableProps
}) => {
  const { listCategory } = productcategory
  let listSpecificationCode = specification.listSpecification
  const productCategory = (listCategory || []).length > 0 ? listCategory.map(b => <Option value={b.id} key={b.id}>{b.categoryName}</Option>) : []

  const handleChangeInput = (e) => {
    const { id, value } = e.target
    const newListSpecificationStock = listSpecificationCode.map((x) => {
      if (x.id === Number(id)) {
        return {
          ...x,
          value
        }
      }
      return x
    })
    dispatch({
      type: 'specification/updateState',
      payload: {
        listSpecification: newListSpecificationStock
      }
    })
  }

  const InputComponent = (text, record) => (
    <div key={record.id} onClick={(e) => { e.stopPropagation() }} >
      <Input placeholder="Insert a value" key={record.id} id={record.id} value={record.value || null} onChange={value => handleChangeInput(value)} />
    </div>
  )

  const columns = [
    {
      title: 'Category Code',
      dataIndex: 'categoryCode',
      key: 'categoryCode'
    },
    {
      title: 'Category Name',
      dataIndex: 'categoryName',
      key: 'categoryName'
    },
    {
      title: 'Specification',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: (text, record) => {
        return InputComponent(null, record)
      }
    }
  ]

  const handleSearch = (e) => {
    if (e) {
      dispatch({
        type: 'specification/query',
        payload: {
          type: 'all',
          categoryId: e.key
        }
      })
      dispatch({
        type: 'specification/updateState',
        payload: {
          currentItem: {
            categoryId: e.key,
            categoryName: e.label
          }
        }
      })
    } else {
      dispatch({
        type: 'specification/updateState',
        payload: {
          listSpecification: [],
          currentItem: {}
        }
      })
    }
  }
  // const changeProduct = (page) => {
  //   dispatch({
  //     type: 'specificationStock/query',
  //     payload: {
  //       q: searchText,
  //       page: page.current,
  //       pageSize: page.pageSize
  //     }
  //   })
  // }

  return (
    <div>
      {isModal && <Modal
        className={className}
        visible={visible}
        title="Specification"
        width="80%"
        height="80%"
        footer={null}
        {...tableProps}
      >
        <Form>
          <FormItem>
            {getFieldDecorator('categoryId', {
              initialValue: item.categoryId ? {
                key: item.categoryId,
                label: item.categoryName
              } : { label: 'Choose Category' }
            })(
              <Select
                showSearch
                allowClear
                optionFilterProp="children"
                labelInValue
                placeholder="Choose Category"
                style={{ width: '200px' }}
                onChange={handleSearch}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
              >{productCategory}
              </Select>
            )}
          </FormItem>
        </Form>
        <Table
          {...tableProps}
          dataSource={listSpecificationCode}
          bordered
          columns={columns}
          simple
          locale={{
            emptyText: 'Choose Category'
          }}
          onRowClick={onRowClick}
        />
      </Modal>}
    </div>
  )
}

Specification.propTypes = {
  form: PropTypes.object.isRequired,
  specification: PropTypes.object.isRequired,
  productcategory: PropTypes.object.isRequired
}

export default Form.create()(Specification)

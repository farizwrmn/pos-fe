import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button, Upload, Row, Col, Popover, message, Icon, Checkbox } from 'antd'
import Browse from './BrowseCategory'
import BrowseBrand from './BrowseBrand'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

const onChange = (value) => {
  console.log('checked:',value);
}

const props = {
  name: 'file',
  action: '//jsonplaceholder.typicode.com/posts/',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

const modal = ({
  item = {},
  disableItem,
  onOk,
  list,
  listBrand,
  modalButtonCancelClick,
  modalButtonSaveClick,
  modalPopoverVisible,
  modalPopoverVisibleBrand,
  modalButtonCategoryClick,
  modalButtonBrandClick,
  modalPopoverClose,
  onChooseBrand,
  visiblePopover = false,
  visiblePopoverBrand = false,
  onChooseItem,
  form: { getFieldDecorator, validateFields, getFieldsValue },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        key: item.key,
      }
      data.userRole = data.userRole.join(' ')
      onOk(data)
    })
  }

  const titlePopover = (
    <Row>
      <Col span={8}>Choose</Col>
      <Col span={1} offset={15}>
        <Button shape="circle"
          icon="close-circle"
          size="small"
          onClick={() => hdlPopoverClose()}
        />
      </Col>
    </Row>
  )

  const Browseprops = {
    pagination: false,
    size: 'small',
    dataSource: list,
  }

  const BrowseBrandprops = {
    pagination: false,
    size: 'small',
    dataSource: listBrand,
  }

  const contentPopover = (
    <div>
      <Browse
        {...Browseprops}
        onRowClick={record => hdlTableRowClick(record)}
      />
    </div>
  )
  const contentPopoverBrand = (
    <div>
      <BrowseBrand
        {...BrowseBrandprops}
        onRowClick={record => hdlTableBrandRowClick(record)}
      />
    </div>
  )

  const hdlPopoverVisibleChange = () => {
    modalPopoverVisible()
  }

  const hdlPopoverVisibleBrandChange = () => {
    modalPopoverVisibleBrand()
  }

  const hdlButtonCategoryClick = () => {
    modalButtonCategoryClick()
  }

  const hdlButtonBrandClick = () => {
    modalButtonBrandClick()
  }

  const hdlPopoverClose = () => {
    modalPopoverClose()
  }

  const hdlTableRowClick = (record) => {
    console.log('hdlTableRowClick', record);
    onChooseItem(record)
  }

  const hdlTableBrandRowClick = (record) => {
    console.log('hdlTableBrandRowClick', record);
    onChooseBrand(record)
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  const hdlButtonCancelClick = () => {
    modalButtonCancelClick()
  }
  const hdlButtonSaveClick = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      console.log('Modal Data: ', data);
      data.active = data.active !== undefined ? '1' : '0'
      modalButtonSaveClick(data.productCode, data)
    })
  }

  return (
    <Modal {...modalOpts}
      footer={[
        <Button key='back'   onClick={() => hdlButtonCancelClick()} >Cancel</Button>,
        <Button key='submit' onClick={() => hdlButtonSaveClick()} type='primary' >Save</Button>,
      ]}
    >
      <Form layout='horizontal'>
      <Row>
        <Col span={8}>
            <FormItem label="Status" hasFeedback {...formItemLayout}>
              {getFieldDecorator('active', {
                valuePropName: 'checked',
                initialValue: item.active,
                rules: [
                  {
                    required: false,
                  },
                ],
              })(<Checkbox>Active</Checkbox>)}
            </FormItem>
            <FormItem label="barCode 1" hasFeedback {...formItemLayout}>
              {getFieldDecorator('barCode01', {
                initialValue: item.barCode01,
                rules: [
                  {
                    required: false,
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="barCode 2" hasFeedback {...formItemLayout}>
              {getFieldDecorator('barCode02', {
                initialValue: item.barCode02,
                rules: [
                  {
                    required: false,
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="P.Code" hasFeedback {...formItemLayout}>
              {getFieldDecorator('productCode', {
                initialValue: item.productCode,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="Product Name" hasFeedback {...formItemLayout}>
              {getFieldDecorator('productName', {
                initialValue: item.productName,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="Category Id" hasFeedback {...formItemLayout}>
              <Popover visible={visiblePopover}
                onVisibleChange={() => hdlPopoverVisibleChange()}
                title={titlePopover}
                content={contentPopover}
                trigger="click"
              >
                <Button
                  type="primary"
                  onClick={() => hdlButtonCategoryClick()}
                ><Icon type="down-square-o" />
                </Button>
              </Popover>
              {getFieldDecorator('categoryId', {
                initialValue: item.categoryId,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input style={{width:70}}/>)}
              {getFieldDecorator('categoryName', {
                initialValue: item.categoryName,
                rules: [
                  {
                    required: false,
                  },
                ],
              })(<Input style={{width:140}}/>)}
            </FormItem>
            <FormItem label="Brand ID" hasFeedback {...formItemLayout}>
              <Popover visible={visiblePopoverBrand}
                onVisibleChange={() => hdlPopoverVisibleBrandChange()}
                title={titlePopover}
                content={contentPopoverBrand}
                trigger="click"
              >
                <Button
                  type="primary"
                  onClick={() => hdlButtonBrandClick()}
                ><Icon type="down-square-o" />
                </Button>
              </Popover>
              {getFieldDecorator('brandId', {
                initialValue: item.brandId,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input style={{width: 70}}/>)}
            </FormItem>
            <FormItem label="Similar Name 1" hasFeedback {...formItemLayout}>
              {getFieldDecorator('otherName01', {
                initialValue: item.otherName01,
                rules: [
                  {
                    required: false,
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="Similar Name 2" hasFeedback {...formItemLayout}>
              {getFieldDecorator('otherName02', {
                initialValue: item.otherName02,
                rules: [
                  {
                    required: false,
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="Sell Price" hasFeedback {...formItemLayout}>
              {getFieldDecorator('sellPrice', {
                initialValue: item.sellPrice,
                rules: [
                  {
                    required: false,
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="Cost Price" hasFeedback {...formItemLayout}>
              {getFieldDecorator('costPrice', {
                initialValue: item.costPrice,
                rules: [
                  {
                    required: false,
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="Pre Price" hasFeedback {...formItemLayout}>
              {getFieldDecorator('sellPricePre', {
                initialValue: item.sellPricePre,
                rules: [
                  {
                    required: false,
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="Dist Price 1" hasFeedback {...formItemLayout}>
              {getFieldDecorator('distPrice01', {
                initialValue: item.distPrice01,
                rules: [
                  {
                    required: false,
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="Dist Price 2" hasFeedback {...formItemLayout}>
              {getFieldDecorator('distPrice02', {
                initialValue: item.distPrice02,
                rules: [
                  {
                    required: false,
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="Track Qty" hasFeedback {...formItemLayout}>
              {getFieldDecorator('trackQty', {
                initialValue: item.trackQty,
                rules: [
                  {
                    required: false,
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="Alert Qty" hasFeedback {...formItemLayout}>
              {getFieldDecorator('alertQty', {
                initialValue: item.alertQty,
                rules: [
                  {
                    required: false,
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="Image" hasFeedback {...formItemLayout}>
              {getFieldDecorator('productImage', {
                initialValue: item.productImage,
                rules: [
                  {
                    required: false,
                  },
                ],
              })(
                <Upload {...props}>
                  <Button>
                    <Icon type="upload" /> Click to Upload
                  </Button>
                </Upload>
            )}
            </FormItem>
            <FormItem label="D.Code" hasFeedback {...formItemLayout}>
              {getFieldDecorator('dummyCode', {
                initialValue: item.productCode,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input disabled={disableItem.code}/>)}
            </FormItem>
            <FormItem label="Dummy Name" hasFeedback {...formItemLayout}>
              {getFieldDecorator('dummyName', {
                initialValue: item.productName,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input disabled={disableItem.code}/>)}
            </FormItem>
            <FormItem label="Location 1" hasFeedback {...formItemLayout}>
              {getFieldDecorator('location01', {
                initialValue: item.location01,
                rules: [
                  {
                    required: false,
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="Location 2" hasFeedback {...formItemLayout}>
              {getFieldDecorator('location02', {
                initialValue: item.location02,
                rules: [
                  {
                    required: false,
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="Exception" hasFeedback {...formItemLayout}>
              {getFieldDecorator('exception01', {
                initialValue: item.exception01,
                rules: [
                  {
                    required: false,
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onChooseItem: PropTypes.func
}

export default Form.create()(modal)

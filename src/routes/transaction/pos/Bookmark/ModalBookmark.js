import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Pagination, Spin } from 'antd'
import styles from './bookmark.less'
import EmptyBookmark from './EmptyBookmark'
import ImageBookmark from './ImageBookmark'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

class ModalBookmark extends Component {
  componentDidMount () {
    setTimeout(() => {
      const selector = document.getElementById('shortOrderNumber')
      if (selector) {
        selector.focus()
        selector.select()
      }
    }, 300)
  }

  render () {
    const {
      item,
      onSubmit,
      loading,
      productBookmark,
      onChange,
      onChoose,
      onChooseBundle,
      productBookmarkGroup,
      form: { getFieldDecorator, validateFields, getFieldsValue, resetFields },
      ...modalProps
    } = this.props

    const { filter, list, pagination } = productBookmark

    const handleChangePagination = (page) => {
      onChange(filter.groupId, page)
    }

    const handleOk = () => {
      validateFields((errors) => {
        if (errors) return
        const record = {
          ...getFieldsValue()
        }
        Modal.confirm({
          title: `Applying ${record.shortcutCode}`,
          content: 'Are you sure ?',
          onOk () {
            onSubmit(record)
          }
        })
        resetFields()
      })
    }
    const hdlClickKeyDown = (e) => {
      if (e.keyCode === 13) {
        handleOk()
      }
    }
    const modalOpts = {
      ...modalProps,
      onOk: handleOk
    }
    return (
      <Modal {...modalOpts}
        footer={null}
      >
        <Form>
          <FormItem label="Shortcut Code" help="input 3 nomor shortcut yang tersedia" {...formItemLayout}>
            {getFieldDecorator('shortcutCode', {
              rules: [
                {
                  required: true,
                  message: 'Required',
                  pattern: /^[A-Z0-9]+$/i
                }
              ]
            })(<Input maxLength={10} placeholder="Shortcut Code" onKeyDown={e => hdlClickKeyDown(e)} />)}
          </FormItem>
          <Pagination pageSize={14} onChange={handleChangePagination} {...pagination} showQuickJumper={false} showSizeChanger={false} />
          <div className={styles.container}>
            {loading ? (
              <Spin className={styles.spin} />
            )
              : list && list.length > 0 ?
                list.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className={styles.child}
                      onClick={() => {
                        if (item.type === 'PRODUCT') {
                          onChoose(item.product)
                        }
                        if (item.type === 'BUNDLE') {
                          onChooseBundle(item.bundle)
                        }
                      }}
                    >
                      <div>
                        <ImageBookmark item={item} />
                        <h4 height="36px">{item && item.product ? item.product.productName : item.bundle.name}</h4>
                      </div>
                    </div>
                  )
                }) : (
                  <EmptyBookmark id={item.id} />
                )}
          </div>
        </Form>
      </Modal>
    )
  }
}

ModalBookmark.propTypes = {
  form: PropTypes.object.isRequired,
  location: PropTypes.object,
  onOk: PropTypes.func,
  invoiceCancel: PropTypes.object
}

export default Form.create()(ModalBookmark)

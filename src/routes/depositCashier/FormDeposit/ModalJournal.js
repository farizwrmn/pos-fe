/* eslint-disable react/no-did-mount-set-state */
import React from 'react'
import moment from 'moment'
import { Modal, Select, Form, DatePicker, Input, Row, Button } from 'antd'
import ModalJournalDetail from './utils/ModalJournalDetail'
import ListJournal from './utils/ListJournal'

const FormItem = Form.Item
const Option = Select.Option

const formItemProps = {
  labelCol: {
    xs: 8,
    sm: 8,
    md: 6,
    lg: 6,
    xl: 4
  },
  wrapperCol: {
    xs: 13,
    sm: 13,
    md: 17,
    lg: 17,
    xl: 19
  }
}

class ModalResolve extends React.Component {
  state = {
    visibleModalDetail: false,
    listDetailJournal: [],

    selectedDetail: undefined
  }

  componentDidMount () {
    const { selectedJournal } = this.props
    if (selectedJournal) {
      this.setState({
        listDetailJournal: selectedJournal.detail
      })
    }
  }

  render () {
    const {
      journalType,
      selectedBalanceResolve,
      selectedJournal,
      listAccountCodeLov,
      listResolveOption,
      onCancel,
      onEdit,
      onSubmit,
      form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue
      },
      ...modalProps
    } = this.props
    const {
      visibleModalDetail,
      listDetailJournal,
      selectedDetail
    } = this.state

    const listResolveOpt = listResolveOption.map(record => <Option key={record} value={record}>{record}</Option>)

    const handleSubmit = () => {
      validateFields((error) => {
        if (error) return error

        const debit = listDetailJournal.reduce((prev, curr) => { return prev + curr.amountIn }, 0)
        const credit = listDetailJournal.reduce((prev, curr) => { return prev + curr.amountOut }, 0)

        if (debit !== credit) {
          Modal.warning({
            title: 'Warning!',
            content: 'Journal is imbalance'
          })
          return
        }

        const data = {
          ...getFieldsValue()
        }

        if (!selectedJournal) {
          return onSubmit({
            ...data,
            journalType,
            balanceId: selectedBalanceResolve ? selectedBalanceResolve.balanceId : null,
            detail: listDetailJournal
          })
        }

        onEdit({
          ...data,
          journalType,
          balanceId: selectedJournal.balanceId,
          detail: listDetailJournal,
          id: selectedJournal.id
        })
      })
    }

    const handleAddButton = () => {
      if (visibleModalDetail) {
        this.setState({
          selectedDetail: undefined
        })
      }
      this.setState({
        visibleModalDetail: !visibleModalDetail
      })
    }

    const modalJournalDetailProps = {
      selectedDetail,
      listAccountCodeLov,
      visible: visibleModalDetail,
      onCancel: () => {
        handleAddButton()
      },
      onSubmit: (data) => {
        this.setState({
          listDetailJournal: [
            ...listDetailJournal,
            {
              id: listDetailJournal.length + 1,
              ...data
            }
          ]
        })
        handleAddButton()
      },
      onEdit: (data) => {
        const result = listDetailJournal.map((record) => {
          if (record.id === data.id) {
            return data
          }
          return record
        })

        this.setState({
          listDetailJournal: result
        })
        handleAddButton()
      }
    }

    const listJournalProps = {
      dataSource: listDetailJournal,
      onDelete: (data) => {
        const filteredListDetailJournal = listDetailJournal.filter(filtered => filtered.id !== data.id)
        const result = filteredListDetailJournal.map((record, index) => ({
          ...record,
          id: index + 1
        }))
        this.setState({
          listDetailJournal: result
        })
      },
      onEdit: (data) => {
        this.setState({
          selectedDetail: data
        })
        handleAddButton()
      }
    }

    const modalFooter = [
      <Button type="ghost" onClick={onCancel}>Cancel</Button>,
      <Button
        type="primary"
        icon="check"
        onClick={handleSubmit}
        disabled={listDetailJournal.length === 0}
      >
        Submit
      </Button>
    ]

    return (
      <Modal
        {...modalProps}
        closable={false}
        maskClosable={false}
        width="50%"
        style={{ minWidth: '500px' }}
        footer={modalFooter}
      >
        {visibleModalDetail && <ModalJournalDetail {...modalJournalDetailProps} />}
        <Form horizontal>
          <FormItem label="Transaction Date" {...formItemProps}>
            {getFieldDecorator('transDate', {
              initialValue: selectedJournal ? moment.utc(selectedJournal.transDate) : undefined,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <DatePicker
                style={{
                  width: '100%',
                  maxWidth: '250px'
                }}
                format="DD MMM YYYY"
              />
            )}
          </FormItem>
          {journalType === 'resolve' && (
            <FormItem label="Status Resolved" {...formItemProps}>
              {getFieldDecorator('statusResolved', {
                initialValue: selectedJournal ? selectedJournal.statusResolved : undefined,
                rules: [
                  {
                    required: true
                  }
                ]
              })(
                <Select
                  placeholder="Pilih Penyelesaian"
                  style={{
                    maxWidth: '250px'
                  }}
                >
                  {listResolveOpt}
                </Select>
              )}
            </FormItem>
          )}
          <FormItem label="Reference" {...formItemProps}>
            {getFieldDecorator('reference', {
              initialValue: selectedJournal ? selectedJournal.reference : undefined,
              rules: [
                {
                  required: true
                },
                {
                  max: 40
                }
              ]
            })(
              <Input
                placeholder="Input Reference"
              />
            )}
          </FormItem>
          <FormItem label="Description" {...formItemProps}>
            {getFieldDecorator('description', {
              initialValue: selectedJournal ? selectedJournal.description : undefined,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input
                placeholder="Input Description"
              />
            )}
          </FormItem>
          <Row type="flex" justify="end" style={{ margin: '0 10px 10px 0' }}>
            <Button type="primary" icon="plus" onClick={handleAddButton}>Add</Button>
          </Row>
          <Row>
            <ListJournal {...listJournalProps} />
          </Row>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ModalResolve)

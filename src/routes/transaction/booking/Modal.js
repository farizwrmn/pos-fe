import React from 'react'
import { Form, Modal, DatePicker, Select, Badge, Calendar, Tabs } from 'antd'
import moment from 'moment'
import { color } from 'utils'

const FormItem = Form.Item
const Option = Select.Option
const TabPane = Tabs.TabPane

const formItemLayout = {
  labelCol: {
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 8 },
    xl: { span: 8 },
  },
  wrapperCol: {
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 12 },
    xl: { span: 12 },
  },
}

const modal = ({
  ...modalProps,
  onSearch,
  form: {
    getFieldDecorator,
    resetFields,
    validateFields,
    getFieldsValue,
  },
}) => {
  const handleReset = () => {
    resetFields()
    resetItem()
    onListReset()
  }

  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      onSearch(data.status, data.period.format('YYYY-MM-DD'))
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  const onPanelChange = (value, mode) => {
    console.log(value, mode)
  }

  function getListData(value) {
    let listData;
    console.log('zz1', value)
    switch (value.format('YYYY-MM-DD')) {
      case '2018-01-13':
        listData= [{ content: ' 2' }]
    }
    return listData || [];
  }

  function dateCellRender(value) {
    const listData = getListData(value);
    return (
      <ul className="events">
        {
          listData.map(item => (
            <li key={item.content}>
              <span >●</span>
              {item.content}
            </li>
          ))
        }
      </ul>
    );
  }

  return (
    <Modal {...modalOpts}>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Filter" key="1">
          <FormItem label="Period" hasFeedback {...formItemLayout}>
            {getFieldDecorator('period', {
              initialValue: moment.utc(moment(), 'YYYY-MM-DD'),
              rules: [
                {
                  required: true,
                },
              ],
            })(
              <DatePicker placeholder="Select Period" />
            )}
          </FormItem>
          <FormItem label="Status" hasFeedback {...formItemLayout}>
            {getFieldDecorator('status', {
              initialValue: 'OP',
            })(<Select placeholder="Choose Status" defaultValue="OP" style={{ width: 120 }} >
              <Option value="OP"><Badge dot text="Open"
                                        style={{backgroundColor: color.purple,
                                          position: 'relative', display: 'inline-block',
                                          top: 0, transform: 'none'
                                        }}/>
              </Option>
              <Option value="CF"><Badge status="default" text="Confirmed" /></Option>
              <Option value="CI"><Badge status="processing" text="Check-In" /></Option>
              <Option value="CO"><Badge status="success" text="Check-Out" /></Option>
              <Option value="RS"><Badge dot text="Reschedule" style={{backgroundColor: color.peach,
                position: 'relative', display: 'inline-block',
                top: 0, transform: 'none'
              }} /></Option>
              <Option value="CC"><Badge status="warning" text="Cancel" /></Option>
              <Option value="RJ"><Badge status="error" text="Reject" /></Option>
            </Select>)}
          </FormItem>
        </TabPane>
        <TabPane tab="Browse" key="2">
          <div>
          <Calendar dateCellRender={dateCellRender}
                    onPanelChange={onPanelChange} />
          <span style={{float: 'right'}}>
            <span style={{paddingRight: '8px'}}><Badge dot
                   style={{backgroundColor: color.purple,
                     position: 'relative', display: 'inline-block',
                     top: '-1px', transform: 'none'
                   }}/></span>
            <Badge status="default"/>
            <Badge status="processing"/>
            <Badge status="success"/>
            <span style={{paddingRight: '8px'}}><Badge dot style={{backgroundColor: color.peach,
              position: 'relative', display: 'inline-block',
              top: '-1px', transform: 'none'
            }} /></span>
            <Badge status="warning"/>
            <Badge status="error"/>
            <br />
            <Badge dot text="Open"
                   style={{backgroundColor: color.purple,
                     position: 'relative', display: 'inline-block',
                     top: 0, transform: 'none'
                   }}/>
            <br />
            <Badge status="default" text="Confirmed" />
            <br />
            <Badge status="processing" text="Check-In" />
            <br />
            <Badge status="success" text="Check-Out" />
            <br />
            <Badge dot text="Reschedule" style={{backgroundColor: color.peach,
              position: 'relative', display: 'inline-block',
              top: 0, transform: 'none'
            }} />
            <br />
            <Badge status="warning" text="Cancel" />
            <br />
            <Badge status="error" text="Reject" />
          </span>
          </div>
        </TabPane>
      </Tabs>

    </Modal>
  )
}

export default Form.create()(modal)

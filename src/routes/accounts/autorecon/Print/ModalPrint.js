import { Button, Col, DatePicker, Form, Icon, LocaleProvider, Modal, Row, Select } from 'antd'
import enUS from 'antd/lib/locale-provider/en_US'
import moment from 'moment'
import PrintPDF from './PrintPDF'
import PrintXLS from './PrintXLS'

const FormItem = Form.Item

const ModalPrint = ({
  loading,
  formModalVisible,
  PDFModalProps,
  printProps,
  mode,
  list,
  getAllData,
  listAccountCode,
  changed,
  listPrintAll,
  location,
  handleFormModal,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue
  }
}) => {
  const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
  const accountOption = (listAccountCode || []).length > 0 ? listAccountCode.map(c => <Select.Option value={c.id} key={c.id} title={`${c.accountName} (${c.accountCode})`}>{`${c.accountName} (${c.accountCode})`}</Select.Option>) : []

  const handleSubmit = () => {
    validateFields((error) => {
      if (error) {
        return error
      }

      const fields = getFieldsValue()
      getAllData({
        accountId: fields.accountId,
        from: moment(fields.rangePicker[0]).format('YYYY-MM-DD'),
        to: moment(fields.rangePicker[1]).format('YYYY-MM-DD')
      })
      handleFormModal()
    })
  }

  const showGetAllDataModal = () => {
    const { query } = location
    const { accountId, from, to } = query
    if (accountId && from && to) {
      getAllData({
        accountId,
        from,
        to
      })
    } else {
      handleFormModal()
    }
  }

  let buttonClickPDF = (changed && listPrintAll.length) ? (<PrintPDF dataSource={listPrintAll} name="Print All Data" {...printProps} />) : (<Button type="default" disabled={loading.effects['autorecon/queryAll']} size="default" onClick={showGetAllDataModal} loading={loading.effects['autorecon/queryAll']}><Icon type="file-pdf" />Get All Data</Button>)
  let buttonClickXLS = (changed && listPrintAll.length) ? (<PrintXLS dataSource={listPrintAll} name="Print All Data" {...printProps} />) : (<Button type="default" disabled={loading.effects['autorecon/queryAll']} size="default" onClick={showGetAllDataModal} loading={loading.effects['autorecon/queryAll']}><Icon type="file-pdf" />Get All Data</Button>)
  let notification = (changed && listPrintAll.length) ? "Click 'Print All Data' to print!" : "Click 'Get All Data' to get all data!"


  let printMode
  if (mode === 'pdf') {
    printMode = (
      <Row>
        <Col md={8}>
          {buttonClickPDF}<p style={{ color: 'red', fontSize: 10 }}>{notification}</p>
        </Col>
        <Col md={8}>
          <PrintPDF dataSource={list} name="Print Current Page" {...printProps} />
        </Col>
      </Row>
    )
  } else {
    printMode = (<Row>
      <Col md={8}>
        {buttonClickXLS}<p style={{ color: 'red', fontSize: 10 }}>{notification}</p>
      </Col>
      <Col md={8}>
        <PrintXLS dataSource={list} name="Print Current Page" {...printProps} />
      </Col>
    </Row>)
  }

  return (
    <div>
      <Modal {...PDFModalProps}>
        {printMode}
      </Modal>
      <Modal
        visible={formModalVisible}
        onOk={handleSubmit}
        onCancel={handleFormModal}
        closable={false}
        maskClosable={false}
        okText="Get All Data"
      >
        <Form>
          <FormItem label="Account">
            {getFieldDecorator('accountId', {
              rules: [
                {
                  required: true,
                  message: '* Required'
                }
              ]
            })(
              <Select
                showSearch
                allowClear
                filterOption={filterOption}
                optionFilterProp="children"
                style={{ width: '100%' }}
                placeholder="Select Account"
              >
                {accountOption}
              </Select>
            )}
          </FormItem>
          <LocaleProvider locale={enUS}>
            <FormItem>
              {getFieldDecorator('rangePicker', {
                rules: [
                  {
                    required: true,
                    message: '* Required'
                  }
                ]
              })(
                <DatePicker.RangePicker
                  locale={enUS}
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
          </LocaleProvider>
        </Form>
      </Modal>
    </div>
  )
}

export default Form.create()(ModalPrint)

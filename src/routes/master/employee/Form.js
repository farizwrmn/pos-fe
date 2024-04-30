import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Button, Select, Row, Col, Modal, message, Card, DatePicker, Icon } from 'antd'
import moment from 'moment'
import FormItemFingerprint from 'components/Form/FormItemFingerprint'
import styles from './index.less'

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    xs: { span: 11 },
    sm: { span: 8 },
    md: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 13 },
    sm: { span: 14 },
    md: { span: 14 }
  }
}

// const column = {
// sm: { span: 24 },
// md: { span: 24 },
// lg: { span: 12 },
// xl: { span: 12 }
// }

class FormEmployee extends Component {
  render () {
    const {
      item,
      sequence,
      onSubmit,
      onCancel,
      disabled,
      button,
      modalType,
      showPosition,
      listLovJobPosition,
      registerFingerprint,
      listContractType,
      listDvision,
      listCity,
      listStoreLov,
      // listIdType,
      // showIdType,
      form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        // getFieldValue,
        resetFields
      }
    } = this.props

    const tailFormItemLayout = {
      wrapperCol: {
        span: 24,
        xs: {
          offset: modalType === 'edit' ? 10 : 19
        },
        sm: {
          offset: modalType === 'edit' ? 16 : 20
        },
        md: {
          offset: modalType === 'edit' ? 15 : 19
        },
        lg: {
          offset: modalType === 'edit' ? 13 : 18
        }
      }
    }

    const jobPosition = () => {
      showPosition()
    }

    const handleSubmit = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }
        const data = {
          ...getFieldsValue()
        }
        data.positionId = data.positionId ? data.positionId.key : null
        if (data.employeeId) {
          Modal.confirm({
            title: 'Do you want to save this item?',
            onOk () {
              data.idType = 'KTP'
              onSubmit(data.employeeId, data)
              resetFields()
            },
            onCancel () { }
          })
        } else {
          message.warning("Employee Id can't be null")
        }
      })
    }

    const handleCancel = () => {
      onCancel()
      resetFields()
    }

    // const listStatusEmployee = [
    //   {
    //     name: 'PKWT',
    //     id: 1
    //   },
    //   {
    //     name: 'PKWTT',
    //     id: 2
    //   },
    //   {
    //     name: 'Freelance',
    //     id: 3
    //   },
    //   {
    //     name: 'Part Time',
    //     id: 4
    //   }
    // ]

    const listReligion = [
      {
        label: 'Islam',
        value: 1
      },
      {
        label: 'Katolik',
        value: 2
      },
      {
        label: 'Kristen Protestan',
        value: 3
      },
      {
        label: 'Hindu',
        value: 4
      },
      {
        label: 'Budha',
        value: 5
      }
    ]

    const listBloodType = [
      {
        label: 'O',
        value: 'O'
      },
      {
        label: 'A',
        value: 'A'
      },
      {
        label: 'B',
        value: 'B'
      },
      {
        label: 'AB',
        value: 'AB'
      }
    ]

    const listMarriedStatus = [
      {
        label: 'Belum Kawin',
        value: 1
      },
      {
        label: 'Menikah',
        value: 2
      },
      {
        label: 'Duda/Janda',
        value: 3
      },
      {
        label: 'Cerai',
        value: 4
      },
      {
        label: 'Menikah Lagi',
        value: 5
      }
    ]
    const listGender = [
      {
        label: 'Laki-laki',
        value: 1
      },
      {
        label: 'Perempuan',
        value: 2
      }
    ]

    const genderOption = listGender.length > 0 ? listGender.map(option => <Option value={option.label} key={option.label}>{option.label}</Option>) : []
    const marriedStatusOption = listMarriedStatus.length > 0 ? listMarriedStatus.map(option => <Option value={option.label} key={option.label}>{option.label}</Option>) : []
    const bloodTypeOption = listBloodType.length > 0 ? listBloodType.map(option => <Option value={option.label} key={option.label}>{option.label}</Option>) : []
    const religionOption = listReligion.length > 0 ? listReligion.map(religion => <Option value={religion.label} key={religion.label}>{religion.label}</Option>) : []
    // const statusEmployee = listStatusEmployee.length > 0 ? listStatusEmployee.map(status => <Option value={status.id} key={status.id}>{status.name}</Option>) : []
    const statusEmployee = listContractType.length > 0 ? listContractType.map(c => <Option value={c.id} key={c.id}>{c.name}</Option>) : []
    const jobposition = listLovJobPosition.length > 0 ? listLovJobPosition.map(position => <Option value={position.value} key={position.value}>{position.label}</Option>) : []
    const divisionOption = listDvision.length > 0 ? listDvision.map(c => <Option value={c.id} key={c.id}>{c.name}</Option>) : []
    const stores = listStoreLov.length > 0 ? listStoreLov.map(c => <Option value={c.id} key={c.id}>{c.storeName}</Option>) : []
    const cities = listCity.length > 0 ? listCity.map(c => <Option value={c.id} key={c.id}>{c.cityName}</Option>) : []
    // const childrenLov = listIdType.length > 0 ? listIdType.map(lov => <Option value={lov.key} key={lov.key}>{lov.title}</Option>) : []

    const cardProps = {
      bordered: true,
      style: {
        padding: 8,
        marginLeft: 8,
        marginBottom: 8
      }
    }

    const disabledDate = (current) => {
      return current > moment(new Date())
    }

    return (
      <Form layout="horizontal">
        <Row>
          <Col md={24} lg={12}>
            <Card title={<h3>Data Umum</h3>} {...cardProps}>
              <FormItem label="Nomor Induk Karyawan" hasFeedback {...formItemLayout}>
                {getFieldDecorator('employeeId', {
                  initialValue: item.employeeId || sequence,
                  rules: [
                    {
                      required: true,
                      pattern: /^[a-zA-Z0-9_]{6,15}$/i,
                      message: 'a-z & 0-9, min: 6 characters'
                    }
                  ]
                })(<Input disabled={disabled} maxLength={15} placeholder="Masukkan Nomor Induk Karyawan" />)}
              </FormItem>
              <FormItem label="Nama Karyawan" hasFeedback {...formItemLayout}>
                {getFieldDecorator('employeeName', {
                  initialValue: item.employeeName,
                  rules: [
                    {
                      required: true,
                      pattern: /^[a-zA-Z_ ]+$/,
                      message: 'Input tidak valid. Nama karyawan hanya boleh mengandung huruf dan spasi'
                    }
                  ]
                })(<Input autoFocus placeholder="Masukkan Nama Karyawan" />)}
              </FormItem>
              <FormItem label="Jumlah Tanggungan" hasFeedback {...formItemLayout}>
                {getFieldDecorator('numberOfDependents', {
                  initialValue: item.numberOfDependents,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<InputNumber min={0} autoFocus placeholder="Masukkan Jumlah Tanggungan" />)}
              </FormItem>
              <FormItem label="Alamat Domisili" hasFeedback {...formItemLayout}>
                {getFieldDecorator('residenceAddress', {
                  initialValue: item.residenceAddress,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Input placeholder="Masukkan Alamat Domisili" />)}
              </FormItem>
            </Card>
            <Card title={<h3>Kontak</h3>} {...cardProps}>
              <FormItem label="Nomor Telepon Rumah" {...formItemLayout}>
                {getFieldDecorator('telpNumber', {
                  initialValue: item.telpNumber
                })(<Input placeholder="Masukkan Nomor Telepon" />)}
              </FormItem>
              <FormItem label="Nomor Handphone" {...formItemLayout}>
                {getFieldDecorator('phoneNumber', {
                  initialValue: item.phoneNumber,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Input placeholder="Masukkan Nomor Handphone" />)}
              </FormItem>
              <FormItem label="Email Kerja" {...formItemLayout}>
                {getFieldDecorator('email', {
                  initialValue: item.email
                })(<Input placeholder="Masukkan Email Kerja" />)}
              </FormItem>
              <FormItem label="Email Pribadi" {...formItemLayout}>
                {getFieldDecorator('emailPrivate', {
                  initialValue: item.emailPrivate
                })(<Input placeholder="Masukkan Email Pribadi" />)}
              </FormItem>
            </Card>
            <Card title={<h3>Data KTP</h3>} {...cardProps}>
              {/* <FormItem label="ID Type" hasFeedback {...formItemLayout}>
                {getFieldDecorator('idType', {
                  initialValue: item.idType,
                  rules: [
                    {
                      required: !!getFieldValue('idNo')
                    }
                  ]
                })(<Select
                  allowClear
                  optionFilterProp="children"
                  mode="default"
                  onFocus={showIdType}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >{childrenLov}
                </Select>)}
              </FormItem> */}
              <FormItem label="Nomor KTP" hasFeedback {...formItemLayout}>
                {getFieldDecorator('idNo', {
                  initialValue: item.idNo,
                  rules: [
                    {
                      required: true,
                      pattern: /^[A-Za-z0-9-_. ]{3,30}$/i,
                      message: 'a-Z & 0-9'
                    }
                  ]
                })(<Input placeholder="Masukkan Nomor KTP" maxLength={30} />)}
              </FormItem>
              <FormItem label="Jenis Kelamin" hasFeedback {...formItemLayout}>
                {getFieldDecorator('gender', {
                  initialValue: item.gender,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Select
                  placeholder="Pilih Jenis Kelamin"
                  optionFilterProp="children"
                  showSearch
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >{genderOption}
                </Select>)}
              </FormItem>
              <FormItem label="Agama" hasFeedback {...formItemLayout}>
                {getFieldDecorator('religion', {
                  initialValue: item.religion,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Select
                  placeholder="Pilih Agama"
                  optionFilterProp="children"
                  showSearch
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >{religionOption}
                </Select>)}
              </FormItem>
              <FormItem label="Golongan Darah" hasFeedback {...formItemLayout}>
                {getFieldDecorator('bloodType', {
                  initialValue: item.bloodType,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Select
                  placeholder="Pilih Golongan Darah"
                  optionFilterProp="children"
                  showSearch
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >{bloodTypeOption}
                </Select>)}
              </FormItem>
              <FormItem label="Status Perkawinan" hasFeedback {...formItemLayout}>
                {getFieldDecorator('marriedStatus', {
                  initialValue: item.marriedStatus,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Select
                  placeholder="Pilih Status Perkawinan"
                  optionFilterProp="children"
                  showSearch
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >{marriedStatusOption}
                </Select>)}
              </FormItem>
              <FormItem label="Tempat Lahir" hasFeedback {...formItemLayout}>
                {getFieldDecorator('cityId', {
                  initialValue: item.cityId,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Select
                  placeholder="Pilih Kota"
                  optionFilterProp="children"
                  showSearch
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >{cities}
                </Select>)}
              </FormItem>
              <FormItem label="Tanggal Lahir" hasFeedback {...formItemLayout}>
                {getFieldDecorator('birthDate', {
                  initialValue: item.birthDate ? moment(item.birthDate) : null,
                  rules: [{ required: true }]
                })(<DatePicker disabledDate={disabledDate} placeholder="Masukkan Tanggal Lahir" />)}
              </FormItem>
              <FormItem label="Alamat KTP" hasFeedback {...formItemLayout}>
                {getFieldDecorator('address01', {
                  initialValue: item.address01,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Input placeholder="Masukkan Alamat KTP" />)}
              </FormItem>
            </Card>

          </Col>
          <Col md={24} lg={12}>
            <Card title={<h3>Data Bank</h3>} {...cardProps}>
              <FormItem label="Nama Bank" hasFeedback {...formItemLayout}>
                {getFieldDecorator('bankName', {
                  initialValue: item.bankName,
                  rules: [
                    {
                      required: true,
                      pattern: /^[a-zA-Z_]{2,30}$/i,
                      message: 'a-z, min: 2 characters'
                    }
                  ]
                })(<Input maxLength={30} placeholder="Masukkan Nama Bank" />)}
              </FormItem>
              <FormItem label="Nomor Rekening" hasFeedback {...formItemLayout}>
                {getFieldDecorator('accountNo', {
                  initialValue: item.accountNo,
                  rules: [
                    {
                      required: true,
                      pattern: /^[0-9_]{2,30}$/i,
                      message: '0-9, min: 2 characters'
                    }
                  ]
                })(<Input maxLength={30} placeholder="Masukkan Nomor Rekening" />)}
              </FormItem>
              <FormItem label="Nama Pemilik Rekening" hasFeedback {...formItemLayout}>
                {getFieldDecorator('accountName', {
                  initialValue: item.accountName,
                  rules: [
                    {
                      required: true,
                      pattern: /^[a-zA-Z\s_]{2,30}$/i,
                      message: 'a-z, min: 2 characters'
                    }
                  ]
                })(<Input maxLength={30} placeholder="Masukkan Nama Pemilik Rekening" />)}
              </FormItem>
            </Card>
            <Card
              title={(
                <div className={styles.row}>
                  <h3>Absensi dan Fingerprint</h3>
                  {item && item.fingerprintFile && item.fingerprintFile.raw && (
                    <div>
                      <Icon
                        type="check-circle"
                        className={styles.check}
                      />
                      <span className={styles.checkText}>
                        already setup
                      </span>
                    </div>
                  )}
                </div>
              )}
              {...cardProps}
            >
              <FormItem label="Nomor Handphone" hasFeedback {...formItemLayout}>
                {getFieldDecorator('mobileNumber', {
                  initialValue: item.mobileNumber,
                  rules: [
                    {
                      required: true,
                      pattern: /^\(?(0[0-9]{3})\)?[-. ]?([0-9]{2,4})[-. ]?([0-9]{4,5})$/,
                      message: 'mobile number is not valid'
                    }
                  ]
                })(<Input placeholder="Masukkan Nomor Handphone" />)}
              </FormItem>
              <FormItem label="Lokasi Store / Office" hasFeedback {...formItemLayout}>
                {getFieldDecorator('defaultStore', {
                  initialValue: item.defaultStore,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Select
                  placeholder="Masukkan Lokasi"
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >{stores}
                </Select>)}
              </FormItem>
              {modalType === 'edit' && <FormItemFingerprint
                getFieldDecorator={getFieldDecorator}
                formItemLayout={formItemLayout}
                registerFingerprint={registerFingerprint}
                item={item}
              />}
            </Card>
            <Card title={(<h3>Data Pekerjaan</h3>)} {...cardProps}>
              <FormItem label="Tanggal Bergabung" hasFeedback {...formItemLayout}>
                {getFieldDecorator('joinDate', {
                  initialValue: item.joinDate ? moment(item.joinDate) : null,
                  rules: [{ required: true }]
                })(<DatePicker placeholder="Pilih Tanggal Bergabung" />)}
              </FormItem>
              <FormItem label="Tanggal Resign" hasFeedback {...formItemLayout}>
                {getFieldDecorator('resignDate', {
                  initialValue: item.resignDate ? moment(item.resignDate) : null
                })(<DatePicker placeholder="Pilih Tanggal Resign" />)}
              </FormItem>
              <FormItem label="Divisi" hasFeedback {...formItemLayout}>
                {getFieldDecorator('divisionId', {
                  initialValue: item.divisionId,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Select
                  optionFilterProp="children"
                  // onFocus={() => jobPosition()}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  placeholder="Pilih Divisi"
                  showSearch
                  allowClear
                >{divisionOption}
                </Select>)}
              </FormItem>
              <FormItem label="Posisi" hasFeedback {...formItemLayout}>
                {getFieldDecorator('positionId', {
                  initialValue: item.positionId ? { key: item.positionId } : {},
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Select
                  optionFilterProp="children"
                  onFocus={() => jobPosition()}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  placeholder="Pilih Posisi"
                  showSearch
                  allowClear
                  labelInValue
                >{jobposition}
                </Select>)}
              </FormItem>
              <FormItem label="Status Karyawan" hasFeedback {...formItemLayout}>
                {getFieldDecorator('statusEmployee', {
                  initialValue: item.statusEmployee,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Select
                  optionFilterProp="children"
                  onFocus={() => jobPosition()}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  placeholder="Pilih Status Karyawan"
                  showSearch
                  allowClear
                >{statusEmployee}
                </Select>)}
              </FormItem>
            </Card>
            <Card title={<h3>Data NPWP</h3>} {...cardProps}>
              <FormItem label="Nomor NPWP" hasFeedback {...formItemLayout}>
                {getFieldDecorator('noNPWP', {
                  initialValue: item.noNPWP,
                  rules: [
                    {
                      required: false,
                      pattern: /^\d{15,16}$/,
                      message: 'Input tidak valid. no NPWP is 15-16 digits'
                    }
                  ]
                })(<Input autoFocus placeholder="Masukkan Nomor NPWP" />)}
              </FormItem>
            </Card>
            <Card title={<h3>DATA BPJS & BPJSTK</h3>} {...cardProps}>
              <FormItem label="Nomor BPJS" hasFeedback {...formItemLayout}>
                {getFieldDecorator('noBPJS', {
                  initialValue: item.noBPJS,
                  rules: [
                    {
                      required: false,
                      pattern: /^\d{11,14}$/,
                      message: 'Input tidak valid. no NPWP is 11-14 digits'
                    }
                  ]
                })(<Input autoFocus placeholder="Masukkan Nomor BPJS" />)}
              </FormItem>
              <FormItem label="Nomor BPJSTK" hasFeedback {...formItemLayout}>
                {getFieldDecorator('noBPJSTK', {
                  initialValue: item.noBPJSTK,
                  rules: [
                    {
                      required: false,
                      pattern: /^\d{11,13}$/,
                      message: 'Input tidak valid. no NPWP is 11-13 digits'
                    }
                  ]
                })(<Input autoFocus placeholder="Masukkan Nomor BPJSTK" />)}
              </FormItem>
            </Card>
          </Col>
        </Row>
        <FormItem {...tailFormItemLayout}>
          {modalType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
          <Button style={{ width: '200px' }} type="primary" onClick={handleSubmit}>{button}</Button>
        </FormItem>
      </Form>
    )
  }
}

FormEmployee.propTypes = {
  form: PropTypes.object.isRequired,
  listLovJobPosition: PropTypes.object,
  listCity: PropTypes.object,
  showPosition: PropTypes.func,
  disabled: PropTypes.bool,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default Form.create()(FormEmployee)

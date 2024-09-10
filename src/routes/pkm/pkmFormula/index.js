/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { lstorage } from 'utils'
import * as Excel from 'exceljs/dist/exceljs.min.js'
import { Button, Icon, Form, Input, Row, Col, message } from 'antd'
import List from './List'
import PrintXLS from './PrintXLS'
import ModalEditPkm from './ModalEditPkm'

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

const FormItem = Form.Item

const Counter = ({
  pkmFormula,
  productstock,
  productbrand,
  productcategory,
  loading,
  dispatch,
  location,
  form: {
    getFieldDecorator
  },
  app
}) => {
  const { list, tmpListProduct, pagination, modalEditPkmItem, modalEditPkmVisible } = pkmFormula
  const { user, storeInfo } = app
  const { listBrand } = productbrand
  const { listCategory } = productcategory
  const { changed, listPrintAllStock, stockLoading } = productstock

  const listProps = {
    dataSource: list,
    tmpListProduct,
    user,
    storeInfo,
    pagination,
    loading: loading.effects['pkmFormula/query'] || loading.effects['pkmFormula/addImport'],
    location,
    onChange (page) {
      dispatch({
        type: 'pkmFormula/updateState',
        payload: {
          pagination: {
            page: page.current,
            pageSize: page.pageSize
          }
        }
      })
    },
    onOpenModalPkm (record) {
      dispatch({
        type: 'pkmFormula/updateState',
        payload: {
          modalEditPkmVisible: true,
          modalEditPkmItem: record
        }
      })
    }
  }

  const printProps = {
    user,
    storeInfo,
    listBrand,
    listCategory
  }

  const getAllStock = () => {
    dispatch({
      type: 'productstock/queryAllStock',
      payload: {
        type: 'all'
      }
    })
  }

  let buttonClickXLS = (changed && listPrintAllStock.length)
    ? (<PrintXLS data={listPrintAllStock} name="Export Template Stock" {...printProps} />)
    : (<Button type="default" disabled={stockLoading} size="large" onClick={getAllStock} loading={stockLoading}><Icon type="file-pdf" />Get Template Stock</Button>)


  const uploadProps = {
    name: 'file',
    processData: false
  }

  const handleChangeFile = (event) => {
    let uploadData = []
    const fileName = event.target.files[0]
    const workbook = new Excel.Workbook()
    const reader = new FileReader()
    reader.readAsArrayBuffer(fileName)
    reader.onload = () => {
      const buffer = reader.result
      workbook.xlsx.load(buffer)
        .then(async (workbook) => {
          const sheet = workbook.getWorksheet('POS 1')
          await sheet
            .eachRow({ includeEmpty: false }, (row, rowIndex) => {
              const productId = row.values[2]
              const minor = row.values[5]
              const mpkm = row.values[6]
              const pkm = row.values[7]
              const nPlus = row.values[8]
              const nCross = row.values[9]
              if (rowIndex >= 6
                && typeof productId !== 'undefined'
                && typeof minor !== 'undefined'
                && typeof mpkm !== 'undefined'
                && typeof pkm !== 'undefined'
                && typeof nPlus !== 'undefined'
                && typeof nCross !== 'undefined'
              ) {
                const data = {
                  storeId: lstorage.getCurrentUserStore(),
                  productId: Number(productId),
                  minor,
                  mpkm,
                  pkm,
                  nPlus,
                  nCross
                }
                uploadData.push(data)
              }
            })
        })
        .then(() => {
          if (uploadData && uploadData.length > 0) {
            dispatch({
              type: 'pkmFormula/addImport',
              payload: {
                storeId: lstorage.getCurrentUserStore(),
                detail: uploadData
              }
            })
          } else {
            message.error('No Data to Upload')
          }
        })
    }
  }

  const modalEditPkmProps = {
    visible: modalEditPkmVisible,
    item: modalEditPkmItem,
    onOk (item) {
      dispatch({
        type: 'pkmFormula/edit',
        payload: {
          data: {
            ...modalEditPkmItem,
            pkm: item.pkm || 0
          }
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'pkmFormula/updateState',
        payload: {
          modalEditPkmItem: {},
          modalEditPkmVisible: false
        }
      })
    }
  }

  const onSearchProduct = (searchText) => {
    dispatch({
      type: 'pkmFormula/searchProduct',
      payload: {
        searchText
      }
    })
  }

  return (
    <div className="content-inner">
      {modalEditPkmVisible && <ModalEditPkm {...modalEditPkmProps} />}
      {'Stock: '}
      {buttonClickXLS}
      <span>
        <label htmlFor="opname" className="ant-btn ant-btn-primary ant-btn-lg" style={{ marginLeft: '15px', padding: '0.5em' }}>Select File</label>
        <input
          id="opname"
          type="file"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          className="ant-btn ant-btn-default ant-btn-lg"
          style={{ visibility: 'hidden' }}
          {...uploadProps}
          onClick={(event) => {
            event.target.value = null
          }}
          onInput={(event) => {
            handleChangeFile(event)
          }}
        />
      </span>
      <Row>
        <Col span={16} />
        <Col span={8}>
          <FormItem label="Search" {...formItemLayout}>
            {getFieldDecorator('searchText')(<Input
              maxLength={200}
              onKeyDown={
                (e) => {
                  if (e.keyCode === 13) {
                    onSearchProduct(e.target.value)
                  }
                }
              }
            />)}
          </FormItem>
        </Col>
      </Row>
      <List {...listProps} />
    </div>
  )
}

Counter.propTypes = {
  pkmFormula: PropTypes.object,
  productstock: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ pkmFormula, productstock, productbrand, productcategory, loading, app }) => ({ pkmFormula, productstock, productbrand, productcategory, loading, app }))(Form.create()(Counter))

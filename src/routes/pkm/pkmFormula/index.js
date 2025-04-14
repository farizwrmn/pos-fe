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
import ModalEditMinor from './ModalEditMinor'
import ModalEditPkm from './ModalEditPkm'
import PrintXLSDownloadData from './PrintXLSDownloadData'
import ModalEditMpkm from './ModalEditMpkm'
import ModalEditTag from './ModalEditTag'

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

const FormItem = Form.Item

const Counter = ({
  pkmFormula,
  productTag,
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
  const {
    list,
    tmpListProduct,
    pagination,
    modalEditMinorVisible,
    modalEditPkmItem,
    modalEditMpkmVisible,
    modalEditPkmVisible,
    modalEditTagVisible,
    modalEditTagItem
  } = pkmFormula
  const {
    list: listTag
  } = productTag
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
    },
    onOpenModalMPKM (record) {
      dispatch({
        type: 'pkmFormula/updateState',
        payload: {
          modalEditMpkmVisible: true,
          modalEditPkmItem: record
        }
      })
    },
    onOpenModalTag (record) {
      dispatch({
        type: 'pkmFormula/updateState',
        payload: {
          modalEditTagVisible: true,
          modalEditTagItem: record
        }
      })
    },
    onOpenModalMinor (record) {
      dispatch({
        type: 'pkmFormula/updateState',
        payload: {
          modalEditMinorVisible: true,
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
              const nPlusExpiredDate = row.values[9]
              const nCross = row.values[10]
              const nCrossExpiredDate = row.values[11]
              const deleted = row.values[12]
              if (rowIndex >= 6
                && typeof productId !== 'undefined'
                && typeof minor !== 'undefined'
                && typeof mpkm !== 'undefined'
                && typeof pkm !== 'undefined'
                && typeof nPlus !== 'undefined'
                && typeof nCross !== 'undefined'
                && deleted !== 'X'
              ) {
                const data = {
                  storeId: lstorage.getCurrentUserStore(),
                  productId: Number(productId),
                  minor,
                  mpkm,
                  pkm,
                  nPlus,
                  nPlusExpiredDate,
                  nCross,
                  nCrossExpiredDate,
                  deleted
                }
                uploadData.push(data)
              } else if (rowIndex >= 6
                && deleted === 'X'
              ) {
                const data = {
                  storeId: lstorage.getCurrentUserStore(),
                  productId: Number(productId),
                  deleted
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

  const modalEditMinorProps = {
    visible: modalEditMinorVisible,
    item: modalEditPkmItem,
    onOk (item) {
      dispatch({
        type: 'pkmFormula/edit',
        payload: {
          data: {
            ...modalEditPkmItem,
            pkm: item.pkm || 0,
            mpkm: item.mpkm || 0,
            minor: item.minor || 0
          }
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'pkmFormula/updateState',
        payload: {
          modalEditPkmItem: {},
          modalEditMinorVisible: false
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

  let defaultRole = (lstorage.getStorageKey('udi')[2] || '')

  const modalEditMpkmProps = {
    visible: modalEditMpkmVisible,
    item: modalEditPkmItem,
    onOk (item) {
      dispatch({
        type: 'pkmFormula/edit',
        payload: {
          data: {
            ...modalEditPkmItem,
            mpkm: item.mpkm || 0,
            nPlus: item.nPlus || 0,
            nPlusExpiredDate: item.nPlusExpiredDate || null,
            nCross: item.nCross || 0,
            nCrossExpiredDate: item.nCrossExpiredDate || null,
          }
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'pkmFormula/updateState',
        payload: {
          modalEditPkmItem: {},
          modalEditMpkmVisible: false
        }
      })
    }
  }

  const modalEditTagProps = {
    visible: modalEditTagVisible,
    item: modalEditTagItem,
    listTag,
    onOk (item) {
      dispatch({
        type: 'pkmFormula/editTag',
        payload: {
          data: {
            productTag: item.productTag
          }
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'pkmFormula/updateState',
        payload: {
          modalEditTagItem: {},
          modalEditTagVisible: false
        }
      })
    }
  }

  return (
    <div className="content-inner">
      {modalEditMinorVisible && <ModalEditMinor {...modalEditMinorProps} />}
      {modalEditPkmVisible && <ModalEditPkm {...modalEditPkmProps} />}
      {modalEditMpkmVisible && <ModalEditMpkm {...modalEditMpkmProps} />}
      {modalEditTagVisible && <ModalEditTag {...modalEditTagProps} />}
      {(defaultRole === 'HPC'
        || defaultRole === 'SPC'
        || defaultRole === 'PCS'
        || defaultRole === 'ITS'
        || defaultRole === 'OWN') && <div>
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
        </div>}

      <Row>
        <Col span={16}>
          {list && list.length > 0 ? <PrintXLSDownloadData listAutoReplenish={list} /> : null}
        </Col>
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
  productTag: PropTypes.object,
  pkmFormula: PropTypes.object,
  productstock: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ productTag, pkmFormula, productstock, productbrand, productcategory, loading, app }) => ({ productTag, pkmFormula, productstock, productbrand, productcategory, loading, app }))(Form.create()(Counter))

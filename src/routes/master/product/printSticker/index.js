import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Tabs, Modal } from 'antd'
import Sticker from './Sticker'
import Shelf from './Shelf'
import PrintShelf from './PrintShelf'
import PrintSticker from './PrintSticker'

const TabPane = Tabs.TabPane

const ProductStock = ({ productstock, dispatch, location, app }) => {
  const { listItem, update, showPDFModal, mode, activeKey,
    showModalProduct, modalProductType, period, listSticker,
    selectedSticker } = productstock
  const { user, storeInfo } = app
  const changeTab = (key) => {
    dispatch({
      type: 'productstock/updateState',
      payload: {
        activeKey: key,
        modalType: 'add',
        currentItem: {},
        disable: '',
        listSticker: []
      }
    })
    const { pathname } = location

    dispatch(routerRedux.push({
      pathname,
      query: {
        activeKey: key
      }
    }))
  }

  const PDFModalProps = {
    visible: showPDFModal,
    title: mode === 'pdf' ? 'Choose PDF' : 'Choose Excel',
    width: 375,
    onCancel () {
      dispatch({
        type: 'productstock/updateState',
        payload: {
          showPDFModal: false,
          changed: false,
          listPrintAllStock: []
        }
      })
    }
  }

  const printProps = {
    user,
    storeInfo
  }

  let printmode

  let moreButtonTab
  switch (activeKey) {
    case '0':
      moreButtonTab = (<PrintSticker stickers={listSticker} {...printProps} />)
      break
    case '1':
      moreButtonTab = (<PrintShelf stickers={listSticker} {...printProps} />)
      break
    default:
      break
  }

  const stickerProps = {
    showModalProduct,
    listItem,
    update,
    period,
    listSticker,
    modalProductType,
    selectedSticker,
    onShowModalProduct (key) {
      dispatch({
        type: 'productstock/updateState',
        payload: {
          showModalProduct: true,
          modalProductType: key,
          selectedSticker: {}
        }
      })
    },
    onSelectSticker (sticker) {
      dispatch({
        type: 'productstock/updateState',
        payload: {
          selectedSticker: sticker
        }
      })
    },
    onCloseModalProduct () {
      dispatch({
        type: 'productstock/updateState',
        payload: {
          update: false,
          showModalProduct: false,
          modalProductType: '',
          listItem: [],
          period: []
        }
      })
    },
    onAutoSearch (value) {
      if (value.length < 1) {
        dispatch({
          type: 'productstock/updateState',
          payload: {
            listItem: []
          }
        })
      } else if (value.length > 0) {
        dispatch({
          type: 'productstock/queryItem',
          payload: {
            q: value
          }
        })
      }
    },
    pushSticker (stickers) {
      dispatch({
        type: 'productstock/updateState',
        payload: {
          listSticker: stickers
        }
      })
    },
    onSearchUpdateSticker (value) {
      if (value.updatedAt.length !== 0) {
        dispatch({
          type: 'productstock/queryItem',
          payload: {
            ...value
          }
        })
      } else {
        dispatch({
          type: 'productstock/updateState',
          payload: {
            listItem: []
          }
        })
      }
      dispatch({
        type: 'productstock/updateState',
        payload: {
          period: value.updatedAt
        }
      })
    }
  }

  return (
    <div className="content-inner" >
      {showPDFModal && <Modal footer={[]} {...PDFModalProps}>
        {printmode}
      </Modal>}
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} tabBarExtraContent={moreButtonTab} type="card">
        <TabPane tab="Sticker" key="0" >
          <Sticker {...stickerProps} />
        </TabPane>
        <TabPane tab="Shelf" key="1" >
          <Shelf {...stickerProps} />
        </TabPane>
      </Tabs>
    </div >
  )
}

ProductStock.propTypes = {
  productstock: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ productstock, loading, app }) => ({ productstock, loading, app }))(ProductStock)

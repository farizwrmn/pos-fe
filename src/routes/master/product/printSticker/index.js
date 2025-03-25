/* eslint-disable no-return-assign */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Tabs } from 'antd'
import { onPrintZebra } from './utils'
import Sticker from './Sticker'
import Shelf from './Shelf'
import PrintShelf from './PrintShelf'
import PrintSticker from './PrintSticker'
import PrintAvancedShelf from './PrintAvancedShelf'
import PrintLongShelf from './PrintLongShelf'

const TabPane = Tabs.TabPane

class ProductStock extends Component {
  render () {
    const { productstock, dispatch, loading, location, app } = this.props
    const { listItem, update, activeKey,
      showModalProduct, modalProductType, period, listSticker,
      aliases,
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

    const printProps = {
      aliases,
      user,
      storeInfo
    }

    let moreButtonTab
    switch (activeKey) {
      case '0':
        moreButtonTab = (
          <span>
            <Button style={{ marginRight: '10px' }} onClick={() => onPrintZebra(listSticker)}>Zebra ZD203</Button>
            <PrintSticker stickers={listSticker} user={user} {...printProps} />
          </span>
        )
        break
      case '1': {
        moreButtonTab = (
          <span>
            <PrintShelf setClick={click => this.clickChildShelf = click} stickers={listSticker} user={user} {...printProps} />
            <PrintAvancedShelf setClick={click => this.clickChild = click} stickers={listSticker} user={user} {...printProps} />
            <PrintLongShelf setClick={click => this.clickLongChild = click} stickers={listSticker} user={user} {...printProps} />
          </span>
        )
        break
      }
      default:
        break
    }

    const stickerProps = (parentProps) => {
      return ({
        clickChild: parentProps.clickChild,
        clickChildShelf: parentProps.clickChildShelf,
        clickLongChild: parentProps.clickLongChild,
        loading,
        dispatch,
        aliases,
        showModalProduct,
        listItem,
        update,
        period,
        listSticker,
        modalProductType,
        selectedSticker,
        onGetPromoList () {
          dispatch({
            type: 'productstock/printStickerActive',
            payload: {
              resetChild: parentProps ? parentProps.clickChild : undefined,
              resetChildShelf: parentProps ? parentProps.clickChildShelf : undefined,
              resetChildLong: parentProps ? parentProps.clickLongChild : undefined
            }
          })
        },
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
              update: true,
              selectedSticker: sticker
            }
          })
        },
        onSearchBarcodeConsignment (payload) {
          dispatch({
            type: 'productstock/queryConsignmentBarcodeForPriceTag',
            payload: {
              ...payload,
              resetChild: parentProps ? parentProps.clickChild : undefined,
              resetChildShelf: parentProps ? parentProps.clickChildShelf : undefined,
              resetChildLong: parentProps ? parentProps.clickLongChild : undefined
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
        addSticker (sticker) {
          dispatch({
            type: 'productstock/addSticker',
            payload: {
              sticker,
              resetChild: parentProps.clickChild,
              resetChildShelf: parentProps.clickChildShelf,
              resetChildLong: parentProps.clickLongChild
            }
          })
        },
        deleteSticker (sticker) {
          dispatch({
            type: 'productstock/deleteSticker',
            payload: {
              sticker,
              resetChild: parentProps.clickChild,
              resetChildShelf: parentProps.clickChildShelf,
              resetChildLong: parentProps.clickLongChild
            }
          })
        },
        updateSticker (selectedRecord, changedRecord) {
          dispatch({
            type: 'productstock/updateSticker',
            payload: {
              selectedRecord,
              changedRecord,
              resetChild: parentProps.clickChild,
              resetChildShelf: parentProps.clickChildShelf,
              resetChildLong: parentProps.clickLongChild
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
      })
    }

    return (
      <div className="content-inner" >
        <Tabs activeKey={activeKey} onChange={key => changeTab(key)} tabBarExtraContent={moreButtonTab} type="card">
          <TabPane tab="Sticker" key="0" >
            {activeKey === '0' && <Sticker {...stickerProps(this)} />}
          </TabPane>
          <TabPane tab="Shelf" key="1" >
            {activeKey === '1' && <Shelf {...stickerProps(this)} />}
          </TabPane>
        </Tabs>
      </div >
    )
  }
}

ProductStock.propTypes = {
  productstock: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ productstock, loading, app }) => ({ productstock, loading, app }))(ProductStock)

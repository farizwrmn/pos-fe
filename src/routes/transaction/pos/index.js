import React from 'react'
import PropTypes from 'prop-types'
// import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import moment from 'moment'
import { configMain, variables, isEmptyObject, lstorage, color } from 'utils'
// import {
//   TYPE_PEMBELIAN_UMUM,
//   TYPE_PEMBELIAN_GRABFOOD,
//   TYPE_PEMBELIAN_DINEIN,
//   TYPE_PEMBELIAN_GRABMART
// } from 'utils/variable'
import { Reminder, DataQuery } from 'components'
import {
  Icon,
  Form,
  // Input,
  Row,
  Col,
  Card,
  Button,
  Modal,
  message,
  Tag
} from 'antd'
import { GlobalHotKeys } from 'react-hotkeys'
import Browse from './Browse'
import ModalEditBrowse from './ModalEditBrowse'
// import ModalShift from './ModalShift'
import ModalUnit from './ModalUnit'
import ModalMember from './ModalMember'
import LovButton from './components/LovButton'
import BottomButton from './components/BottomButton'
// import ModalVoidSuspend from './components/ModalVoidSuspend'
import ModalBundleCategory from './components/ModalBundleCategory'
import TransactionDetail from './TransactionDetail'
import Bookmark from './Bookmark'
import PaymentModal from './paymentModal'
import BarcodeInput from './BarcodeInput'
import ModalLogin from '../ModalLogin'
import ModalVoucher from './ModalVoucher'
import ModalCashRegister from './ModalCashRegister'
import { groupProduct } from './utils'
import Advertising from './Advertising'

const { reArrangeMember, reArrangeMemberId } = variables
const { Promo } = DataQuery
const { prefix } = configMain
const {
  getCashierTrans, getBundleTrans, getConsignment, getServiceTrans,
  // setCashierTrans, setBundleTrans,
  setServiceTrans,
  getVoucherList, setVoucherList,
  removeQrisImage
} = lstorage
// const FormItem = Form.Item

// const formItemLayout1 = {
//   labelCol: { span: 10 },
//   wrapperCol: { span: 11 }
// }

const keyMap = {
  MEMBER: 'ctrl+m',
  PRODUCT: 'f2'
}

const Pos = ({
  pospromo,
  location,
  customer,
  loading,
  dispatch,
  pettyCashDetail,
  pos,
  login,
  // shift,
  // counter,
  app,
  promo,
  productBookmarkGroup,
  productBookmark,
  workOrderItem = localStorage.getItem('workorder') ? JSON.parse(localStorage.getItem('workorder')) : {},
  payment
}) => {
  const { currentReward } = pospromo
  const { user, setting } = app
  // const { listShift } = shift
  // const { listCounter } = counter
  const {
    modalServiceVisible,
    modalMemberVisible,
    modalAssetVisible,
    modalMechanicVisible,
    modalProductVisible,
    modalConsignmentVisible,
    modalPaymentVisible,
    listAdvertising,
    curQty,
    totalItem,
    curTotal,
    searchText,
    itemService,
    itemConsignment,
    itemPayment,
    memberInformation,
    memberUnitInfo,
    modalServiceListVisible,
    modalConsignmentListVisible,
    modalLoginVisible,
    mechanicInformation,
    curRecord,
    // modalShiftVisible,
    // listCashier,
    // dataCashierTrans,
    // curCashierNo,
    modalQueueVisible,
    // modalVoidSuspendVisible,
    modalBundleCategoryVisible,
    tmpProductList,
    tmpServiceList,
    modalWorkOrderVisible,
    dataReward,
    currentCategory,
    listUnitUsage,
    showAlert,
    // cashierBalance,
    showListReminder,
    listServiceReminder,
    modalAddUnit,
    cashierInformation,
    dineInTax,
    // typePembelian,
    modalLoginType,
    listPaymentShortcut,
    selectedPaymentShortcut,
    currentBuildComponent,
    listVoucher,
    modalVoucherVisible,
    modalCashRegisterVisible
  } = pos
  const { listEmployee } = pettyCashDetail
  const { modalLoginData } = login
  const { modalPromoVisible, listMinimumPayment } = promo
  const { modalAddMember, currentItem } = customer
  // const { user } = app
  const {
    // usingWo,
    paymentModalVisible,
    woNumber
  } = payment

  let currentCashier = {
    cashierId: null,
    employeeName: null,
    shiftId: null,
    shiftName: null,
    counterId: null,
    counterName: null,
    period: null,
    status: null,
    cashActive: null
  }
  if (!isEmptyObject(cashierInformation)) currentCashier = cashierInformation

  let product = getCashierTrans()
  let consignment = getConsignment()
  let service = localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')) : []
  const bundleItem = getBundleTrans()
  let bundle = groupProduct(product.filter(filtered => filtered.bundleId), bundleItem)
  let dataPos = product.filter(filtered => !filtered.bundleId).concat(bundle).concat(service).concat(consignment)
  let a = dataPos
  let usageLoyalty = memberInformation.useLoyalty || 0
  const totalDiscount = usageLoyalty
  let totalPayment = a.reduce((cnt, o) => cnt + o.total, 0)
  let totalQty = a.reduce((cnt, o) => { return cnt + parseInt(o.qty, 10) }, 0)

  const onShowReminder = () => {
    dispatch({
      type: 'pos/updateState',
      payload: {
        showListReminder: !showListReminder
      }
    })
    dispatch({
      type: 'pos/getServiceUsageReminder',
      payload: {
        policeNo: localStorage.getItem('memberUnit') ? JSON.parse(localStorage.getItem('memberUnit')).id : null
      }
    })
  }

  const resetSelectText = () => {
    dispatch({
      type: 'pos/updateState',
      payload: {
        searchText: ''
      }
    })
  }

  const hotKeysHandler = {
    MEMBER: () => {
      document.getElementById('input-member').focus()
    },
    PRODUCT: () => {
      document.getElementById('input-product').focus()
    }
  }

  const lovButtonProps = {
    workOrderItem,
    memberInformation,
    memberUnitInfo,
    mechanicInformation,
    onClickCash () {
      console.log('Open Cash Register')
      dispatch({
        type: 'pos/updateState',
        payload: {
          modalCashRegisterVisible: true
        }
      })
      dispatch({
        type: 'pettyCashDetail/queryEmployee',
        payload: {
          storeId: lstorage.getCurrentUserStore()
        }
      })
    },
    handleMemberBrowse () {
      resetSelectText()
      // get member data
      dispatch({
        type: 'pos/getMembers'
      })

      dispatch({
        type: 'pos/showMemberModal',
        payload: {
          modalType: 'browseMember'
        }
      })
    },
    handleAddMember () {
      resetSelectText()
      dispatch({
        type: 'customer/updateState',
        payload: {
          modalAddMember: true
        }
      })
    },
    handleAddAsset () {
      resetSelectText()
      if (memberInformation.length !== 0) {
        dispatch({
          type: 'pos/updateState',
          payload: {
            modalAddUnit: true
          }
        })
        let member = JSON.parse(localStorage.getItem('member'))[0]
        dispatch({
          type: 'customer/updateState',
          payload: {
            addUnit: {
              modal: false,
              info: { id: member.memberCode, name: member.memberName }
            }
          }
        })
      } else {
        Modal.warning({
          title: 'Member Information is not found',
          content: 'Insert Member'
        })
      }
    },
    handleAssetBrowse () {
      resetSelectText()
      dispatch({
        type: 'pos/updateState',
        payload: {
          modalAssetVisible: true,
          modalType: 'browseAsset',
          pagination: {},
          searchText: ''
        }
      })
    },
    handleMechanicBrowse () {
      resetSelectText()
      // get mechanic data
      dispatch({
        type: 'pos/getMechanics'
      })

      dispatch({
        type: 'pos/showMechanicModal',
        payload: {
          modalType: 'browseMechanic'
        }
      })
    },
    handleWorkOrderBrowse () {
      resetSelectText()
      dispatch({
        type: 'pos/queryWOHeader'
      })

      dispatch({
        type: 'pos/updateState',
        payload: {
          modalType: 'browseWorkOrder',
          modalWorkOrderVisible: true
        }
      })
    },
    handlePromoBrowse () {
      resetSelectText()
      if (Object.assign(mechanicInformation || {}).length !== 0) {
        dispatch({
          type: 'promo/query',
          payload: {
            storeId: lstorage.getCurrentUserStore()
          }
        })
        dispatch({
          type: 'promo/updateState',
          payload: {
            modalPromoVisible: true
          }
        })
      } else if (Object.assign(memberInformation || {}).length === 0) {
        Modal.info({
          title: 'Member Information is not found',
          content: 'Insert Member',
          onOk () {
            dispatch({
              type: 'pos/getMembers'
            })

            dispatch({
              type: 'pos/showMemberModal',
              payload: {
                modalType: 'browseMember'
              }
            })
          }
        })
      } else {
        Modal.info({
          title: 'Employee Information is not found',
          content: 'Insert Employee',
          onOk () {
            dispatch({ type: 'pos/hideProductModal' })
            dispatch({
              type: 'pos/getMechanics'
            })

            dispatch({
              type: 'pos/showMechanicModal',
              payload: {
                modalType: 'browseMechanic'
              }
            })
          }
        })
      }
    },
    handleQueue () {
      resetSelectText()
      if (getCashierTrans().length === 0 && localStorage.getItem('service_detail') === null) {
        dispatch({
          type: 'pos/changeQueue',
          payload: {
            queue: '1'
          }
        })
        dispatch({
          type: 'pos/showQueueModal',
          payload: {
            modalType: 'queue'
          }
        })
      } else {
        Modal.warning({
          title: 'Warning',
          content: 'Please finish your current Transaction...!'
        })
      }
    }
  }

  const modalPaymentTypeProps = {
    selectedPaymentShortcut,
    width: '650px',
    visible: paymentModalVisible,
    footer: null,
    // onOk: null,
    onCancel () {
      removeQrisImage()
      dispatch({
        type: 'payment/hidePaymentModal'
      })
    }
  }

  const reminderProps = {
    unitPoliceNo: localStorage.getItem('memberUnit') ? JSON.parse(localStorage.getItem('memberUnit')).policeNo : null,
    unitId: localStorage.getItem('memberUnit') ? JSON.parse(localStorage.getItem('memberUnit')).id : null,
    listServiceReminder,
    listUnitUsage
  }

  const modalAddUnitProps = {
    modalAddUnit,
    confirmSendUnit (data) {
      dispatch({
        type: 'customerunit/add',
        payload: data
      })
      dispatch({
        type: 'pos/updateState',
        payload: {
          modalAddUnit: false
        }
      })
    },
    cancelUnit () {
      dispatch({
        type: 'pos/updateState',
        payload: {
          modalAddUnit: false
        }
      })
    }
  }

  const modaladdMemberProps = {
    item: currentItem,
    modalAddMember,
    cancelMember () {
      dispatch({
        type: 'customer/updateState',
        payload: {
          modalAddMember: false
        }
      })
    }
  }

  const setCurBarcode = (curBarcode, curQty) => {
    dispatch({
      type: 'pos/setCurBarcode',
      payload: {
        curBarcode,
        curQty
      }
    })
  }

  let infoCashRegister = {}
  infoCashRegister.title = 'Cashier Information'
  infoCashRegister.titleColor = color.normal
  infoCashRegister.descColor = color.error
  infoCashRegister.dotVisible = false
  infoCashRegister.cashActive = ((currentCashier.cashActive || '0') === '1')

  let checkTimeDiff = lstorage.getLoginTimeDiff()
  if (checkTimeDiff > 500) {
    console.log('something fishy', checkTimeDiff)
  } else {
    const currentDate = moment(new Date(), 'DD/MM/YYYY').subtract(lstorage.getLoginTimeDiff(), 'milliseconds').toDate().format('yyyy-MM-dd')
    if (!currentCashier.period) {
      infoCashRegister.desc = '* Select the correct cash register'
      infoCashRegister.dotVisible = true
    } else if (currentCashier.period !== currentDate) {
      if (currentCashier.period && currentDate) {
        const diffDays = moment.duration(moment(currentCashier.period, 'YYYY-MM-DD').diff(currentDate)).asDays()
        infoCashRegister.desc = `${diffDays} day${Math.abs(diffDays) > 1 ? 's' : ''}`
        infoCashRegister.dotVisible = true
      }
    }
    infoCashRegister.Caption = infoCashRegister.title + (infoCashRegister.desc || '')
    infoCashRegister.CaptionObject =
      (<span style={{ color: infoCashRegister.titleColor }}>
        <Icon type={infoCashRegister.cashActive ? 'smile-o' : 'frown-o'} /> {infoCashRegister.title}
        <span style={{ display: 'block', color: infoCashRegister.descColor }}>
          {infoCashRegister.desc}
        </span>
      </span>)
  }

  const handlePromoBrowse = () => {
    resetSelectText()
    if (Object.assign(mechanicInformation || {}).length !== 0) {
      dispatch({
        type: 'promo/query',
        payload: {
          storeId: lstorage.getCurrentUserStore()
        }
      })
      dispatch({
        type: 'promo/updateState',
        payload: {
          modalPromoVisible: true
        }
      })
    } else if (Object.assign(memberInformation || {}).length === 0) {
      Modal.info({
        title: 'Member Information is not found',
        content: 'Insert Member',
        onOk () {
          dispatch({
            type: 'pos/getMembers'
          })

          dispatch({
            type: 'pos/showMemberModal',
            payload: {
              modalType: 'browseMember'
            }
          })
        }
      })
    } else {
      Modal.info({
        title: 'Employee Information is not found',
        content: 'Insert Employee',
        onOk () {
          dispatch({ type: 'pos/hideProductModal' })
          dispatch({
            type: 'pos/getMechanics'
          })

          dispatch({
            type: 'pos/showMechanicModal',
            payload: {
              modalType: 'browseMechanic'
            }
          })
        }
      })
    }
  }

  const handleServiceBrowse = () => {
    resetSelectText()
    dispatch({
      type: 'pos/getServices',
      payload: {
        active: 1
      }
    })

    dispatch({
      type: 'pos/showServiceModal',
      payload: {
        modalType: 'browseService'
      }
    })
  }

  const handleProductBrowse = () => {
    resetSelectText()
    dispatch({
      type: 'pos/showProductModal',
      payload: {
        modalType: 'browseProductLock'
      }
    })
    dispatch({
      type: 'pos/getProducts',
      payload: {
        active: 1
      }
    })
  }

  const handleConsignmentBrowse = () => {
    resetSelectText()
    dispatch({
      type: 'pos/showConsignmentModal',
      payload: {
        modalType: 'browseConsignment'
      }
    })
    dispatch({
      type: 'pos/getConsignments',
      payload: {
        page: 1
      }
    })
  }

  const modalAssetProps = {
    loading,
    dispatch,
    pos,
    visible: modalAssetVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onCancel () {
      dispatch({
        type: 'pos/updateState',
        payload: {
          modalAssetVisible: false,
          listAsset: []
        }
      })
    },
    onChange (e) {
      dispatch({
        type: 'pos/getMemberAssets',
        payload: {
          license: searchText === '' ? null : searchText,
          page: Number(e.current),
          pageSize: Number(e.pageSize)
        }
      })
    },
    onChooseItem (item) {
      localStorage.removeItem('member', [])
      localStorage.removeItem('memberUnit')
      let listByCode = (localStorage.getItem('member') === null ? [] : localStorage.getItem('member'))

      let arrayProd
      if (JSON.stringify(listByCode) === '[]') {
        arrayProd = listByCode.slice()
      } else {
        arrayProd = JSON.parse(listByCode.slice())
      }
      const newItem = reArrangeMember(item)
      arrayProd.push(newItem)

      localStorage.setItem('member', JSON.stringify(arrayProd))
      dispatch({
        type: 'pos/queryGetMemberSuccess',
        payload: { memberInformation: newItem }
      })
      dispatch({
        type: 'pos/syncCustomerCashback',
        payload: {
          memberId: newItem.id
        }
      })
      dispatch({ type: 'pos/setUtil', payload: { kodeUtil: 'employee', infoUtil: 'Employee' } })
      dispatch({ type: 'unit/lov', payload: { id: item.memberCode } })
      dispatch({
        type: 'pos/updateState',
        payload: {
          modalAssetVisible: false,
          showListReminder: false,
          listAsset: []
        }
      })
    }
  }
  const modalWorkOrderProps = {
    location,
    loading,
    dispatch,
    pos,
    visible: modalWorkOrderVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onChange (e) {
      dispatch({
        type: 'pos/queryWOHeader',
        payload: {
          q: searchText === '' ? null : searchText,
          page: Number(e.current),
          pageSize: Number(e.pageSize)
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'pos/updateState',
        payload: {
          modalWorkOrderVisible: false
        }
      })
      dispatch({
        type: 'pos/updateState',
        payload: {
          listWOHeader: []
        }
      })
    },
    onChooseItem (item) {
      Modal.confirm({
        title: 'Reset unsaved process',
        content: 'this action will reset your current process',
        onOk () {
          localStorage.removeItem('member')
          localStorage.removeItem('memberUnit')
          let object = {
            id: item.id,
            woNo: item.woNo,
            timeIn: item.timeIn
          }
          let arrayProd = []
          let newItem = reArrangeMemberId(item)
          arrayProd.push(newItem)

          let memberUnit = {
            id: item.policeNoId,
            policeNo: item.policeNo,
            merk: item.merk,
            model: item.model,
            type: item.type,
            year: item.year,
            chassisNo: item.chassisNo,
            machineNo: item.machineNo,
            expired: item.expired
          }

          localStorage.setItem('member', JSON.stringify(arrayProd))
          localStorage.setItem('memberUnit', JSON.stringify(memberUnit))
          dispatch({
            type: 'pos/syncCustomerCashback',
            payload: {
              memberId: newItem.id
            }
          })
          dispatch({
            type: 'pos/updateState',
            payload: {
              memberUnitInfo: localStorage.getItem('memberUnit') ? JSON.parse(localStorage.getItem('memberUnit')) : {},
              memberInformation: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0] : {},
              modalWorkOrderVisible: false
            }
          })
          localStorage.setItem('workorder', JSON.stringify(object))
        }
      })
    }
  }

  const modalMemberProps = {
    location,
    loading,
    dispatch,
    pos,
    visible: modalMemberVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onChange (e) {
      dispatch({
        type: 'pos/getMembers',
        payload: {
          q: searchText === '' ? null : searchText,
          page: Number(e.current),
          pageSize: Number(e.pageSize)
        }
      })
    },
    onCancel () { dispatch({ type: 'pos/hideMemberModal' }) },
    onChooseItem (item) {
      dispatch({
        type: 'pos/chooseMember',
        payload: {
          item,
          defaultValue: true,
          chooseItem: true
        }
      })
    }
  }

  const modalLoginProps = {
    modalLoginType,
    modalLoginData,
    visible: modalLoginVisible,
    title: 'Supervisor Verification',
    width: '320px',
    footer: null,
    onCancel () {
      dispatch({
        type: 'pos/hideModalLogin'
      })
      dispatch({
        type: 'login/updateState',
        payload: {
          modalFingerprintVisible: false
        }
      })
    }
  }

  const modalCashRegisterProps = {
    modalCashRegisterVisible,
    listEmployee,
    loading: loading.effects['pettyCashDetail/insertExpense'],
    visible: modalCashRegisterVisible,
    onOk (item, reset) {
      console.log('item', item)
      dispatch({
        type: 'pettyCashDetail/insertExpense',
        payload: {
          item,
          reset
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'pos/updateState',
        payload: {
          modalCashRegisterVisible: false
        }
      })
    }
  }

  const modalPaymentProps = {
    location,
    loading,
    pos,
    totalItem,
    item: itemPayment,
    visible: modalPaymentVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onCancel () {
      dispatch({ type: 'pos/hidePaymentModal' })
    },
    DeleteItem (data) {
      if (currentBuildComponent && currentBuildComponent.no) {
        dispatch({ type: 'pos/paymentDelete', payload: data })
      } else {
        dispatch({
          type: 'pos/showModalLogin',
          payload: {
            modalLoginType: 'payment'
          }
        })
        dispatch({
          type: 'login/updateState',
          payload: {
            modalLoginData: data
          }
        })
      }
    },
    onChooseItem (data) {
      if (data && data.qty === 0) {
        message.warning('Qty is 0')
        return
      }
      if (
        itemPayment.qty !== data.qty
        && itemPayment.disc1 === data.disc1
        && itemPayment.disc2 === data.disc2
        && itemPayment.disc3 === data.disc3
        && itemPayment.discount === data.discount
      ) {
        dispatch({
          type: 'pos/checkQuantityEditProduct',
          payload: {
            data,
            setting
          }
        })
      } else {
        dispatch({
          type: 'pos/showModalLogin',
          payload: {
            modalLoginType: 'editPayment'
          }
        })
        dispatch({
          type: 'login/updateState',
          payload: {
            modalLoginData: data
          }
        })
      }
    }
  }
  const ModalServiceListProps = {
    location,
    loading,
    totalItem,
    pos,
    item: itemService,
    visible: modalServiceListVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onCancel () {
      dispatch({ type: 'pos/hideServiceListModal' })
    },
    DeleteItem (data) {
      dispatch({
        type: 'pos/showModalLogin',
        payload: {
          modalLoginType: 'service'
        }
      })
      dispatch({
        type: 'login/updateState',
        payload: {
          modalLoginData: data
        }
      })
    },
    onChooseItem (data) {
      if (
        !(itemService.qty !== data.qty
          && itemService.disc1 === data.disc1
          && itemService.disc2 === data.disc2
          && itemService.disc3 === data.disc3
          && itemService.discount === data.discount)
      ) {
        dispatch({
          type: 'pos/showModalLogin',
          payload: {
            modalLoginType: 'editPayment'
          }
        })
        dispatch({
          type: 'login/updateState',
          payload: {
            modalLoginData: data
          }
        })
      } else {
        dispatch({ type: 'pos/serviceEdit', payload: data })
        dispatch({ type: 'pos/hideServiceListModal' })
      }
    }
  }

  const ModalConsignmentListProps = {
    location,
    loading,
    totalItem,
    pos,
    item: itemConsignment,
    visible: modalConsignmentListVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onCancel () {
      dispatch({ type: 'pos/hideConsignmentListModal' })
    },
    onChooseItem (data) {
      dispatch({ type: 'pos/consignmentEdit', payload: data })
      dispatch({ type: 'pos/hideConsignmentListModal' })
    },
    DeleteItem (data) {
      dispatch({
        type: 'pos/showModalLogin',
        payload: {
          modalLoginType: 'consignment'
        }
      })
      dispatch({
        type: 'login/updateState',
        payload: {
          modalLoginData: data
        }
      })
    },
    onChangeTotalItem (data) {
      dispatch({
        type: 'pos/setTotalItemConsignment',
        payload: data
      })
    }
  }

  const modalMechanicProps = {
    location,
    loading,
    dispatch,
    pos,
    visible: modalMechanicVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onChange (e) {
      dispatch({
        type: 'pos/updateState',
        payload: {
          pagination: {
            current: Number(e.current),
            pageSize: Number(e.pageSize)
          }
        }
      })
    },
    onCancel () { dispatch({ type: 'pos/hideMechanicModal' }) },
    onChooseItem (item) {
      dispatch({
        type: 'pos/chooseEmployee',
        payload: {
          item
        }
      })
    }
  }

  const chooseProduct = (item) => {
    dispatch({
      type: 'pos/chooseProduct',
      payload: {
        item
      }
    })
  }

  const chooseConsignment = (item) => {
    dispatch({
      type: 'pos/chooseConsignment',
      payload: {
        item
      }
    })
  }

  const modalConsignmentProps = {
    location,
    loading,
    dispatch,
    pos,
    visible: modalConsignmentVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onChange (e) {
      dispatch({
        type: 'pos/getConsignments',
        payload: {
          q: searchText === '' ? null : searchText,
          page: Number(e.current)
        }
      })
    },
    onCancel () { dispatch({ type: 'pos/hideConsignmentModal' }) },
    onChooseItem (item) {
      chooseConsignment(item)
      dispatch({
        type: 'pos/updateState',
        payload: {
          paymentListActiveKey: '3'
        }
      })
    }
  }

  const modalProductProps = {
    location,
    loading,
    dispatch,
    pos,
    visible: modalProductVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onChange (e) {
      dispatch({
        type: 'pos/getProducts',
        payload: {
          q: searchText === '' ? null : searchText,
          active: 1,
          page: Number(e.current),
          pageSize: Number(e.pageSize)
        }
      })
    },
    onCancel () { dispatch({ type: 'pos/hideProductModal' }) },
    showProductQty (data) {
      dispatch({
        type: 'pos/showProductQty',
        payload: {
          data
        }
      })
    },
    onChooseItem (item) {
      chooseProduct(item)
      dispatch({
        type: 'pos/updateState',
        payload: {
          paymentListActiveKey: '1'
        }
      })
    }
  }

  const modalServiceProps = {
    location,
    loading,
    dispatch,
    pos,
    visible: modalServiceVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onChange (e) {
      dispatch({
        type: 'pos/getServices',
        payload: {
          q: searchText === '' ? null : searchText,
          active: 1,
          page: Number(e.current),
          pageSize: Number(e.pageSize)
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'pos/hideServiceModal'
      })
    },
    onChooseItem (item) {
      if (!(memberInformation && memberInformation.id)) {
        Modal.info({
          title: 'Member Information is not found',
          content: 'Insert Member',
          onOk () {
          }
        })
      }
      const { selectedPaymentShortcut } = pos
      if (Object.assign(mechanicInformation || {}).length !== 0) {
        let listByCode = localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')) : []
        let arrayProd = listByCode
        let checkExists = localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')).filter(el => el.code === item.serviceCode) : []
        const { currentReward } = pospromo
        let qty = curQty
        if (currentReward && currentReward.categoryCode && currentReward.type === 'S') {
          item.serviceCost = currentReward.sellPrice
          qty = currentReward.qty
          // eslint-disable-next-line eqeqeq
          checkExists = localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')).filter(el => el.code === item.serviceCode && el.bundleId == currentReward.bundleId) : []
        }
        // eslint-disable-next-line eqeqeq
        if (currentReward && currentReward.categoryCode && currentReward.type === 'S' && checkExists && checkExists[0] && checkExists[0].bundleId == currentReward.bundleId) {
          if (currentReward && currentReward.categoryCode && currentReward.type === 'S') {
            item.sellPrice = currentReward.sellPrice
            item.distPrice01 = currentReward.distPrice01
            item.distPrice02 = currentReward.distPrice02
            item.distPrice03 = currentReward.distPrice03
            item.distPrice04 = currentReward.distPrice04
            item.distPrice05 = currentReward.distPrice05
          } else {
            item.sellPrice = item.serviceCost
            item.distPrice01 = item.serviceCost
            item.distPrice02 = item.serviceCost
            item.distPrice03 = item.serviceCost
            item.distPrice04 = item.serviceCost
            item.distPrice05 = item.serviceCost
          }
          let selectedPrice = (memberInformation.memberSellPrice ? item[memberInformation.memberSellPrice.toString()] : item.serviceCost)
          let showDiscountPrice = memberInformation.showAsDiscount ? item.serviceCost : item[memberInformation.memberSellPrice.toString()]
          if (selectedPaymentShortcut
            && selectedPaymentShortcut.sellPrice
            // eslint-disable-next-line eqeqeq
            && selectedPaymentShortcut.memberId == 0) {
            selectedPrice = item[selectedPaymentShortcut.sellPrice] ? item[selectedPaymentShortcut.sellPrice] : item.sellPrice
            showDiscountPrice = memberInformation.showAsDiscount ? item.sellPrice : item[selectedPaymentShortcut.sellPrice]
          }
          arrayProd[checkExists[0].no - 1] = {
            no: checkExists[0].no,
            categoryCode: currentReward && currentReward.categoryCode && currentReward.type === 'S' ? currentReward.categoryCode : undefined,
            bundleId: currentReward && currentReward.categoryCode && currentReward.type === 'S' ? currentReward.bundleId : undefined,
            bundleCode: currentReward && currentReward.categoryCode && currentReward.type === 'S' ? currentReward.bundleCode : undefined,
            bundleName: currentReward && currentReward.categoryCode && currentReward.type === 'S' ? currentReward.bundleName : undefined,
            code: item.serviceCode,
            productId: item.id,
            employeeId: mechanicInformation.employeeId,
            employeeName: `${mechanicInformation.employeeName} (${mechanicInformation.employeeCode})`,
            name: item.serviceName,
            hide: item.hide,
            replaceable: item.replaceable,
            oldValue: item.oldValue,
            newValue: item.newValue,
            retailPrice: item.retailPrice,
            distPrice01: item.distPrice01,
            distPrice02: item.distPrice02,
            distPrice03: item.distPrice03,
            distPrice04: item.distPrice04,
            distPrice05: item.distPrice05,
            qty: checkExists[0].qty + qty,
            typeCode: 'S',
            sellPrice: showDiscountPrice,
            price: selectedPrice,
            discount: 0,
            disc1: 0,
            disc2: 0,
            disc3: 0,
            total: selectedPrice * (checkExists[0].qty + qty)
          }

          if (currentBuildComponent && currentBuildComponent.no) {
            arrayProd[checkExists[0].no - 1].bundleId = currentBuildComponent.bundleId
            arrayProd[checkExists[0].no - 1].bundleCode = currentBuildComponent.code
            arrayProd[checkExists[0].no - 1].bundleName = currentBuildComponent.name
          }

          setServiceTrans(JSON.stringify(arrayProd))

          if (currentBuildComponent && currentBuildComponent.no) {
            const service = getServiceTrans()
            if (service && service.length > 0) {
              const serviceSelected = service.filter(filtered => filtered.code === 'TDF')
              if (serviceSelected && serviceSelected[0]) {
                dispatch({
                  type: 'pos/setServiceDiff',
                  payload: {
                    item: serviceSelected[0]
                  }
                })
              } else {
                dispatch({
                  type: 'pos/setNewServiceDiff'
                })
              }
            } else {
              dispatch({
                type: 'pos/setNewServiceDiff'
              })
            }
          }

          dispatch({
            type: 'pos/queryServiceSuccessByCode',
            payload: {
              listByCode: item,
              curRecord: curRecord + 1
            }
          })

          let successModal = Modal.info({
            title: 'Success add service',
            content: 'Service has been added in Service`s Tab'
          })

          dispatch({
            type: 'pos/hideServiceModal'
          })

          setTimeout(() => successModal.destroy(), 1000)

          dispatch({
            type: 'pos/updateState',
            payload: {
              paymentListActiveKey: '2'
            }
          })

          setCurBarcode('', 1)
        } else if (checkExists.length === 0) {
          if (currentReward && currentReward.categoryCode && currentReward.type === 'S') {
            item.sellPrice = currentReward.sellPrice
            item.distPrice01 = currentReward.distPrice01
            item.distPrice02 = currentReward.distPrice02
            item.distPrice03 = currentReward.distPrice03
            item.distPrice04 = currentReward.distPrice04
            item.distPrice05 = currentReward.distPrice05
          } else {
            item.sellPrice = item.serviceCost
            item.distPrice01 = item.serviceCost
            item.distPrice02 = item.serviceCost
            item.distPrice03 = item.serviceCost
            item.distPrice04 = item.serviceCost
            item.distPrice05 = item.serviceCost
          }
          let selectedPrice = (memberInformation.memberSellPrice ? item[memberInformation.memberSellPrice.toString()] : item.serviceCost)
          let showDiscountPrice = memberInformation.showAsDiscount ? item.serviceCost : item[memberInformation.memberSellPrice.toString()]
          if (selectedPaymentShortcut
            && selectedPaymentShortcut.sellPrice
            // eslint-disable-next-line eqeqeq
            && selectedPaymentShortcut.memberId == 0) {
            selectedPrice = item[selectedPaymentShortcut.sellPrice] ? item[selectedPaymentShortcut.sellPrice] : item.sellPrice
            showDiscountPrice = memberInformation.showAsDiscount ? item.sellPrice : item[selectedPaymentShortcut.sellPrice]
          }
          arrayProd.push({
            no: arrayProd.length + 1,
            categoryCode: currentReward && currentReward.categoryCode && currentReward.type === 'S' ? currentReward.categoryCode : undefined,
            bundleId: currentReward && currentReward.categoryCode && currentReward.type === 'S' ? currentReward.bundleId : undefined,
            bundleCode: currentReward && currentReward.categoryCode && currentReward.type === 'S' ? currentReward.bundleCode : undefined,
            bundleName: currentReward && currentReward.categoryCode && currentReward.type === 'S' ? currentReward.bundleName : undefined,
            hide: currentReward && currentReward.categoryCode && currentReward.type === 'S' ? currentReward.hide : undefined,
            replaceable: currentReward && currentReward.categoryCode && currentReward.type === 'S' ? currentReward.replaceable : undefined,
            code: item.serviceCode,
            productId: item.id,
            employeeId: mechanicInformation.employeeId,
            employeeName: `${mechanicInformation.employeeName} (${mechanicInformation.employeeCode})`,
            name: item.serviceName,
            oldValue: item.oldValue,
            newValue: item.newValue,
            retailPrice: item.retailPrice,
            distPrice01: item.distPrice01,
            distPrice02: item.distPrice02,
            distPrice03: item.distPrice03,
            distPrice04: item.distPrice04,
            distPrice05: item.distPrice05,
            qty,
            typeCode: 'S',
            sellPrice: showDiscountPrice,
            price: selectedPrice,
            discount: 0,
            disc1: 0,
            disc2: 0,
            disc3: 0,
            total: selectedPrice * qty
          })

          setServiceTrans(JSON.stringify(arrayProd))

          if (currentBuildComponent && currentBuildComponent.no) {
            const service = getServiceTrans()
            if (service && service.length > 0) {
              const serviceSelected = service.filter(filtered => filtered.code === 'TDF')
              if (serviceSelected && serviceSelected[0]) {
                dispatch({
                  type: 'pos/setServiceDiff',
                  payload: {
                    item: serviceSelected[0]
                  }
                })
              } else {
                dispatch({
                  type: 'pos/setNewServiceDiff'
                })
              }
            } else {
              dispatch({
                type: 'pos/setNewServiceDiff'
              })
            }
          }

          dispatch({
            type: 'pos/queryServiceSuccessByCode',
            payload: {
              listByCode: item,
              curRecord: curRecord + 1
            }
          })

          let successModal = Modal.info({
            title: 'Success add service',
            content: 'Service has been added in Service`s Tab'
          })

          dispatch({
            type: 'pos/hideServiceModal'
          })

          setTimeout(() => successModal.destroy(), 1000)

          dispatch({
            type: 'pos/updateState',
            payload: {
              paymentListActiveKey: '2'
            }
          })

          setCurBarcode('', 1)
        } else {
          Modal.warning({
            title: 'Cannot add service',
            content: 'Already Exists in list'
          })
        }
      } else {
        Modal.info({
          title: 'Employee Information is not found',
          content: 'Insert Employee',
          onOk () {
            dispatch({
              type: 'pos/updateState',
              payload: {
                modalServiceVisible: false
              }
            })
            dispatch({
              type: 'pos/getMechanics'
            })

            dispatch({
              type: 'pos/showMechanicModal',
              payload: {
                modalType: 'browseMechanic'
              }
            })
          }
        })
      }
    }
  }

  const modalQueueProps = {
    location,
    loading,
    dispatch,
    pos,
    visible: modalQueueVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onCancel () {
      dispatch({
        type: 'pos/hideQueueModal'
      })
    }
  }

  const modalPromoProps = {
    visible: modalPromoVisible,
    onCancel () {
      dispatch({
        type: 'promo/updateState',
        payload: {
          modalPromoVisible: false,
          searchText: null
        }
      })
    },
    onChooseItem () {
      dispatch({
        type: 'promo/updateState',
        payload: {
          visiblePopover: true
        }
      })
    }
  }

  // const modalVoidSuspendProps = {
  //   visible: modalVoidSuspendVisible,
  //   onCancel () {
  //     dispatch({
  //       type: 'pos/updateState',
  //       payload: {
  //         modalVoidSuspendVisible: false
  //       }
  //     })
  //   },
  //   onCancelList () {
  //     dispatch({
  //       type: 'pos/updateState',
  //       payload: {
  //         modalVoidSuspendVisible: false
  //       }
  //     })
  //   },
  //   onVoid (id) {
  //     const dataBundle = localStorage.getItem('bundle_promo') ? JSON.parse(localStorage.getItem('bundle_promo')) : []
  //     const dataProduct = getCashierTrans()
  //     const dataService = localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')) : []
  //     const dataBundleFiltered = dataBundle.filter(x => x.bundleId !== id)
  //     const dataProductFiltered = dataProduct.filter(x => x.bundleId !== id)
  //     const dataServiceFiltered = dataService.filter(x => x.bundleId !== id)
  //     let arrayProduct = []
  //     let arrayService = []
  //     let arrayBundle = []
  //     for (let n = 0; n < (dataProductFiltered || []).length; n += 1) {
  //       arrayProduct.push({
  //         no: n + 1,
  //         code: dataProductFiltered[n].code,
  //         productId: dataProductFiltered[n].productId,
  //         categoryCode: dataProductFiltered[n].categoryCode,
  //         bundleId: dataProductFiltered[n].bundleId,
  //         bundleCode: dataProductFiltered[n].bundleCode,
  //         bundleName: dataProductFiltered[n].bundleName,
  //         employeeId: dataProductFiltered[n].employeeId,
  //         employeeName: dataProductFiltered[n].employeeName,
  //         retailPrice: dataProductFiltered[n].retailPrice,
  //         distPrice01: dataProductFiltered[n].distPrice01,
  //         distPrice02: dataProductFiltered[n].distPrice02,
  //         distPrice03: dataProductFiltered[n].distPrice03,
  //         distPrice04: dataProductFiltered[n].distPrice04,
  //         distPrice05: dataProductFiltered[n].distPrice05,
  //         disc1: dataProductFiltered[n].disc1,
  //         disc2: dataProductFiltered[n].disc2,
  //         disc3: dataProductFiltered[n].disc3,
  //         discount: dataProductFiltered[n].discount,
  //         name: dataProductFiltered[n].name,
  //         price: dataProductFiltered[n].price,
  //         sellPrice: dataProductFiltered[n].sellPrice,
  //         qty: dataProductFiltered[n].qty,
  //         typeCode: dataProductFiltered[n].typeCode,
  //         total: dataProductFiltered[n].total
  //       })
  //     }
  //     for (let n = 0; n < (dataServiceFiltered || []).length; n += 1) {
  //       arrayService.push({
  //         no: n + 1,
  //         code: dataServiceFiltered[n].code,
  //         productId: dataServiceFiltered[n].productId,
  //         categoryCode: dataServiceFiltered[n].categoryCode,
  //         bundleId: dataServiceFiltered[n].bundleId,
  //         bundleCode: dataServiceFiltered[n].bundleCode,
  //         bundleName: dataServiceFiltered[n].bundleName,
  //         employeeId: dataServiceFiltered[n].employeeId,
  //         employeeName: dataServiceFiltered[n].employeeName,
  //         retailPrice: dataProductFiltered[n].retailPrice,
  //         distPrice01: dataProductFiltered[n].distPrice01,
  //         distPrice02: dataProductFiltered[n].distPrice02,
  //         distPrice03: dataProductFiltered[n].distPrice03,
  //         distPrice04: dataProductFiltered[n].distPrice04,
  //         distPrice05: dataProductFiltered[n].distPrice05,
  //         disc1: dataServiceFiltered[n].disc1,
  //         disc2: dataServiceFiltered[n].disc2,
  //         disc3: dataServiceFiltered[n].disc3,
  //         discount: dataServiceFiltered[n].discount,
  //         name: dataServiceFiltered[n].name,
  //         price: dataServiceFiltered[n].price,
  //         sellPrice: dataServiceFiltered[n].sellPrice,
  //         qty: dataServiceFiltered[n].qty,
  //         typeCode: dataServiceFiltered[n].typeCode,
  //         total: dataServiceFiltered[n].total
  //       })
  //     }
  //     for (let o = 0; o < (dataBundleFiltered || []).length; o += 1) {
  //       arrayBundle.push({
  //         no: o + 1,
  //         applyMultiple: dataBundleFiltered[o].applyMultiple,
  //         bundleId: dataBundleFiltered[o].bundleId,
  //         type: dataBundleFiltered[o].type,
  //         code: dataBundleFiltered[o].code,
  //         name: dataBundleFiltered[o].name,
  //         categoryCode: dataBundleFiltered[0].categoryCode,
  //         startDate: dataBundleFiltered[o].startDate,
  //         endDate: dataBundleFiltered[o].endDate,
  //         startHour: dataBundleFiltered[o].startHour,
  //         endHour: dataBundleFiltered[o].endHour,
  //         availableDate: dataBundleFiltered[o].availableDate,
  //         qty: dataBundleFiltered[o].qty
  //       })
  //     }
  //     setCashierTrans(JSON.stringify(arrayProduct))
  //     setServiceTrans(JSON.stringify(arrayService))
  //     setBundleTrans(JSON.stringify(arrayBundle))

  //     dispatch({
  //       type: 'pos/updateState',
  //       payload: {
  //         modalVoidSuspendVisible: false
  //       }
  //     })
  //   }
  // }

  const modalBundleCategoryProps = {
    loading: loading.effects['pos/chooseProductPromo'],
    visible: modalBundleCategoryVisible,
    dataReward,
    currentCategory,
    currentReward: currentReward ? currentReward.type : null,
    listProduct: currentReward && currentReward.type === 'P' ? tmpProductList : tmpServiceList,
    onCancel () {
      dispatch({
        type: 'pos/updateState',
        payload: {
          dataReward: [],
          currentCategory: [],
          modalBundleCategoryVisible: false
        }
      })
      dispatch({
        type: 'pospromo/updateState',
        payload: {
          currentReward: {},
          bundleData: {},
          listCategory: [],
          productData: {},
          serviceData: {}
        }
      })
    },
    onOk (data, reset) {
      let listProductQty = []
      for (let key in data.bundle) {
        const item = data.bundle[key]
        const filteredExists = listProductQty.filter(filtered => filtered.key === item.key)
        if (filteredExists && filteredExists.length > 0) {
          listProductQty = listProductQty.map((productItem) => {
            if (productItem.key === item.key) {
              return ({
                ...productItem,
                qty: productItem.qty + 1
              })
            }
            return productItem
          })
        } else {
          item.qty = 1
          listProductQty.push(item)
        }
      }

      if (currentReward && currentReward.type === 'P') {
        dispatch({
          type: 'pos/chooseProductPromo',
          payload: {
            data: listProductQty,
            reset
          }
        })
      }

      if (currentReward && currentReward.type === 'S') {
        dispatch({
          type: 'pos/chooseServicePromo',
          payload: {
            data: listProductQty,
            reset
          }
        })
      }
    }
  }

  const handleKeyPress = async (e, kodeUtil) => {
    const { value } = e.target
    if (value && value !== '') {
      if (kodeUtil === 'barcode') {
        let qty = 1
        let barcode = value
        if (value && value.includes('*') && value.split('*').length === 2) {
          const splittedValue = value.split('*')
          if (splittedValue[0] && splittedValue[0].length < 4) {
            qty = parseFloat(splittedValue[0])
            console.log('splittedValue qty', qty)
            barcode = splittedValue[1]
          }
        }
        dispatch({
          type: 'pos/getProductByBarcode',
          payload: {
            id: barcode,
            qty,
            type: 'barcode',
            day: moment().isoWeekday(),
            storeId: lstorage.getCurrentUserStore()
          }
        })
      }

      if (kodeUtil === 'member') {
        dispatch({
          type: 'pos/getMemberByPhone',
          payload: {
            id: value,
            type: 'member'
          }
        })
      }

      dispatch({
        type: 'pos/updateState',
        payload: {
          curBarcode: '',
          kodeUtil: 'barcode',
          infoUtil: 'Product'
        }
      })
    }
  }

  const showModalCashback = () => {
    // dispatch({
    //   type: 'pos/updateState',
    //   payload: {
    //     modalCashbackVisible: true
    //   }
    // })
    dispatch({
      type: 'pos/updateState',
      payload: {
        modalVoucherVisible: true
      }
    })
  }

  const handleChangeDineIn = (event, type, item) => {
    Modal.confirm({
      title: 'Ubah Tipe Transaksi',
      content: 'Anda yakin dengan transaksi ini ?',
      onOk () {
        localStorage.setItem('dineInTax', event)
        localStorage.setItem('typePembelian', type)

        dispatch({
          type: 'pos/changeDineIn',
          payload: {
            dineInTax: event,
            typePembelian: type,
            selectedPaymentShortcut: item
          }
        })

        dispatch({
          type: 'pos/updateState',
          payload: {
            dineInTax: event,
            typePembelian: type
          }
        })

        dispatch({
          type: 'pos/setPaymentShortcut',
          payload: {
            item
          }
        })
      },
      onCancel () {

      }
    })
  }

  const curNetto = (parseFloat(totalPayment) - parseFloat(totalDiscount)) || 0
  const dineIn = curNetto * (dineInTax / 100)

  const handleChangeBookmark = (key = 1, page = 1) => {
    dispatch({
      type: 'productBookmark/query',
      payload: {
        day: moment().isoWeekday(),
        storeId: lstorage.getCurrentUserStore(),
        groupId: key,
        relationship: 1,
        page,
        pageSize: 14
      }
    })
  }
  const listBookmark = productBookmarkGroup.list
  const hasBookmark = listBookmark && listBookmark.length > 0

  const chooseBundle = (item) => {
    dispatch({
      type: 'pospromo/addPosPromo',
      payload: {
        bundleId: item.id,
        currentBundle: getBundleTrans(),
        currentProduct: getCashierTrans(),
        currentService: getServiceTrans()
      }
    })
  }

  const handleCloseBuildComponent = (event) => {
    event.preventDefault()
    Modal.confirm({
      title: 'Reset unsaved process',
      content: 'this action will reset your current process',
      onOk () {
        dispatch({ type: 'pos/removeTrans' })
        dispatch({ type: 'pos/setDefaultMember' })
        dispatch({ type: 'pos/setDefaultEmployee' })

        dispatch({ type: 'pos/setDefaultPaymentShortcut' })
      }
    })
  }

  const onPayment = () => {
    let defaultRole = ''
    const localId = localStorage.getItem(`${prefix}udi`)
    if (localId && localId.indexOf('#') > -1) {
      defaultRole = localId.split(/[# ]+/).pop()
    }
    const service = localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')) : []
    const memberData = localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member')).id : null
    const memberUnit = localStorage.getItem('memberUnit') ? JSON.parse(localStorage.getItem('memberUnit')) : { id: null, policeNo: null, merk: null, model: null }
    const workorder = localStorage.getItem('workorder') ? JSON.parse(localStorage.getItem('workorder')) : {}
    if (service.length === 0 && memberUnit.id === null && !(woNumber === '' || woNumber === null)) {
      Modal.warning({
        title: 'Unit Validation',
        content: 'Member Unit is not Defined '
      })
      if (defaultRole !== 'OWN') {
        return
      }
    }
    if (!(memberUnit.id === null) && (woNumber === '' || woNumber === null) && !workorder) {
      Modal.warning({
        title: 'Unit Validation',
        content: 'You are inserting Member Unit without Work Order'
      })
    } else if (memberUnit.id === null && !(woNumber === '' || woNumber === null)) {
      Modal.warning({
        title: 'Unit Validation',
        content: 'You are Work Order without Member Unit'
      })
      if (defaultRole !== 'OWN') {
        return
      }
    }
    if (memberData === null) {
      Modal.warning({
        title: 'Member Validation',
        content: 'Member Data Cannot be Null'
      })
      return
    }
    dispatch({ type: 'pos/setCurTotal' })

    dispatch({ type: 'payment/setCurTotal', payload: { grandTotal: curTotal } })

    if (listVoucher && listVoucher.length > 0) {
      dispatch({
        type: 'payment/addMethodVoucher',
        payload: {
          list: listVoucher
        }
      })
    }

    // Untuk tipe page
    // dispatch(routerRedux.push('/transaction/pos/payment'))
    dispatch({
      type: 'payment/showPaymentModal'
    })
    if (bundleItem && bundleItem.length > 0) {
      const filteredBundlePayment = bundleItem.filter(filtered => filtered.minimumPayment > 0)
      if (filteredBundlePayment && filteredBundlePayment[0]) {
        dispatch({
          type: 'pos/updateState',
          payload: {
            currentBundlePayment: {
              paymentOption: filteredBundlePayment[0].paymentOption,
              paymentBankId: filteredBundlePayment[0].paymentBankId
            }
          }
        })
      }
    }
  }

  const buttomButtonProps = {
    handlePayment () {
      if (currentBuildComponent && currentBuildComponent.no) {
        const service = getServiceTrans()
        let haveUnderZero = false

        for (let key in service) {
          const item = service[key]
          if (item.total < 0) {
            haveUnderZero = true
            break
          }
        }

        if (haveUnderZero) {
          Modal.error({
            title: 'Invalid Service Cost',
            content: 'Please Check Service Section and Reduce some Product'
          })
          return
        }

        const total = (parseFloat(curNetto) + parseFloat(dineIn))
        const serviceSelected = service.filter(filtered => filtered.code === 'TDF')
        let servicePrice = 0
        if (serviceSelected && serviceSelected[0]) {
          servicePrice = serviceSelected[0].total
        }
        if (total - servicePrice > currentBuildComponent.targetCostPrice) {
          Modal.error({
            title: 'Cost price exceed',
            content: `Bundle cost price limit is ${currentBuildComponent.targetCostPrice.toLocaleString()}; Your Input: ${(total - servicePrice).toLocaleString()}`
          })
          return
        }
      }
      onPayment()
    },
    handleSuspend () {
      if (document.getElementById('KM')) document.getElementById('KM').value = 0
      dispatch({ type: 'pos/insertQueueCache' })
      dispatch({
        type: 'pos/updateState',
        payload: {
          showAlert: false
        }
      })
    },
    handleVoidPromo () {
      dispatch({
        type: 'pos/updateState',
        payload: {
          modalVoidSuspendVisible: true
        }
      })
    },
    handleCancel () {
      Modal.confirm({
        title: 'Reset unsaved process',
        content: 'this action will reset your current process',
        onOk () {
          dispatch({
            type: 'pos/showModalLogin',
            payload: {
              modalLoginType: 'resetAllPosInput'
            }
          })
          dispatch({
            type: 'login/updateState',
            payload: {
              modalLoginData: {
                transNo: user.username,
                memo: 'Cancel Input POS'
              }
            }
          })
        }
      })
    }
  }

  const modalVoucherProps = {
    visible: modalVoucherVisible,
    onOk (data) {
      dispatch({
        type: 'pos/validateVoucher',
        payload: {
          code: data.code
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'pos/updateState',
        payload: {
          modalVoucherVisible: false
        }
      })
    }
  }

  const onDeleteVoucher = (event, generatedCode) => {
    event.preventDefault()
    Modal.confirm({
      title: 'Delete Voucher',
      content: 'Are your sure to delete this voucher ?',
      onOk () {
        const list = getVoucherList().filter(filtered => filtered.generatedCode !== generatedCode)
        setVoucherList(JSON.stringify(list))
        dispatch({
          type: 'pos/updateState',
          payload: {
            listVoucher: list
          }
        })
      },
      onCancel () {
        console.log('cancel')
      }
    })
  }

  const onChooseOffering = (item) => {
    dispatch({
      type: 'pospromo/addPosPromo',
      payload: {
        bundleId: item.id,
        currentBundle: getBundleTrans(),
        currentProduct: getCashierTrans(),
        currentService: getServiceTrans()
      }
    })
  }

  return (
    <div className="content-inner" >
      <GlobalHotKeys
        keyMap={keyMap}
        handlers={hotKeysHandler}
      />
      <Row gutter={24} style={{ marginBottom: 16 }}>
        {hasBookmark ? (
          <Col md={7} sm={0} xs={0}>
            <Bookmark
              loading={
                loading.effects['productBookmark/query']
                || loading.effects['pos/chooseProduct']
                || loading.effects['pos/checkQuantityEditProduct']
                || loading.effects['pos/checkQuantityNewProduct']
                || loading.effects['pospromo/addPosPromo']
                || loading.effects['pos/getProductByBarcode']}
              onChange={handleChangeBookmark}
              onChoose={chooseProduct}
              onChooseBundle={chooseBundle}
              productBookmarkGroup={productBookmarkGroup}
              productBookmark={productBookmark}
            />
            <Advertising list={listAdvertising} />
          </Col>
        ) : null}
        <Col md={hasBookmark ? 17 : 24} sm={24}>
          <Card bordered={false} bodyStyle={{ padding: '0px', margin: 0 }} style={{ padding: '0px', margin: 0 }} noHovering>
            <Form layout="vertical">
              <LovButton {...lovButtonProps} />
              {currentBuildComponent && currentBuildComponent.no && (
                <Tag style={{ marginBottom: '10px' }} closable color="orange" onClose={handleCloseBuildComponent}>{currentBuildComponent.name}</Tag>
              )}
              {listVoucher.map(item => (
                <Tag style={{ marginBottom: '10px' }} key={item.generatedCode} closable color="green" onClose={e => onDeleteVoucher(e, item.generatedCode)}>{item.voucherName} - {item.generatedCode}</Tag>
              ))}
              {listMinimumPayment
                && listMinimumPayment.length > 0
                && (curNetto + dineIn) >= listMinimumPayment[0].minimumPayment
                && (
                  <Tag style={{ marginBottom: '10px' }} key={listMinimumPayment[0].id} closable={false} color="green" onClick={() => onChooseOffering(listMinimumPayment[0])}>{listMinimumPayment[0] && listMinimumPayment[0].description ? listMinimumPayment[0].description : listMinimumPayment[0].name}</Tag>
                )}
              <Row>
                <Col lg={10} md={24}>
                  <BarcodeInput onEnter={handleKeyPress} />
                </Col>
                <Col lg={14} md={24}>
                  <Button
                    type="primary"
                    size="medium"
                    icon="barcode"
                    onClick={handleProductBrowse}
                    style={{
                      margin: '0px 5px',
                      marginBottom: '5px'
                    }}
                  >
                    Product
                  </Button>
                  <Button
                    type="default"
                    size="medium"
                    icon="barcode"
                    onClick={handleConsignmentBrowse}
                    disabled={currentBuildComponent && currentBuildComponent.no}
                    style={{
                      margin: '0px 5px',
                      marginBottom: '5px'
                    }}
                  >
                    Consignment
                  </Button>
                  <Button type="primary"
                    size="medium"
                    icon="tool"
                    disabled={currentBuildComponent && currentBuildComponent.no}
                    onClick={handleServiceBrowse}
                    style={{
                      margin: '0px 5px',
                      marginBottom: '5px'
                    }}
                  >
                    Service
                  </Button>
                  <Button type="primary"
                    size="medium"
                    icon="tool"
                    onClick={handlePromoBrowse}
                    disabled={currentBuildComponent && currentBuildComponent.no}
                    style={{
                      margin: '0px 5px',
                      marginBottom: '5px'
                    }}
                  >
                    Bundle
                  </Button>
                </Col>
              </Row>
            </Form>

            {paymentModalVisible && <PaymentModal {...modalPaymentTypeProps} />}
            {modalAddUnit && <ModalUnit {...modalAddUnitProps} />}
            {modalAddMember && <ModalMember {...modaladdMemberProps} />}
            {modalWorkOrderVisible && <Browse {...modalWorkOrderProps} />}
            {modalMemberVisible && <Browse {...modalMemberProps} />}
            {modalAssetVisible && <Browse {...modalAssetProps} />}
            {modalMechanicVisible && <Browse {...modalMechanicProps} />}
            {modalConsignmentVisible && <Browse {...modalConsignmentProps} />}
            {modalProductVisible && <Browse {...modalProductProps} />}
            {modalServiceVisible && <Browse {...modalServiceProps} />}
            {modalQueueVisible && <Browse {...modalQueueProps} />}
            {modalPromoVisible && <Promo {...modalPromoProps} />}
            {modalQueueVisible && <Browse {...modalQueueProps} />}
            {/* {modalVoidSuspendVisible && <ModalVoidSuspend {...modalVoidSuspendProps} />} */}
            {modalBundleCategoryVisible && <ModalBundleCategory {...modalBundleCategoryProps} />}
            {modalPaymentVisible && <ModalEditBrowse {...modalPaymentProps} />}
            {modalServiceListVisible && <ModalEditBrowse {...ModalServiceListProps} />}
            {modalConsignmentListVisible && <ModalEditBrowse {...ModalConsignmentListProps} />}
            {modalLoginVisible && <ModalLogin {...modalLoginProps} />}
            {modalCashRegisterVisible && <ModalCashRegister {...modalCashRegisterProps} />}

            <TransactionDetail pos={pos} dispatch={dispatch} handleProductBrowse={handleProductBrowse} />
            <Row>
              <Col md={24} lg={16} >
                <Button.Group style={{ width: '100%' }}>
                  {/* <Button style={{ width: '20%' }} size="large" onClick={() => handleChangeDineIn(0, TYPE_PEMBELIAN_UMUM)} type={dineInTax === 0 && typePembelian === TYPE_PEMBELIAN_UMUM ? 'primary' : 'secondary'}>Take Away</Button>
                  <Button style={{ width: '20%' }} size="large" onClick={() => handleChangeDineIn(10, TYPE_PEMBELIAN_DINEIN)} type={dineInTax && dineInTax === 10 && typePembelian === TYPE_PEMBELIAN_DINEIN ? 'primary' : 'secondary'}>Dine In</Button>
                  <Button style={{ width: '20%' }} size="large" onClick={() => handleChangeDineIn(0, TYPE_PEMBELIAN_GRABFOOD)} type={dineInTax === 0 && typePembelian === TYPE_PEMBELIAN_GRABFOOD ? 'primary' : 'secondary'}>GrabFood</Button>
                  <Button style={{ width: '20%' }} size="large" onClick={() => handleChangeDineIn(0, TYPE_PEMBELIAN_GRABMART)} type={dineInTax === 0 && typePembelian === TYPE_PEMBELIAN_GRABMART ? 'primary' : 'secondary'}>GrabMart</Button> */}

                  {selectedPaymentShortcut && listPaymentShortcut && listPaymentShortcut
                    .filter(filtered => filtered.groupName === 'Payment1')
                    .map((item) => {
                      return (
                        <Button
                          style={{ width: '20%' }}
                          size="large"
                          onClick={() => handleChangeDineIn(item.dineInTax, item.consignmentPaymentType, item)}
                          type={selectedPaymentShortcut.id === item.id ? 'primary' : 'secondary'}
                        >
                          {item.shortcutName}
                        </Button>
                      )
                    })}
                </Button.Group>
                <br />
                <br />
                <Button.Group style={{ width: '100%' }}>
                  {/* <Button style={{ width: '20%' }} size="large" onClick={() => handleChangeDineIn(0, TYPE_PEMBELIAN_UMUM)} type={dineInTax === 0 && typePembelian === TYPE_PEMBELIAN_UMUM ? 'primary' : 'secondary'}>Tokopedia</Button>
                  <Button style={{ width: '20%' }} size="large" onClick={() => handleChangeDineIn(10, TYPE_PEMBELIAN_DINEIN)} type={dineInTax && dineInTax === 10 && typePembelian === TYPE_PEMBELIAN_DINEIN ? 'primary' : 'secondary'}>Shopee</Button>
                  <Button style={{ width: '20%' }} size="large" onClick={() => handleChangeDineIn(0, TYPE_PEMBELIAN_GRABFOOD)} type={dineInTax === 0 && typePembelian === TYPE_PEMBELIAN_GRABFOOD ? 'primary' : 'secondary'}>Bukalapak</Button>
                  <Button style={{ width: '20%' }} size="large" onClick={() => handleChangeDineIn(0, TYPE_PEMBELIAN_GRABMART)} type={dineInTax === 0 && typePembelian === TYPE_PEMBELIAN_GRABMART ? 'primary' : 'secondary'}>JD.id</Button>
                  <Button style={{ width: '20%' }} size="large" onClick={() => handleChangeDineIn(0, TYPE_PEMBELIAN_GRABMART)} type={dineInTax === 0 && typePembelian === TYPE_PEMBELIAN_GRABMART ? 'primary' : 'secondary'}>Blibli</Button> */}
                  {selectedPaymentShortcut && listPaymentShortcut && listPaymentShortcut
                    .filter(filtered => filtered.groupName === 'ECommerce')
                    .map((item) => {
                      return (
                        <Button
                          style={{ width: '20%' }}
                          size="large"
                          onClick={() => handleChangeDineIn(item.dineInTax, item.consignmentPaymentType, item)}
                          type={selectedPaymentShortcut.id === item.id ? 'primary' : 'secondary'}
                        >
                          {item.shortcutName}
                        </Button>
                      )
                    })}
                </Button.Group>
              </Col>
              <Col md={24} lg={8}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px' }}>Total Qty: <strong>{totalQty.toLocaleString()}</strong></div>
                  <div style={{ fontSize: '16px' }}>Total: <strong>{totalPayment.toLocaleString()}</strong></div>
                  <div style={{ fontSize: '16px' }}>Service Charge: <strong>{dineIn.toLocaleString()}</strong></div>
                  <div style={{ fontSize: '16px' }}>Netto: <strong>{(parseFloat(curNetto) + parseFloat(dineIn)).toLocaleString()}</strong></div>
                </div>
              </Col>
            </Row>
          </Card>
          <BottomButton {...buttomButtonProps} />
        </Col>
      </Row >
      {modalVoucherVisible && <ModalVoucher {...modalVoucherProps} />}

      {memberInformation.memberTypeName && (
        <div className="wrapper-switcher">
          <Button onClick={showModalCashback} className="btn-member">
            <span>
              <h2><Icon type="heart" />{`   ${memberInformation.memberTypeName || ''}`}</h2>
              <p>{(memberInformation.cashback || 0).toLocaleString()} Loyalty</p>
              <p>Click to add Voucher</p>
            </span>
          </Button>
        </div>
      )}

      <div className="wrapper-switcher">
        <Button onClick={() => window.open('/transaction/pos/customer-view', '_blank', `resizable=1, height=${screen.height}, width=${screen.width}, scrollbars=1, fullscreen=yes, screenX=${window.leftScreenBoundry()}, left=${window.leftScreenBoundry()}, toolbar=0, menubar=0, status=1`)} className="btn-customer-view">
          <span>
            <h2><Icon type="laptop" style={{ color: '#charcoal' }} /></h2>
            <p>Customer View</p>
          </span>
        </Button>
      </div>
      {
        (localStorage.getItem('lastMeter') || showAlert) &&
        <div className={`wrapper-switcher ${showListReminder ? 'active' : ''}`}>
          <Button className="btn-switcher" onClick={onShowReminder}>
            <h2><Icon type="setting" />{'   History'}</h2>
          </Button>
          <Reminder {...reminderProps} />
        </div>
      }
      {/* {modalShiftVisible && <ModalShift {...modalShiftProps} />} */}
    </div >
  )
}

Pos.propTypes = {
  pos: PropTypes.object.isRequired,
  promo: PropTypes.object.isRequired,
  payment: PropTypes.object.isRequired,
  customer: PropTypes.object.isRequired,
  customerunit: PropTypes.object.isRequired,
  unit: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  loading: PropTypes.object.isRequired,
  customertype: PropTypes.object.isRequired,
  customergroup: PropTypes.object.isRequired
}

export default connect(({
  pospromo, pettyCashDetail, productBookmarkGroup, productBookmark, pos, shift, promo, counter, unit, customer, login, app, loading, customerunit, payment
}) => ({
  pospromo, pettyCashDetail, productBookmarkGroup, productBookmark, pos, shift, promo, counter, unit, customer, login, app, loading, customerunit, payment
}))(Pos)

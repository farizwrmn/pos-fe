import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import moment from 'moment'
import { configMain, isEmptyObject, lstorage, color } from 'utils'
import { Reminder } from 'components'
import { Badge, Icon, Form, Input, Table, Row, Col, Card, Button, Tooltip, Tag, Modal, Tabs, Collapse, Popover } from 'antd'
import Browse from './Browse'
import ModalShift from './ModalShift'
import FormWo from './FormWo'
import styles from '../../../themes/index.less'
import ModalUnit from './ModalUnit'
import ModalMember from './ModalMember'

const { prefix } = configMain
const Panel = Collapse.Panel
const TabPane = Tabs.TabPane
const FormItem = Form.Item
const ButtonGroup = Button.Group
const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 18
  },
  style: {
    marginBottom: '5px'
  }
}

const Pos = ({
  location,
  customer,
  // city,
  // customergroup,
  // customertype,
  loading,
  dispatch,
  pos,
  shift,
  counter,
  unit,
  app,
  payment }) => {
  // const {
  //   visiblePopoverCity,
  //   visiblePopoverGroup,
  //   visiblePopoverType,
  //   currentItem,
  //   modalType
  // } = customer
  // const { listCity } = city
  // const { listGroup } = customergroup
  // const { listType } = customertype
  const { setting } = app
  const { listShift } = shift
  const { listCounter } = counter
  const {
    modalServiceVisible,
    modalMemberVisible,
    modalAssetVisible,
    modalMechanicVisible,
    modalProductVisible,
    modalPaymentVisible,
    visiblePopover,
    curBarcode,
    curQty,
    totalItem,
    curTotal,
    kodeUtil,
    searchText,
    itemService,
    itemPayment,
    infoUtil,
    memberInformation,
    memberUnitInfo,
    modalServiceListVisible,
    mechanicInformation,
    curRecord,
    // effectedRecord,
    modalShiftVisible,
    listCashier,
    dataCashierTrans,
    curCashierNo,
    curShift,
    modalQueueVisible,
    listUnitUsage,
    showAlert,
    showListReminder,
    listServiceReminder,
    paymentListActiveKey,
    modalAddUnit,
    cashierInformation
  } = pos

  const { modalAddMember, currentItem } = customer
  const { listLovMemberUnit, listUnit } = unit
  const { user } = app
  const { usingWo, woNumber } = payment

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

  // Tambah Kode Ascii untuk shortcut baru di bawah (hanya untuk yang menggunakan kombinasi seperti Ctrl + M)
  const keyShortcut = {
    16: false,
    17: false,
    18: false,
    77: false,
    49: false,
    50: false,
    67: false,
    51: false,
    52: false,
    72: false,
    76: false,
    73: false,
    85: false,
    75: false
  }
  /*
  Ascii => Desc
  17 => Ctrl
  16 => Shift
  18 => Alt
  49 => 1
  50 => 2
  51 => 3
  52 => 4
  77 => M
  72 => H
  66 => B
  67 => C
  69 => E
  73 => I
  85 => U
   */
  let product = localStorage.getItem('cashier_trans') ? JSON.parse(localStorage.getItem('cashier_trans')) : []
  let service = localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')) : []
  let dataPos = product.concat(service)
  let a = dataPos
  let totalPayment = a.reduce((cnt, o) => cnt + o.total, 0).toLocaleString()
  let totalQty = a.reduce((cnt, o) => { return cnt + parseInt(o.qty, 10) }, 0).toLocaleString()
  const getDate = (mode) => {
    let today = new Date()
    let dd = today.getDate()
    let mm = today.getMonth() + 1 // January is 0!
    let yyyy = today.getFullYear()

    if (dd < 10) {
      dd = `0${dd}`
    }

    if (mm < 10) {
      mm = `0${mm}`
    }

    if (mode === 1) {
      today = `${dd}-${mm}-${yyyy}`
    } else if (mode === 2) {
      today = mm + yyyy
    } else if (mode === 3) {
      today = `${yyyy}-${mm}-${dd}`
    }

    return today
  }

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

  const formWoProps = {
    usingWo,
    woNumber,
    formItemLayout: {
      labelCol: {
        span: 24
      },
      wrapperCol: {
        span: 24
      },
      style: {
        marginTop: '5px',
        marginBottom: '5px'
      }
    },
    generateSequence () {
      dispatch({
        type: 'payment/sequenceQuery',
        payload: {
          seqCode: 'WO',
          type: '1'
        }
      })
    },
    notUsingWo (check, value) {
      dispatch({
        type: 'payment/querySequenceSuccess',
        payload: {
          usingWo: check,
          woNumber: value
        }
      })
    }
  }

  const handleQueue = () => {
    if (localStorage.getItem('cashier_trans') === null) {
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

  const objectSize = () => {
    let queue = localStorage.getItem('queue') ? JSON.parse(localStorage.getItem('queue')) : {}
    Object.size = function (obj) {
      let size = 0
      let key
      for (key in obj) {
        if (obj.hasOwnProperty(key)) size += 1
      }
      return size
    }
    let size = Object.size(queue)
    return size
  }

  const handleMemberBrowse = () => {
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
  }

  const handleAssetBrowse = () => {
    dispatch({
      type: 'pos/updateState',
      payload: {
        modalAssetVisible: true,
        modalType: 'browseAsset',
        pagination: {},
        searchText: ''
      }
    })
  }

  const reminderProps = {
    unitPoliceNo: localStorage.getItem('memberUnit') ? JSON.parse(localStorage.getItem('memberUnit')).policeNo : null,
    unitId: localStorage.getItem('memberUnit') ? JSON.parse(localStorage.getItem('memberUnit')).id : null,
    listServiceReminder,
    listUnitUsage
  }

  const handleAddAsset = () => {
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
  }

  const handleAddMember = () => {
    dispatch({
      type: 'customer/updateState',
      payload: {
        modalAddMember: true
      }
    })
  }

  const modalAddUnitProps = {
    modalAddUnit,
    confirmSendUnit (data) {
      dispatch({
        type: 'customerunit/add',
        payload: data
      })
      // let getData = {
      //   id: null,
      //   policeNo: data.policeNo,
      //   merk: data.merk,
      //   model: data.model,
      //   type: data.type,
      //   year: data.year,
      //   chassisNo: data.chassisNo,
      //   machineNo: data.machineNo
      // }
      // dispatch({
      //   type: 'pos/chooseMemberUnit',
      //   payload: {
      //     policeNo: getData
      //   }
      // })
      // dispatch({
      //   type: 'payment/setPoliceNo',
      //   payload: {
      //     policeNo: getData
      //   }
      // })
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

  const closeAlert = () => {
    dispatch({
      type: 'pos/updateState',
      payload: {
        showAlert: false
      }
    })
  }

  const handleSuspend = () => {
    document.getElementById('KM').value = 0
    dispatch({ type: 'pos/insertQueueCache' })
    closeAlert()
  }

  const modalEditPayment = (record) => {
    dispatch({
      type: 'pos/showPaymentModal',
      payload: {
        item: record,
        modalType: 'modalPayment'
      }
    })
  }

  const modalEditService = (record) => {
    dispatch({
      type: 'pos/showServiceListModal',
      payload: {
        item: record,
        modalType: 'modalService'
      }
    })
  }

  const handleMechanicBrowse = () => {
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
  }

  const handleProductBrowse = () => {
    // get products data
    let json = setting.Inventory
    let jsondata = JSON.stringify(eval(`(${json})`))
    const outOfStock = JSON.parse(jsondata).posOrder.outOfStock
    dispatch({
      type: 'pos/showProductModal',
      payload: {
        modalType: 'browseProductLock'
      }
    })
    dispatch({
      type: 'pos/getProducts',
      payload: {
        outOfStock
      }
    })
  }
  const handleServiceBrowse = () => {
    dispatch({
      type: 'pos/getServices'
    })

    dispatch({
      type: 'pos/showServiceModal',
      payload: {
        modalType: 'browseService'
      }
    })
  }

  const handlePayment = () => {
    let defaultRole = ''
    const localId = localStorage.getItem(`${prefix}udi`)
    if (localId && localId.indexOf('#') > -1) {
      defaultRole = localId.split(/[# ]+/).pop()
    }
    const service = localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')) : []
    const memberUnit = localStorage.getItem('memberUnit') ? JSON.parse(localStorage.getItem('memberUnit')) : { id: null, policeNo: null, merk: null, model: null }
    if (service.length > 0 && (woNumber === '' || woNumber === null)) {
      Modal.warning({
        title: 'Service Validation',
        content: 'You are giving service without WorkOrder'
      })
      if (defaultRole !== 'OWN') {
        return
      }
    }
    if (service.length === 0 && memberUnit.id === null && !(woNumber === '' || woNumber === null)) {
      Modal.warning({
        title: 'Unit Validation',
        content: 'Member Unit is not Defined '
      })
      if (defaultRole !== 'OWN') {
        return
      }
    }
    if (!(memberUnit.id === null) && (woNumber === '' || woNumber === null)) {
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
    dispatch({ type: 'pos/setCurTotal' })

    dispatch({ type: 'payment/setCurTotal', payload: { grandTotal: curTotal } })

    dispatch(routerRedux.push('/transaction/pos/payment'))
  }

  const hdlUnitClick = () => {
    dispatch({ type: 'unit/query', payload: { id: memberInformation.memberCode } })
  }
  const hdlNoUnit = () => {
    let memberUnit = {
      id: null,
      policeNo: null,
      merk: null,
      model: null
    }
    dispatch({
      type: 'pos/setNullUnit',
      payload: {
        memberUnit
      }
    })
  }

  const changePaymentListTab = (key) => {
    dispatch({
      type: 'pos/updateState',
      payload: {
        paymentListActiveKey: key
      }
    })
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

  const handleDiscount = (tipe, value) => {
    let discountQty
    if (tipe < 5) {
      discountQty = 'Discount'
    } else if (tipe === 5) {
      discountQty = 'Quantity'
    }
    if (value) {
      if (value < (curRecord)) {
        dispatch({
          type: 'pos/setUtil',
          payload: {
            kodeUtil: (tipe === 4 ? 'discount' :
              tipe === 5 ? 'quantity'
                : `disc${tipe}`),
            infoUtil: `Insert ${discountQty} ${(tipe === 4 ? 'Nominal' : tipe === 5 ? '' : (`${tipe} (%)`))} for Record ${value}`
          }
        })

        dispatch({
          type: 'pos/setEffectedRecord',
          payload: {
            effectedRecord: value
          }
        })
      } else {
        const modal = Modal.warning({
          title: 'Warning',
          content: 'Record is out of range...!'
        })


        setTimeout(() => modal.destroy(), 1000)
      }
    } else {
      const modal = Modal.warning({
        title: 'Warning',
        content: 'Please define Record to be Change !'
      })

      setTimeout(() => modal.destroy(), 1000)
    }
    setCurBarcode('', 1)
  }

  const handleVoid = (value) => {
    if (value) {
      if (value < (curRecord)) {
        Modal.confirm({
          title: `Are you sure want to void/delete item Record ${value}?`,
          content: 'This Operation cannot be undone...!',
          onOk () {
            let dataPos = (localStorage.getItem('cashier_trans') === null ? [] : JSON.parse(localStorage.getItem('cashier_trans')))
            let arrayProd = dataPos.slice()

            arrayProd[value - 1].price = 0
            arrayProd[value - 1].qty = 0
            arrayProd[value - 1].disc1 = 0
            arrayProd[value - 1].disc2 = 0
            arrayProd[value - 1].disc3 = 0
            arrayProd[value - 1].discount = 0
            arrayProd[value - 1].total = 0

            localStorage.setItem('cashier_trans', JSON.stringify(arrayProd))

            dispatch({
              type: 'pos/setCurTotal'
            })
          },
          onCancel () { }
        })
      } else {
        const modal = Modal.warning({
          title: 'Warning',
          content: 'Record is out of range...!'
        })

        setTimeout(() => modal.destroy(), 1000)
      }
    } else {
      const modal = Modal.warning({
        title: 'Warning',
        content: 'Please define Record to be Void...!'
      })

      setTimeout(() => modal.destroy(), 1000)
    }

    setCurBarcode('', 1)
  }

  const modalShiftProps = {
    item: dataCashierTrans,
    listCashier,
    listShift,
    listCounter,
    curCashierNo,
    currentCashier,
    visible: modalShiftVisible,
    cashierId: user.userid,
    dispatch,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    getCashier () {
      dispatch({
        type: 'pos/loadDataPos'
      })
    },
    onBack () {
      dispatch({ type: 'pos/backPrevious' })
    },
    onCancel () {
      Modal.error({
        title: 'Error',
        content: 'Please Use Confirm Button...!'
      })
    },
    onOk (data) {
      dispatch({ type: 'app/foldSider' })
      // dispatch({
      //   type: 'pos/setCashierTrans',
      //   payload: data
      // })
      dispatch({
        type: 'pos/cashRegister',
        payload: data
      })
    },
    findShift () {
      dispatch({ type: 'shift/query' })
    },
    findCounter () {
      dispatch({ type: 'counter/query' })
    }
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
      arrayProd.push({
        memberCode: item.memberCode,
        memberName: item.memberName,
        address01: item.address01,
        point: item.point ? item.point : 0,
        id: item.id,
        memberTypeId: item.memberTypeId,
        memberSellPrice: item.memberSellPrice,
        memberPendingPayment: item.memberPendingPayment,
        gender: item.gender,
        phone: item.mobileNumber === '' ? item.phoneNumber : item.mobileNumber
      })

      localStorage.setItem('member', JSON.stringify(arrayProd))
      dispatch({
        type: 'pos/queryGetMemberSuccess',
        payload: { memberInformation: item }
      })
      dispatch({ type: 'pos/setUtil', payload: { kodeUtil: 'mechanic', infoUtil: 'Mechanic' } })
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
      localStorage.removeItem('member', [])
      localStorage.removeItem('memberUnit')
      let listByCode = (localStorage.getItem('member') === null ? [] : localStorage.getItem('member'))

      let arrayProd
      if (JSON.stringify(listByCode) === '[]') {
        arrayProd = listByCode.slice()
      } else {
        arrayProd = JSON.parse(listByCode.slice())
      }
      arrayProd.push({
        memberCode: item.memberCode,
        memberName: item.memberName,
        address01: item.address01,
        point: item.point ? item.point : 0,
        id: item.id,
        memberTypeId: item.memberTypeId,
        memberSellPrice: item.memberSellPrice,
        memberPendingPayment: item.memberPendingPayment,
        gender: item.gender,
        phone: item.mobileNumber === '' ? item.phoneNumber : item.mobileNumber
      })

      localStorage.setItem('member', JSON.stringify(arrayProd))
      dispatch({
        type: 'pos/queryGetMemberSuccess',
        payload: { memberInformation: item }
      })
      dispatch({ type: 'pos/setUtil', payload: { kodeUtil: 'mechanic', infoUtil: 'Mechanic' } })
      dispatch({ type: 'unit/lov', payload: { id: item.memberCode } })
      dispatch({
        type: 'pos/hideMemberModal'
      })
      dispatch({
        type: 'pos/updateState',
        payload: {
          showListReminder: false
        }
      })
      dispatch({
        type: 'customer/updateState',
        payload: {
          addUnit: {
            modal: false,
            info: { id: item.id, name: item.memberName }
          }
        }
      })

      setCurBarcode('', 1)
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
      dispatch({ type: 'pos/paymentDelete', payload: data })
    },
    onChooseItem (data) {
      dispatch({
        type: 'pos/checkQuantityEditProduct',
        payload: {
          data,
          setting
        }
      })
      // dispatch({ type: 'pos/paymentEdit', payload: data })
    },
    onChangeTotalItem (data) {
      dispatch({
        type: 'pos/setTotalItem',
        payload: data
      })
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
    onChooseItem (data) {
      dispatch({ type: 'pos/serviceEdit', payload: data })
      dispatch({ type: 'pos/hideServiceListModal' })
    },
    DeleteItem (data) {
      dispatch({ type: 'pos/serviceDelete', payload: data })
    },
    onChangeTotalItem (data) {
      dispatch({
        type: 'pos/setTotalItemService',
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
      localStorage.removeItem('mechanic')
      let arrayProd = []
      arrayProd.push({
        mechanicName: item.employeeName,
        mechanicCode: item.employeeId
      })
      localStorage.setItem('mechanic', JSON.stringify(arrayProd))
      dispatch({ type: 'pos/queryGetMechanicSuccess', payload: { mechanicInformation: item } })
      dispatch({ type: 'pos/setUtil', payload: { kodeUtil: 'barcode', infoUtil: 'Product' } })
      dispatch({ type: 'pos/hideMechanicModal' })
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
        type: 'pos/updateState',
        payload: {
          pagination: {
            current: Number(e.current),
            pageSize: Number(e.pageSize)
          }
        }
      })
    },
    onCancel () { dispatch({ type: 'pos/hideProductModal' }) },
    onChooseItem (item) {
      if ((memberInformation || []).length !== 0 && (mechanicInformation || []).length !== 0) {
        let listByCode = localStorage.getItem('cashier_trans') ? JSON.parse(localStorage.getItem('cashier_trans')) : []
        let arrayProd = listByCode
        const checkExists = localStorage.getItem('cashier_trans') ? JSON.parse(localStorage.getItem('cashier_trans')).filter(el => el.code === item.productCode) : []
        if ((checkExists || []).length === 0) {
          // if (listByCode.length === 0) {
          //   arrayProd = listByCode.slice()
          // } else {
          //   arrayProd = JSON.parse(listByCode.slice())
          // }

          const data = {
            no: arrayProd.length + 1,
            code: item.productCode,
            productId: item.id,
            name: item.productName,
            typeCode: 'P',
            qty: 1,
            price: (memberInformation.memberSellPrice ? item[memberInformation.memberSellPrice.toString()] : item.sellPrice),
            discount: 0,
            disc1: 0,
            disc2: 0,
            disc3: 0,
            total: (memberInformation.memberSellPrice ? item[memberInformation.memberSellPrice.toString()] : item.sellPrice) * curQty
          }

          arrayProd.push({
            no: arrayProd.length + 1,
            code: item.productCode,
            productId: item.id,
            name: item.productName,
            typeCode: 'P',
            qty: 1,
            price: (memberInformation.memberSellPrice ? item[memberInformation.memberSellPrice.toString()] : item.sellPrice),
            discount: 0,
            disc1: 0,
            disc2: 0,
            disc3: 0,
            total: (memberInformation.memberSellPrice ? item[memberInformation.memberSellPrice.toString()] : item.sellPrice) * curQty
          })
          dispatch({
            type: 'pos/checkQuantityNewProduct',
            payload: {
              data,
              arrayProd,
              setting
            }
          })
          dispatch({
            type: 'pos/updateState',
            payload: {
              paymentListActiveKey: '1'
            }
          })
        } else {
          Modal.warning({
            title: 'Cannot add product',
            content: 'Already Exists in list'
          })
        }
      } else if (memberInformation.length === 0) {
        Modal.info({
          title: 'Member Information is not found',
          content: 'Insert Member',
          onOk () {
            dispatch({ type: 'pos/hideProductModal' })
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
      } else if (mechanicInformation.length === 0) {
        Modal.info({
          title: 'Mechanic Information is not found',
          content: 'Insert Mechanic',
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
      let listByCode = localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')) : []
      let arrayProd = listByCode
      const checkExists = localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')).filter(el => el.code === item.serviceCode) : []
      if (checkExists.length === 0) {
        arrayProd.push({
          no: arrayProd.length + 1,
          code: item.serviceCode,
          productId: item.id,
          name: item.serviceName,
          qty: curQty,
          typeCode: 'S',
          price: item.serviceCost,
          discount: 0,
          disc1: 0,
          disc2: 0,
          disc3: 0,
          total: item.serviceCost * curQty
        })

        localStorage.setItem('service_detail', JSON.stringify(arrayProd))

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
          title: 'Cannot add product',
          content: 'Already Exists in list'
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

  const handleKeyPress = (e) => {
    const { value } = e.target
    if (e.key === '+') {
      setCurBarcode('', value)
    } else if (e.key === 'Enter') {
      if (kodeUtil === 'barcode') {
        if (value) {
          dispatch({
            type: 'pos/getStock',
            payload: {
              productCode: value,
              listByCode: (localStorage.getItem('cashier_trans') === null ? [] : localStorage.getItem('cashier_trans')),
              curQty,
              memberCode: memberInformation.memberCode,
              curRecord
            }
          })
        }
      } else if (kodeUtil === 'member') {
        if (value) {
          dispatch({ type: 'pos/getMember', payload: { memberCode: value } })

          dispatch({ type: 'unit/lov', payload: { id: value } })
        }

        dispatch({
          type: 'pos/setUtil',
          payload: {
            kodeUtil: 'mechanic',
            infoUtil: 'Mechanic'
          }
        })
      } else if (kodeUtil === 'mechanic') {
        if (value) {
          dispatch({
            type: 'pos/getMechanic',
            payload: {
              employeeId: value
            }
          })
        }

        dispatch({
          type: 'pos/setUtil',
          payload: {
            kodeUtil: 'barcode',
            infoUtil: 'Product'
          }
        })
      } else if (kodeUtil === 'service') {
        if (value) {
          dispatch({
            type: 'pos/getService',
            payload: {
              serviceId: value,
              listByCode: (localStorage.getItem('cashier_trans') === null ? [] : localStorage.getItem('cashier_trans')),
              curQty,
              memberCode: memberInformation.memberCode,
              curRecord
            }
          })
        }
      } else if (kodeUtil === 'discount' || kodeUtil === 'disc1' || kodeUtil === 'disc2' || kodeUtil === 'disc3' || kodeUtil === 'quantity') {
        if (value) {
          // dispatch({
          //   type: 'pos/editPayment',
          //   payload: {
          //     value,
          //     effectedRecord,
          //     kodeUtil
          //   }
          // })
        }
        dispatch({
          type: 'pos/setUtil',
          payload: {
            kodeUtil: 'barcode',
            infoUtil: 'Product'
          }
        })
      }

      if (kodeUtil !== 'refund') {
        setCurBarcode('', 1)
      } else if (value) {
        setCurBarcode('', value * -1)
      } else {
        setCurBarcode('', 1)
      }
    }
  }

  const onChange = (e) => {
    const { value } = e.target
    if (value !== '+') {
      setCurBarcode(value, curQty)
    }
  }

  const handleKeyDown = (e) => {
    const { value } = e.target

    if (e.keyCode in keyShortcut) {
      keyShortcut[e.keyCode] = true

      if (keyShortcut[17] && keyShortcut[18] && keyShortcut[77]) { // shortcut member (Ctrl + Alt + M)
        dispatch({
          type: 'pos/setUtil',
          payload: {
            kodeUtil: 'member',
            infoUtil: 'Member'
          }
        })
      } else if (keyShortcut[17] && keyShortcut[18] && keyShortcut[72]) { // shortcut untuk Help (Ctrl + ALT + H)
        dispatch({ type: 'app/shortcutKeyShow' })
      } else if (keyShortcut[17] && keyShortcut[18] && keyShortcut[67]) { // shortcut mechanic (Ctrl + Alt + C)
        dispatch({
          type: 'pos/setUtil',
          payload: {
            kodeUtil: 'mechanic',
            infoUtil: 'Mechanic'
          }
        })
      } else if (keyShortcut[17] && keyShortcut[16] && keyShortcut[52]) { // shortcut discount nominal (Ctrl + Shift + 4)
        handleDiscount(4, value)
      } else if (keyShortcut[17] && keyShortcut[16] && keyShortcut[49]) { // shortcut discount 1 (Ctrl + Shift + 1)
        handleDiscount(1, value)
      } else if (keyShortcut[17] && keyShortcut[16] && keyShortcut[50]) { // shortcut discount 2 (Ctrl + Shift + 2)
        handleDiscount(2, value)
      } else if (keyShortcut[17] && keyShortcut[16] && keyShortcut[51]) { // shortcut discount 3 (Ctrl + Shift + 3)
        handleDiscount(3, value)
      } else if (keyShortcut[17] && keyShortcut[75]) { // shortcut modified quantity (Ctrl + Shift + Q)
        handleDiscount(5, value)
      } else if (keyShortcut[17] && keyShortcut[16] && keyShortcut[76]) { // shortcut untuk Closing Cashier (Ctrl + Shift + L)
        let curData = (localStorage.getItem('cashier_trans') === null ? [] : JSON.parse(localStorage.getItem('cashier_trans')))

        let curQueue1 = (localStorage.getItem('queue1') === null ? [] : JSON.parse(localStorage.getItem('queue1')))
        let curQueue2 = (localStorage.getItem('queue2') === null ? [] : JSON.parse(localStorage.getItem('queue2')))
        let curQueue3 = (localStorage.getItem('queue3') === null ? [] : JSON.parse(localStorage.getItem('queue3')))

        keyShortcut[17] = false
        keyShortcut[16] = false
        keyShortcut[76] = false

        if (JSON.stringify(curData) === '[]' && JSON.stringify(curQueue1) === '[]' && JSON.stringify(curQueue2) === '[]' && JSON.stringify(curQueue3) === '[]') {
          Modal.confirm({
            title: 'Are you sure want to close this Cashier?',
            content: 'This Operation cannot be undone...!',
            onOk () {
              dispatch({
                type: 'pos/setCloseCashier',
                payload: {
                  total: 0,
                  totalCreditCard: 0,
                  status: 'C',
                  cashierNo: curCashierNo,
                  shift: curShift,
                  transDate: getDate(3)
                }
              })

              // dispatch({
              //   type: 'pos/showShiftModal',
              // })
            },
            onCancel () {
              console.log('cancel')
            }
          })
        } else {
          Modal.warning({
            title: 'Warning',
            content: 'Cannot closed cashier when having transaction...!'
          })
        }
      } else if (keyShortcut[17] && keyShortcut[16] && keyShortcut[85]) { // shortcut for insertQueue (Ctrl + Shift + U)
        keyShortcut[17] = false
        keyShortcut[16] = false
        keyShortcut[85] = false

        let arrayProd = []

        const memberUnit = localStorage.getItem('memberUnit') ? localStorage.getItem('memberUnit') : ''
        const lastMeter = localStorage.getItem('lastMeter') ? localStorage.getItem('lastMeter') : ''
        const cashier_trans = localStorage.getItem('cashier_trans') ? JSON.parse(localStorage.getItem('cashier_trans')) : []

        let listByCode = (localStorage.getItem('member') === null ? [] : localStorage.getItem('member'))
        let memberInformation
        if (JSON.stringify(listByCode) === '[]') {
          memberInformation = listByCode.slice()
        } else {
          memberInformation = listByCode
        }
        const memberInfo = memberInformation ? JSON.parse(memberInformation)[0] : []

        // start-mechanicInfo
        const mechanicInfo = localStorage.getItem('mechanic') ? JSON.parse(localStorage.getItem('mechanic')) : []
        const mechanic = mechanicInfo[0]
        // end-mechanicInfo

        arrayProd.push({
          cashier_trans,
          memberCode: memberInfo.memberCode,
          memberName: memberInfo.memberName,
          point: memberInfo.point,
          memberUnit,
          lastMeter,
          mechanicCode: mechanic.mechanicCode,
          mechanicName: mechanic.mechanicName
        })
        if (localStorage.getItem('cashier_trans') === null) {
          Modal.warning({
            title: 'Warning',
            content: 'Transaction Not Found...!'
          })
        } else if (localStorage.getItem('queue1') === null) {
          localStorage.setItem('queue1', JSON.stringify(arrayProd))
          localStorage.removeItem('cashier_trans')
          localStorage.removeItem('service_detail')
          localStorage.removeItem('member')
          localStorage.removeItem('memberUnit')
          localStorage.removeItem('mechanic')
          localStorage.removeItem('lastMeter')
          dispatch({
            type: 'pos/insertQueue',
            payload: {
              queue: '1'
            }
          })
        } else if (localStorage.getItem('queue2') === null) {
          localStorage.setItem('queue2', JSON.stringify(arrayProd))
          localStorage.removeItem('cashier_trans')
          localStorage.removeItem('service_detail')
          localStorage.removeItem('member')
          localStorage.removeItem('memberUnit')
          localStorage.removeItem('mechanic')
          localStorage.removeItem('lastMeter')
          dispatch({
            type: 'pos/insertQueue',
            payload: {
              queue: '2'
            }
          })
        } else if (localStorage.getItem('queue3') === null) {
          localStorage.setItem('queue3', JSON.stringify(arrayProd))
          localStorage.removeItem('cashier_trans')
          localStorage.removeItem('service_detail')
          localStorage.removeItem('member')
          localStorage.removeItem('memberUnit')
          localStorage.removeItem('mechanic')
          localStorage.removeItem('lastMeter')
          dispatch({
            type: 'pos/insertQueue',
            payload: {
              queue: '3'
            }
          })
        } else {
          Modal.warning({
            title: 'Warning',
            content: 'Queues are full, Please finish previous transaction first...!'
          })
        }
      }
    } else if (e.keyCode === '113') { // Tombol F2 untuk memilih antara product atau service
      if (kodeUtil === 'barcode') {
        dispatch({
          type: 'pos/setUtil',
          payload: {
            kodeUtil: 'service',
            infoUtil: 'Service'
          }
        })
      } else if (kodeUtil === 'service' || kodeUtil === 'member' || kodeUtil === 'mechanic') {
        dispatch({
          type: 'pos/setUtil',
          payload: {
            kodeUtil: 'barcode',
            infoUtil: 'Product'
          }
        })
      }
    } else if (e.keyCode === '118') { // Tombol F7 untuk void/hapus item
      handleVoid(value)
    } else if (e.keyCode === '120') { // Tombol F9 untuk void/hapus all item
      Modal.confirm({
        title: 'Are you sure want to void/delete all items?',
        content: 'This Operation cannot be undone...!',
        onOk () {
          localStorage.removeItem('cashier_trans')
          localStorage.removeItem('service_detail')
          dispatch({
            type: 'pos/setCurTotal'
          })
        },
        onCancel () { }
      })
    } else if (e.keyCode === '115') { // Tombol F4 untuk refund
      dispatch({
        type: 'pos/setUtil',
        payload: {
          kodeUtil: 'refund',
          infoUtil: 'Input Qty Refund'
        }
      })
    }
  }

  const dataTrans = () => {
    let product = localStorage.getItem('cashier_trans') === null ? [] : JSON.parse(localStorage.getItem('cashier_trans'))
    return (product)
  }

  const dataService = () => {
    let service = localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')) : []
    return (service)
  }

  const hdlPopoverClose = () => {
    dispatch({ type: 'pos/modalPopoverClose' })
  }
  const hdlPopoverVisibleChange = () => {
    dispatch({ type: 'pos/modalPopoverShow' })
  }
  const hdlTableRowClick = (record) => {
    const { id, policeNo, merk, model, type, year, chassisNo, machineNo } = record
    dispatch({
      type: 'pos/getServiceUsageReminder',
      payload: {
        policeNo: id
      }
    })
    dispatch({
      type: 'pos/chooseMemberUnit',
      payload: {
        policeNo: {
          id, policeNo, merk, model, type, year, chassisNo, machineNo
        }
      }
    })
    dispatch({
      type: 'payment/setPoliceNo',
      payload: {
        policeNo: {
          id, policeNo, merk, model, type, year, chassisNo, machineNo
        }
      }
    })
    dispatch({
      type: 'payment/setLastMeter',
      payload: { policeNo: record.policeNo }
    })
    dispatch({
      type: 'pos/updateState',
      payload: {
        showListReminder: false
      }
    })
  }

  const columns = [{
    title: 'Unit No',
    dataIndex: 'policeNo',
    key: 'policeNo',
    width: 100
  }, {
    title: 'Merk',
    dataIndex: 'merk',
    key: 'merk',
    width: 250
  }, {
    title: 'Model',
    dataIndex: 'model',
    key: 'model',
    width: 200
  }]
  const titlePopover = (
    <Row>
      <Col span={8}>Choose Member Unit</Col>
      <Col span={1} offset={15}>
        <Button shape="circle"
          icon="close-circle"
          size="small"
          onClick={() => hdlPopoverClose()}
        />
      </Col>
    </Row>
  )
  const contentPopover = (
    <div>
      {/* <Button type="primary" onClick={handleAddMember}>Add</Button> */}
      <Table
        columns={columns}
        dataSource={listUnit || listLovMemberUnit}
        size="small"
        bordered
        pagination={{ pageSize: 5 }}
        onRowClick={_record => hdlTableRowClick(_record)}

        locale={{
          emptyText: 'No Unit'
        }}
      />
    </div>
  )

  const onChangeLastMeter = (e) => {
    const { value } = e.target
    let lastMeter = value.replace(/^\D+/g, '')
    localStorage.setItem('lastMeter', JSON.stringify(parseFloat(lastMeter)))
    dispatch({
      type: 'payment/setLastMeter',
      payload: {
        lastMeter
      }
    })
    setTimeout(() => {
      if (value !== '' && value) {
        if (!showAlert) {
          dispatch({
            type: 'pos/updateState',
            payload: {
              showAlert: true
            }
          })
        }
      } else {
        dispatch({
          type: 'pos/updateState',
          payload: {
            showAlert: false,
            showListReminder: false
          }
        })
      }
    }, 1000)
  }

  let dotVisible = false
  let cashRegisterTitle = 'Cashier Information'
  if (lstorage.getLoginTimeDiff() > 500) {
    console.log('something fishy')
  } else if (currentCashier.period !== moment(new Date(), 'DD/MM/YYYY').subtract(lstorage.getLoginTimeDiff(), 'milliseconds').toDate().format('yyyy-MM-dd')) {
    cashRegisterTitle = 'Cashier Information - The open cash register date is different from current date'
    dotVisible = true
  }

  return (
    <div className="content-inner">
      {modalShiftVisible && <ModalShift {...modalShiftProps} />}
      <Row gutter={24} style={{ marginBottom: 16 }}>
        <Col lg={18} md={20}>
          <Card bordered={false} bodyStyle={{ padding: 0, margin: 0 }} noHovering>
            <Form layout="vertical">
              {/* <Input placeholder="Name" disabled style={{ marginBottom: 8}}/> */}
              <Row>
                <Card bordered={false} noHovering style={{ fontWeight: '600', color: color.charcoal }}>
                  <Row gutter={32}>
                    <Col span={2}># {currentCashier.id} </Col>
                    <Col xs={24} sm={24} md={5} lg={5} xl={5}> Cashier : {currentCashier.cashierId} </Col>
                    <Col xs={24} sm={24} md={5} lg={5} xl={5}> Shift : {currentCashier.shiftName} </Col>
                    <Col xs={24} sm={24} md={5} lg={5} xl={5}> Counter : {currentCashier.counterName} </Col>
                    <Col xs={24} sm={24} md={5} lg={5} xl={5}>
                      <Tooltip title={cashRegisterTitle}>
                        Date : {currentCashier.period}
                        <Badge dot={dotVisible} />
                      </Tooltip>
                    </Col>
                  </Row>
                </Card>
              </Row>
              <Row>
                <Col lg={2} md={24}>
                  {infoUtil && <Tag color="green" style={{ marginBottom: 8 }}> {infoUtil} </Tag>}
                </Col>
                <Col lg={22} md={24}>
                  <Input size="large"
                    autoFocus
                    value={curBarcode}
                    style={{ fontSize: 24, marginBottom: 8 }}
                    placeholder="Search Code Here"
                    onKeyDown={e => handleKeyDown(e)}
                    onChange={e => onChange(e)}
                    onKeyPress={e => handleKeyPress(e)}
                  />
                </Col>
              </Row>
            </Form>

            <ButtonGroup>
              <Button type="primary" size="large" onClick={handleMemberBrowse} >Member</Button>
              <Tooltip title="add Member">
                <Button type="primary" size="large" icon="plus-square-o" onClick={handleAddMember} className="button-width02" />
              </Tooltip>
            </ButtonGroup>

            <ButtonGroup style={{ marginRight: 8 }}>
              <Button type="primary" size="large" onClick={handleAssetBrowse}>Asset</Button>
              <Tooltip title="add Asset">
                <Button type="primary" size="large" icon="plus-square-o" onClick={handleAddAsset} className="button-width02" />
              </Tooltip>
            </ButtonGroup>

            {modalAddUnit && <ModalUnit {...modalAddUnitProps} />}
            {modalAddMember && <ModalMember {...modaladdMemberProps} />}
            {modalMemberVisible && <Browse {...modalMemberProps} />}
            {modalAssetVisible && <Browse {...modalAssetProps} />}

            <Button type="primary"
              size="large"
              icon="down-square-o"
              className="button-width01"
              onClick={handleMechanicBrowse}
            >Mechanic
            </Button>
            {modalMechanicVisible && <Browse {...modalMechanicProps} />}

            <ButtonGroup>
              <Button type="primary" size="large" icon="down-square-o" onClick={handleProductBrowse}>Product</Button>
              <Tooltip title="add Product">
                <Button type="primary" size="large" icon="plus-square-o" className="button-width02" />
              </Tooltip>
            </ButtonGroup>
            {modalProductVisible && <Browse {...modalProductProps} />}

            <Button type="primary"
              size="large"
              icon="down-square-o"
              className="button-width01"
              onClick={handleServiceBrowse}
            >Service
            </Button>
            {modalServiceVisible && <Browse {...modalServiceProps} />}
            <Badge count={objectSize()}>
              <Button type="primary"
                style={{ marginBottom: '4px' }}
                size="large"
                icon="down-square-o"
                className="button-width01"
                onClick={handleQueue}
              >Queue
              </Button>
            </Badge>
            {modalQueueVisible && <Browse {...modalQueueProps} />}


            <Form layout="inline">
              <Row>
                <Col lg={{ span: 10 }} md={24}>
                  <FormItem label="Qty" {...formItemLayout}>
                    <Input value={totalQty} style={{ fontSize: 24, marginBottom: 8 }} />
                  </FormItem>
                </Col>
                <Col lg={{ span: 10, offset: 4 }} md={24}>
                  <FormItem label="Total" {...formItemLayout}>
                    <Input value={totalPayment} style={{ fontSize: 24, marginBottom: 8 }} />
                  </FormItem>
                </Col>
              </Row>
            </Form>
            <Tabs activeKey={paymentListActiveKey} onChange={key => changePaymentListTab(key)} >
              <TabPane tab="Product" key="1">
                <Table
                  rowKey={(record, key) => key}
                  pagination={{ pageSize: 5 }}
                  bordered
                  size="small"
                  scroll={{ x: '908px', y: '220px' }}
                  locale={{
                    emptyText: 'Your Payment List'
                  }}
                  columns={[
                    {
                      title: 'No',
                      dataIndex: 'no',
                      width: '41px'
                    },
                    {
                      title: 'Code',
                      dataIndex: 'code',
                      width: '100px'
                    },
                    {
                      title: 'Product Name',
                      dataIndex: 'name'
                    },
                    {
                      title: 'Q',
                      dataIndex: 'qty',
                      width: '40px',
                      className: styles.alignRight,
                      render: text => (text || 0).toLocaleString()
                    },
                    {
                      title: 'Price',
                      dataIndex: 'price',
                      width: '100px',
                      className: styles.alignRight,
                      render: text => (text || 0).toLocaleString()
                    },
                    {
                      title: 'Disc1(%)',
                      dataIndex: 'disc1',
                      width: '90px',
                      className: styles.alignRight,
                      render: text => (text || 0).toLocaleString()
                    },
                    {
                      title: 'Disc2(%)',
                      dataIndex: 'disc2',
                      width: '90px',
                      className: styles.alignRight,
                      render: text => (text || 0).toLocaleString()
                    },
                    {
                      title: 'Disc3(%)',
                      dataIndex: 'disc3',
                      width: '90px',
                      className: styles.alignRight,
                      render: text => (text || 0).toLocaleString()
                    },
                    {
                      title: 'Disc',
                      dataIndex: 'discount',
                      width: '100px',
                      className: styles.alignRight,
                      render: text => (text || 0).toLocaleString()
                    },
                    {
                      title: 'Total',
                      dataIndex: 'total',
                      width: '100px',
                      className: styles.alignRight,
                      render: text => (text || 0).toLocaleString()
                    }
                  ]}
                  onRowClick={record => modalEditPayment(record)}
                  dataSource={dataTrans()}
                  style={{ marginBottom: 16 }}
                />
                {modalPaymentVisible && <Browse {...modalPaymentProps} />}
              </TabPane>
              <TabPane tab="Service" key="2"><Table
                rowKey={(record, key) => key}
                pagination={{ pageSize: 5 }}
                bordered
                size="small"
                scroll={{ x: '908px', y: '220px' }}
                locale={{
                  emptyText: 'Your Payment List'
                }}
                columns={[
                  {
                    title: 'No',
                    dataIndex: 'no',
                    width: '41px'
                  },
                  {
                    title: 'Code',
                    dataIndex: 'code',
                    width: '100px'
                  },
                  {
                    title: 'Service Name',
                    dataIndex: 'name'
                  },
                  {
                    title: 'Q',
                    dataIndex: 'qty',
                    width: '40px',
                    className: styles.alignRight,
                    render: text => (text || 0).toLocaleString()
                  },
                  {
                    title: 'Price',
                    dataIndex: 'price',
                    width: '100px',
                    className: styles.alignRight,
                    render: text => (text || 0).toLocaleString()
                  },
                  {
                    title: 'Disc1(%)',
                    dataIndex: 'disc1',
                    width: '90px',
                    className: styles.alignRight,
                    render: text => (text || 0).toLocaleString()
                  },
                  {
                    title: 'Disc2(%)',
                    dataIndex: 'disc2',
                    width: '90px',
                    className: styles.alignRight,
                    render: text => (text || 0).toLocaleString()
                  },
                  {
                    title: 'Disc3(%)',
                    dataIndex: 'disc3',
                    width: '90px',
                    className: styles.alignRight,
                    render: text => (text || 0).toLocaleString()
                  },
                  {
                    title: 'Disc',
                    dataIndex: 'discount',
                    width: '100px',
                    className: styles.alignRight,
                    render: text => (text || 0).toLocaleString()
                  },
                  {
                    title: 'Total',
                    dataIndex: 'total',
                    width: '100px',
                    className: styles.alignRight,
                    render: text => (text || 0).toLocaleString()
                  }
                ]}
                onRowClick={_record => modalEditService(_record)}
                dataSource={dataService()}
                style={{ marginBottom: 16 }}
              />{modalServiceListVisible && <Browse {...ModalServiceListProps} />}</TabPane>
            </Tabs>
          </Card>
        </Col>
        <Col lg={6} md={4}>
          <Collapse defaultActiveKey={['1', '2', '3']}>
            <Panel header="WorkOrder" key="3">
              <FormWo {...formWoProps} />
            </Panel>
            <Panel header="Member Info" key="1">
              <Form layout="horizontal">
                <FormItem label="Name" {...formItemLayout}>
                  <Input value={memberInformation.memberName} disabled />
                </FormItem>
                <FormItem label="Unit" hasFeedback {...formItemLayout}>
                  <Col span={16}>
                    <Input value={memberUnitInfo.policeNo} />
                  </Col>
                  <Col span={4}>
                    <Popover title={titlePopover}
                      content={contentPopover}
                      visible={visiblePopover}
                      onVisibleChange={() => hdlPopoverVisibleChange()}
                      placement="left"
                      trigger="click"
                    >
                      <ButtonGroup size="medium">
                        <Button type="primary" icon="down-square-o" onClick={hdlUnitClick} />
                      </ButtonGroup>
                    </Popover>
                  </Col>
                  <Col span={4}>
                    <Button type="danger" icon="close" onClick={hdlNoUnit} />
                  </Col>
                </FormItem>
                <FormItem label="KM" hasFeedback {...formItemLayout}>
                  <Input type="number" maxNumber={11} onChange={value => onChangeLastMeter(value)} id="KM" defaultValue={localStorage.getItem('lastMeter') ? localStorage.getItem('lastMeter') : 0} />
                </FormItem>
                <FormItem label="Code" {...formItemLayout}>
                  <Input value={memberInformation.memberCode} disabled />
                </FormItem>
                <FormItem label="Point" {...formItemLayout}>
                  <Input value={memberInformation.point} disabled />
                </FormItem>
              </Form>
            </Panel>
            <Panel header="Mechanic Info" key="2">
              <Form layout="horizontal">
                <FormItem label="Name" {...formItemLayout}>
                  <Input value={mechanicInformation.employeeName ? mechanicInformation.employeeName : mechanicInformation.mechanicCode} disabled />
                </FormItem>
                <FormItem label="ID" {...formItemLayout}>
                  <Input value={mechanicInformation.employeeId ? mechanicInformation.employeeId : mechanicInformation.mechanicName} disabled />
                </FormItem>
              </Form>
            </Panel>
          </Collapse>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form layout="vertical">
            <FormItem>
              <Row>
                <Col span={12} style={{ padding: 12 }}>
                  <Row>
                    <Col xs={24} sm={24} md={16} lg={16} xl={18}>
                      <Button style={{ fontWeight: 400, fontSize: 'large', width: '200%', height: 40, color: '#000000', background: '#8fc9fb' }} className="margin-right" width="100%" onClick={handlePayment}>Payment</Button>
                    </Col>
                    <Col xs={24} sm={24} md={16} lg={10} xl={8}>
                      <Button style={{ fontWeight: 400, fontSize: 'large', width: '100%', height: 40, color: '#000000', background: '#ffff66' }} onClick={handleSuspend}> Suspend </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </FormItem>
          </Form>
        </Col>
      </Row>
      {(localStorage.getItem('lastMeter') || showAlert) &&
        <div className={`wrapper-switcher ${showListReminder ? 'active' : ''}`}>
          <a className="btn-switcher" onClick={onShowReminder}><Icon type="tool" />Service History</a>
          <Reminder {...reminderProps} />
        </div>
      }
    </div >
  )
}

Pos.propTypes = {
  pos: PropTypes.object.isRequired,
  payment: PropTypes.object.isRequired,
  customer: PropTypes.object.isRequired,
  customerunit: PropTypes.object.isRequired,
  unit: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired,
  position: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  loading: PropTypes.object.isRequired,
  customertype: PropTypes.object.isRequired,
  customergroup: PropTypes.object.isRequired
}

export default connect(({ pos, shift, counter, unit, city, customer, customertype, customergroup, app, position, loading, customerunit, payment }) => ({ pos, shift, counter, unit, city, customer, customertype, customergroup, app, position, loading, customerunit, payment }))(Pos)

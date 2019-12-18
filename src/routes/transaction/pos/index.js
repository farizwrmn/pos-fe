import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import moment from 'moment'
import { configMain, variables, isEmptyObject, lstorage, color } from 'utils'
import { Reminder, DataQuery } from 'components'
import { Badge, Icon, Form, Input, Row, Col, Card, Button, Tooltip, Tag, Modal } from 'antd'
import Browse from './Browse'
import ModalEditBrowse from './ModalEditBrowse'
import ModalShift from './ModalShift'
import ModalUnit from './ModalUnit'
import ModalMember from './ModalMember'
import LovButton from './components/LovButton'
import BottomButton from './components/BottomButton'
import ModalVoidSuspend from './components/ModalVoidSuspend'
import TransactionDetail from './TransactionDetail'
import Bookmark from './Bookmark'

const { reArrangeMember, reArrangeMemberId } = variables
const { Promo } = DataQuery
const { prefix } = configMain
const { getCashierTrans } = lstorage
const FormItem = Form.Item

const formItemLayout1 = {
  labelCol: { span: 10 },
  wrapperCol: { span: 11 }
}

const Pos = ({
  location,
  customer,
  loading,
  dispatch,
  pos,
  shift,
  counter,
  app,
  promo,
  productBookmarkGroup,
  productBookmark,
  workOrderItem = localStorage.getItem('workorder') ? JSON.parse(localStorage.getItem('workorder')) : {},
  payment
}) => {
  const { setting } = app
  const { listShift } = shift
  const { listCounter } = counter
  const {
    // modalServiceVisible,
    modalMemberVisible,
    modalAssetVisible,
    modalMechanicVisible,
    modalProductVisible,
    modalPaymentVisible,
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
    modalShiftVisible,
    listCashier,
    dataCashierTrans,
    curCashierNo,
    modalQueueVisible,
    modalVoidSuspendVisible,
    modalWorkOrderVisible,
    listUnitUsage,
    showAlert,
    cashierBalance,
    showListReminder,
    listServiceReminder,
    modalAddUnit,
    cashierInformation
  } = pos
  const { modalPromoVisible } = promo
  const { modalAddMember, currentItem } = customer
  const { user } = app
  const {
    // usingWo,
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
  let product = getCashierTrans()
  let service = localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')) : []
  let dataPos = product.concat(service)
  let a = dataPos
  let usageLoyalty = memberInformation.useLoyalty || 0
  const totalDiscount = usageLoyalty
  let totalPayment = a.reduce((cnt, o) => cnt + o.total, 0)
  let totalQty = a.reduce((cnt, o) => { return cnt + parseInt(o.qty, 10) }, 0)
  // const getDate = (mode) => {
  //   let today = new Date()
  //   let dd = today.getDate()
  //   let mm = today.getMonth() + 1 // January is 0!
  //   let yyyy = today.getFullYear()

  //   if (dd < 10) {
  //     dd = `0${dd}`
  //   }

  //   if (mm < 10) {
  //     mm = `0${mm}`
  //   }

  //   if (mode === 1) {
  //     today = `${dd}-${mm}-${yyyy}`
  //   } else if (mode === 2) {
  //     today = mm + yyyy
  //   } else if (mode === 3) {
  //     today = `${yyyy}-${mm}-${dd}`
  //   }

  //   return today
  // }

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

  // const formWoProps = {
  //   usingWo,
  //   dispatch,
  //   woNumber,
  //   formItemLayout: {
  //     labelCol: {
  //       span: 24
  //     },
  //     wrapperCol: {
  //       span: 24
  //     },
  //     style: {
  //       marginTop: '5px',
  //       marginBottom: '5px'
  //     }
  //   },
  //   generateSequence () {
  //     dispatch({
  //       type: 'payment/sequenceQuery',
  //       payload: {
  //         seqCode: 'WO',
  //         type: '1'
  //       }
  //     })
  //   },
  //   notUsingWo (check, value) {
  //     dispatch({
  //       type: 'payment/querySequenceSuccess',
  //       payload: {
  //         usingWo: check,
  //         woNumber: value
  //       }
  //     })
  //   }
  // }

  const resetSelectText = () => {
    dispatch({
      type: 'pos/updateState',
      payload: {
        searchText: ''
      }
    })
  }

  const lovButtonProps = {
    workOrderItem,
    memberInformation,
    memberUnitInfo,
    mechanicInformation,
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

  const buttomButtonProps = {
    handlePayment () {
      let defaultRole = ''
      const localId = localStorage.getItem(`${prefix}udi`)
      if (localId && localId.indexOf('#') > -1) {
        defaultRole = localId.split(/[# ]+/).pop()
      }
      const service = localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')) : []
      const memberData = localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member')).id : null
      const memberUnit = localStorage.getItem('memberUnit') ? JSON.parse(localStorage.getItem('memberUnit')) : { id: null, policeNo: null, merk: null, model: null }
      const workorder = localStorage.getItem('workorder') ? JSON.parse(localStorage.getItem('workorder')) : {}
      if (service.length > 0 && (woNumber === '' || woNumber === null) && !workorder.id) {
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

      dispatch(routerRedux.push('/transaction/pos/payment'))
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
            type: 'pos/removeTrans'
          })
        }
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

  // const cashActive = (currentCashier.cashActive || 0) !== 0

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

  // const handleServiceBrowse = () => {
  //   resetSelectText()
  //   dispatch({
  //     type: 'pos/getServices',
  //     payload: {
  //       active: 1
  //     }
  //   })

  //   dispatch({
  //     type: 'pos/showServiceModal',
  //     payload: {
  //       modalType: 'browseService'
  //     }
  //   })
  // }

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

  const modalShiftProps = {
    item: dataCashierTrans,
    listCashier,
    listShift,
    listCounter,
    curCashierNo,
    currentCashier,
    visible: modalShiftVisible,
    cashierId: user.userid,
    infoCashRegister,
    dispatch,
    loading,
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
      Modal.confirm({
        title: 'Reset unsaved process',
        content: 'this action will reset your current process',
        onOk () {
          dispatch({
            type: 'pos/removeTrans'
          })
          localStorage.removeItem('member')
          localStorage.removeItem('memberUnit')
          let listByCode = (localStorage.getItem('member') === null ? [] : localStorage.getItem('member'))

          let arrayProd
          if (JSON.stringify(listByCode) === '[]') {
            arrayProd = listByCode.slice()
          } else {
            arrayProd = JSON.parse(listByCode.slice())
          }
          let newItem = reArrangeMember(item)
          arrayProd.push(newItem)

          localStorage.setItem('member', JSON.stringify(arrayProd))
          dispatch({
            type: 'pos/syncCustomerCashback',
            payload: {
              memberId: newItem.id
            }
          })
          dispatch({
            type: 'pos/queryGetMemberSuccess',
            payload: { memberInformation: newItem }
          })
          dispatch({ type: 'pos/setUtil', payload: { kodeUtil: 'employee', infoUtil: 'Employee' } })
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
      // dispatch({
      //   type: 'pos/updateState',
      //   payload: {
      //     modalProductVisible: false
      //   }
      // })
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
        employeeId: item.id,
        employeeName: item.employeeName,
        employeeCode: item.employeeId
      })
      localStorage.setItem('mechanic', JSON.stringify(arrayProd))
      dispatch({ type: 'pos/queryGetMechanicSuccess', payload: { mechanicInformation: arrayProd[0] || {} } })
      dispatch({ type: 'pos/setUtil', payload: { kodeUtil: 'barcode', infoUtil: 'Product' } })
      dispatch({ type: 'pos/hideMechanicModal' })
    }
  }

  const chooseProduct = (item) => {
    if ((memberInformation || []).length !== 0 && Object.assign(mechanicInformation || {}).length !== 0) {
      let listByCode = getCashierTrans()
      let arrayProd = listByCode
      const checkExists = listByCode.filter(el => el.code === item.productCode)
      if ((checkExists || []).length === 0) {
        const data = {
          no: arrayProd.length + 1,
          code: item.productCode,
          productId: item.id,
          name: item.productName,
          employeeId: mechanicInformation.employeeId,
          employeeName: `${mechanicInformation.employeeName} (${mechanicInformation.employeeCode})`,
          typeCode: 'P',
          qty: 1,
          sellPrice: memberInformation.showAsDiscount ? item.sellPrice : item[memberInformation.memberSellPrice.toString()],
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
          employeeId: mechanicInformation.employeeId,
          employeeName: `${mechanicInformation.employeeName} (${mechanicInformation.employeeCode})`,
          typeCode: 'P',
          qty: 1,
          sellPrice: memberInformation.showAsDiscount ? item.sellPrice : item[memberInformation.memberSellPrice.toString()],
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
            // ,
            // modalProductVisible: false
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
    }
  }

  // const modalServiceProps = {
  //   location,
  //   loading,
  //   dispatch,
  //   pos,
  //   visible: modalServiceVisible,
  //   maskClosable: false,
  //   wrapClassName: 'vertical-center-modal',
  //   onChange (e) {
  //     dispatch({
  //       type: 'pos/getServices',
  //       payload: {
  //         q: searchText === '' ? null : searchText,
  //         active: 1,
  //         page: Number(e.current),
  //         pageSize: Number(e.pageSize)
  //       }
  //     })
  //   },
  //   onCancel () {
  //     dispatch({
  //       type: 'pos/hideServiceModal'
  //     })
  //   },
  //   onChooseItem (item) {
  //     if (Object.assign(mechanicInformation || {}).length !== 0) {
  //       let listByCode = localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')) : []
  //       let arrayProd = listByCode
  //       const checkExists = localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')).filter(el => el.code === item.serviceCode) : []
  //       if (checkExists.length === 0) {
  //         arrayProd.push({
  //           no: arrayProd.length + 1,
  //           code: item.serviceCode,
  //           productId: item.id,
  //           employeeId: mechanicInformation.employeeId,
  //           employeeName: `${mechanicInformation.employeeName} (${mechanicInformation.employeeCode})`,
  //           name: item.serviceName,
  //           qty: curQty,
  //           typeCode: 'S',
  //           sellPrice: item.serviceCost,
  //           price: item.serviceCost,
  //           discount: 0,
  //           disc1: 0,
  //           disc2: 0,
  //           disc3: 0,
  //           total: item.serviceCost * curQty
  //         })

  //         localStorage.setItem('service_detail', JSON.stringify(arrayProd))

  //         dispatch({
  //           type: 'pos/queryServiceSuccessByCode',
  //           payload: {
  //             listByCode: item,
  //             curRecord: curRecord + 1
  //           }
  //         })

  //         let successModal = Modal.info({
  //           title: 'Success add service',
  //           content: 'Service has been added in Service`s Tab'
  //         })

  //         dispatch({
  //           type: 'pos/hideServiceModal'
  //         })

  //         setTimeout(() => successModal.destroy(), 1000)

  //         dispatch({
  //           type: 'pos/updateState',
  //           payload: {
  //             paymentListActiveKey: '2'
  //           }
  //         })

  //         setCurBarcode('', 1)
  //       } else {
  //         Modal.warning({
  //           title: 'Cannot add product',
  //           content: 'Already Exists in list'
  //         })
  //       }
  //     } else {
  //       Modal.info({
  //         title: 'Employee Information is not found',
  //         content: 'Insert Employee',
  //         onOk () {
  //           dispatch({
  //             type: 'pos/updateState',
  //             payload: {
  //               modalServiceVisible: false
  //             }
  //           })
  //           dispatch({
  //             type: 'pos/getMechanics'
  //           })

  //           dispatch({
  //             type: 'pos/showMechanicModal',
  //             payload: {
  //               modalType: 'browseMechanic'
  //             }
  //           })
  //         }
  //       })
  //     }
  //   }
  // }

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

  const ModalVoidSuspendProps = {
    visible: modalVoidSuspendVisible,
    onCancel () {
      dispatch({
        type: 'pos/updateState',
        payload: {
          modalVoidSuspendVisible: false
        }
      })
    },
    onCancelList () {
      dispatch({
        type: 'pos/updateState',
        payload: {
          modalVoidSuspendVisible: false
        }
      })
    },
    onVoid (id) {
      const dataBundle = localStorage.getItem('bundle_promo') ? JSON.parse(localStorage.getItem('bundle_promo')) : []
      const dataProduct = getCashierTrans()
      const dataService = localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')) : []
      const dataBundleFiltered = dataBundle.filter(x => x.bundleId !== id)
      const dataProductFiltered = dataProduct.filter(x => x.bundleId !== id)
      const dataServiceFiltered = dataService.filter(x => x.bundleId !== id)
      let arrayProduct = []
      let arrayService = []
      let arrayBundle = []
      for (let n = 0; n < (dataProductFiltered || []).length; n += 1) {
        arrayProduct.push({
          no: n + 1,
          code: dataProductFiltered[n].code,
          productId: dataProductFiltered[n].productId,
          bundleId: dataProductFiltered[n].bundleId,
          bundleName: dataProductFiltered[n].bundleName,
          employeeId: dataProductFiltered[n].employeeId,
          employeeName: dataProductFiltered[n].employeeName,
          disc1: dataProductFiltered[n].disc1,
          disc2: dataProductFiltered[n].disc2,
          disc3: dataProductFiltered[n].disc3,
          discount: dataProductFiltered[n].discount,
          name: dataProductFiltered[n].name,
          price: dataProductFiltered[n].price,
          qty: dataProductFiltered[n].qty,
          typeCode: dataProductFiltered[n].typeCode,
          total: dataProductFiltered[n].total
        })
      }
      for (let n = 0; n < (dataServiceFiltered || []).length; n += 1) {
        arrayService.push({
          no: n + 1,
          code: dataServiceFiltered[n].code,
          productId: dataServiceFiltered[n].productId,
          bundleId: dataServiceFiltered[n].bundleId,
          bundleName: dataServiceFiltered[n].bundleName,
          employeeId: dataServiceFiltered[n].employeeId,
          employeeName: dataServiceFiltered[n].employeeName,
          disc1: dataServiceFiltered[n].disc1,
          disc2: dataServiceFiltered[n].disc2,
          disc3: dataServiceFiltered[n].disc3,
          discount: dataServiceFiltered[n].discount,
          name: dataServiceFiltered[n].name,
          price: dataServiceFiltered[n].price,
          qty: dataServiceFiltered[n].qty,
          typeCode: dataServiceFiltered[n].typeCode,
          total: dataServiceFiltered[n].total
        })
      }
      for (let o = 0; o < (dataBundleFiltered || []).length; o += 1) {
        arrayBundle.push({
          no: o + 1,
          applyMultiple: dataBundleFiltered[o].applyMultiple,
          bundleId: dataBundleFiltered[o].bundleId,
          type: dataBundleFiltered[o].type,
          code: dataBundleFiltered[o].code,
          name: dataBundleFiltered[o].name,
          startDate: dataBundleFiltered[o].startDate,
          endDate: dataBundleFiltered[o].endDate,
          startHour: dataBundleFiltered[o].startHour,
          endHour: dataBundleFiltered[o].endHour,
          availableDate: dataBundleFiltered[o].availableDate,
          qty: dataBundleFiltered[o].qty
        })
      }
      localStorage.setItem('cashier_trans', JSON.stringify(arrayProduct))
      localStorage.setItem('service_detail', JSON.stringify(arrayService))
      localStorage.setItem('bundle_promo', JSON.stringify(arrayBundle))

      dispatch({
        type: 'pos/updateState',
        payload: {
          modalVoidSuspendVisible: false
        }
      })
      // for (let m = 0; m < (dataProductFiltered || []).length; m += 1) {
      //   dispatch({
      //     type: 'pos/paymentDelete',
      //     payload: {
      //       Record: dataProductFiltered[m].no,
      //       Payment: 'Delete',
      //       VALUE: 0
      //     }
      //   })
      // }
      // for (let n = 0; n < (dataServiceFiltered || []).length; n += 1) {
      //   dispatch({
      //     type: 'pos/serviceDelete',
      //     payload: {
      //       Record: dataServiceFiltered[n].no,
      //       Payment: 'Delete',
      //       VALUE: 0
      //     }
      //   })
      // }
    }
  }

  const handleKeyPress = (e) => {
    const { value } = e.target
    if (e.key === '+') {
      setCurBarcode('', value)
    } else if (e.key === 'Enter') {
      // if (kodeUtil === 'barcode') {
      //   if (value) {
      //     dispatch({
      //       type: 'pos/getStock',
      //       payload: {
      //         productCode: value,
      //         listByCode: getCashierTrans()
      //         curQty,
      //         memberCode: memberInformation.memberCode,
      //         curRecord
      //       }
      //     })
      //   }
      // } else
      if (kodeUtil === 'member') {
        if (value) {
          dispatch({ type: 'pos/getMember', payload: { memberCode: value } })

          dispatch({ type: 'unit/lov', payload: { id: value } })
        }

        dispatch({
          type: 'pos/setUtil',
          payload: {
            kodeUtil: 'employee',
            infoUtil: 'Employee'
          }
        })
      } else if (kodeUtil === 'employee') {
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
      // else if (kodeUtil === 'service') {
      //   if (value) {
      //     dispatch({
      //       type: 'pos/getService',
      //       payload: {
      //         serviceId: value,
      //         listByCode: getCashierTrans()
      //         curQty,
      //         memberCode: memberInformation.memberCode,
      //         curRecord
      //       }
      //     })
      //   }
      // }

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
            kodeUtil: 'employee',
            infoUtil: 'Employee'
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
      } else if (kodeUtil === 'service' || kodeUtil === 'member' || kodeUtil === 'employee') {
        dispatch({
          type: 'pos/setUtil',
          payload: {
            kodeUtil: 'barcode',
            infoUtil: 'Product'
          }
        })
      }
    } else if (e.keyCode === '120') { // Tombol F9 untuk void/hapus all item
      Modal.confirm({
        title: 'Are you sure want to void/delete all items?',
        content: 'This Operation cannot be undone...!',
        onOk () {
          localStorage.removeItem('member')
          localStorage.removeItem('memberUnit')
          localStorage.removeItem('mechanic')
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

  const showModalCashback = () => {
    dispatch({
      type: 'pos/updateState',
      payload: {
        modalCashbackVisible: true
      }
    })
  }

  const curNetto = (parseFloat(totalPayment) - parseFloat(totalDiscount)) || 0

  const handleChangeBookmark = (key = 1, page = 1, pageSize = 10) => {
    dispatch({
      type: 'productBookmark/query',
      payload: {
        groupId: key,
        relationship: 1,
        page,
        pageSize
      }
    })
  }

  return (
    <div className="content-inner" >
      {modalShiftVisible && <ModalShift {...modalShiftProps} />}
      <Row gutter={24} style={{ marginBottom: 16 }}>
        <Col md={10} sm={24}>
          <Bookmark
            loading={loading.effects['productBookmark/query']}
            onChange={handleChangeBookmark}
            onChoose={chooseProduct}
            productBookmarkGroup={productBookmarkGroup}
            productBookmark={productBookmark}
          />
        </Col>
        <Col md={14} sm={24}>
          <Card bordered={false} bodyStyle={{ padding: 0, margin: 0 }} noHovering>
            <Form layout="vertical">
              <Row>
                <Card bordered={false} noHovering style={{ fontWeight: '600', color: color.charcoal }}>
                  <Row>
                    <Col span={2}># {currentCashier.id} </Col>
                    <Col md={5} lg={5}>Opening Balance : {currentCashier.openingBalance}</Col>
                    <Col md={5} lg={5}>Cash In : {cashierBalance.cashIn}</Col>
                    <Col md={5} lg={5}>Cash Out : {cashierBalance.cashOut}</Col>
                    <Col md={5} lg={5}>
                      <Tooltip title={infoCashRegister.Caption}>
                        Date : {currentCashier.period}
                        <Badge dot={infoCashRegister.dotVisible} />
                      </Tooltip>
                    </Col>
                  </Row>
                </Card>
              </Row>
              <LovButton {...lovButtonProps} />
              <Row>
                <Col lg={2} md={2}>
                  {infoUtil && <Tag color="green" style={{ marginBottom: 8 }}> {infoUtil} </Tag>}
                </Col>
                <Col lg={14} md={24}>
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
                <Col lg={8} md={24}>
                  <Button
                    type="primary"
                    size="large"
                    icon="barcode"
                    onClick={handleProductBrowse}
                    style={{
                      margin: '0px 5px'
                    }}
                  >
                    Product
                  </Button>
                  {/* <Button type="primary"
                    size="large"
                    icon="tool"
                    onClick={handleServiceBrowse}
                    style={{
                      margin: '0px 5px'
                    }}
                  >
                    Service
                  </Button> */}
                </Col>
              </Row>
            </Form>

            {modalAddUnit && <ModalUnit {...modalAddUnitProps} />}
            {modalAddMember && <ModalMember {...modaladdMemberProps} />}
            {/* {modalCashbackVisible && <ModalCashback {...modalCashbackProps} />} */}
            {modalWorkOrderVisible && <Browse {...modalWorkOrderProps} />}
            {modalMemberVisible && <Browse {...modalMemberProps} />}
            {modalAssetVisible && <Browse {...modalAssetProps} />}
            {modalMechanicVisible && <Browse {...modalMechanicProps} />}
            {modalProductVisible && <Browse {...modalProductProps} />}
            {/* {modalServiceVisible && <Browse {...modalServiceProps} />} */}
            {modalQueueVisible && <Browse {...modalQueueProps} />}
            {modalPromoVisible && <Promo {...modalPromoProps} />}
            {modalQueueVisible && <Browse {...modalQueueProps} />}
            {modalVoidSuspendVisible && <ModalVoidSuspend {...ModalVoidSuspendProps} />}
            {modalPaymentVisible && <ModalEditBrowse {...modalPaymentProps} />}
            {modalServiceListVisible && <ModalEditBrowse {...ModalServiceListProps} />}

            <TransactionDetail pos={pos} dispatch={dispatch} />
            <Form>
              <div style={{ float: 'right' }}>
                <Row>
                  <FormItem label="Total Qty" {...formItemLayout1}>
                    <Input value={totalQty.toLocaleString()} style={{ fontSize: 20 }} />
                  </FormItem>
                </Row>
                <Row>
                  <FormItem label="Total" {...formItemLayout1}>
                    <Input value={totalPayment.toLocaleString()} style={{ fontSize: 20 }} />
                  </FormItem>
                </Row>
                <Row>
                  <FormItem label="Disc. Cashback" {...formItemLayout1}>
                    <Input value={totalDiscount.toLocaleString()} style={{ fontSize: 20 }} />
                  </FormItem>
                </Row>
                <Row>
                  <FormItem label="Netto" {...formItemLayout1}>
                    <Input value={curNetto.toLocaleString()} style={{ fontSize: 20 }} />
                  </FormItem>
                </Row>
              </div>
            </Form>
          </Card>
          <BottomButton {...buttomButtonProps} />
        </Col>
      </Row >
      <Row>
        <Card bordered={false} noHovering style={{ fontWeight: '600', color: color.charcoal }}>
          <Row gutter={32}>
            <Col span={2}># {currentCashier.id} </Col>
            <Col xs={24} sm={24} md={5} lg={5} xl={5}> Cashier : {currentCashier.cashierId} </Col>
            <Col xs={24} sm={24} md={5} lg={5} xl={5}> Shift : {currentCashier.shiftName} </Col>
            <Col xs={24} sm={24} md={5} lg={5} xl={5}> Counter : {currentCashier.counterName} </Col>
            <Col xs={24} sm={24} md={5} lg={5} xl={5}>
              <Tooltip title={infoCashRegister.Caption}>
                Date : {currentCashier.period}
                {'  '}
                <Badge dot={infoCashRegister.dotVisible} />
              </Tooltip>
            </Col>
          </Row>
        </Card>
      </Row>
      {memberInformation.memberTypeName && <div className="wrapper-switcher">
        <Button onClick={showModalCashback} className="btn-member">
          <span>
            <h2><Icon type="heart" />{`   ${memberInformation.memberTypeName || ''}`}</h2>
            <p>{(memberInformation.cashback || 0).toLocaleString()} Loyalty</p>
          </span>
        </Button>
      </div>}
      {
        (localStorage.getItem('lastMeter') || showAlert) &&
        <div className={`wrapper-switcher ${showListReminder ? 'active' : ''}`}>
          <Button className="btn-switcher" onClick={onShowReminder}>
            <h2><Icon type="setting" />{'   History'}</h2>
          </Button>
          <Reminder {...reminderProps} />
        </div>
      }
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
  productBookmarkGroup, productBookmark, pos, shift, promo, counter, unit, customer, app, loading, customerunit, payment
}) => ({
  productBookmarkGroup, productBookmark, pos, shift, promo, counter, unit, customer, app, loading, customerunit, payment
}))(Pos)

import React from 'react'
import PropTypes from 'prop-types'
import { DataTable, Layout } from 'components'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Form, Input, Table, Row, Col, Card, Button, Tooltip, Tag, Modal, Tabs, Collapse, Popover } from 'antd'

import { color } from 'utils'
import Browse from './Browse'
import ModalShift from './ModalShift'

const Panel = Collapse.Panel
const TabPane = Tabs.TabPane
const FormItem = Form.Item
const ButtonGroup = Button.Group
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
}

const Pos = ({location, loading, dispatch, pos, member, unit, app}) => {
  const {
    modalServiceVisible,
    modalMemberVisible,
    modalMechanicVisible,
    modalProductVisible,
    modalPaymentVisible,
    visiblePopover,
    curBarcode,
    curQty,
    curTotal,
    listByCode,
    kodeUtil,
    itemService,
    itemPayment,
    infoUtil,
    memberInformation,
    setCurTotal,
    memberUnitInfo,
    modalServiceListVisible,
    mechanicInformation,
    curRecord,
    effectedRecord,
    modalShiftVisible,
    listCashier,
    dataCashierTrans,
    curCashierNo,
    curShift,
    lastMeter,
    modalQueueVisible
  } = pos
  const {listLovMemberUnit, listUnit} = unit
  const {user} = app
  //Tambah Kode Ascii untuk shortcut baru di bawah (hanya untuk yang menggunakan kombinasi seperti Ctrl + M)
  const keyShortcut = {
    16: false, 17: false, 18: false, 77: false, 49: false, 50: false, 67: false,
    51: false, 52: false, 72: false, 76: false, 73: false, 85: false, 75: false }
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
  67 => C
  69 => E
  73 => I
  85 => U
   */
  let product = (localStorage.getItem('cashier_trans') === null ? [] : JSON.parse(localStorage.getItem('cashier_trans')))
  let service = (localStorage.getItem('service_detail') === null ? [] : JSON.parse(localStorage.getItem('service_detail')))
  let dataPos = product.concat(service)
  let a = dataPos
  let totalPayment = a.reduce( function(cnt,o){ return cnt + o.total; }, 0)
  let totalQty = a.reduce( function(cnt,o){ return cnt + parseInt(o.qty); }, 0)
  const getDate = (mode) => {
    let today = new Date()
    let dd = today.getDate()
    let mm = today.getMonth()+1 //January is 0!
    let yyyy = today.getFullYear()

    if(dd<10) {
      dd='0'+dd
    }

    if(mm<10) {
      mm='0'+mm
    }

    if ( mode == 1 ) {
      today = dd + '-' + mm + '-' +yyyy
    }
    else if ( mode == 2 ) {
      today = mm+yyyy
    }
    else if ( mode == 3 ) {
      today = yyyy + '-' + mm + '-' + dd
    }

    return today
  }

  const setTime = () => {
    let today = new Date()
    let h = today.getHours()
    let m = today.getMinutes()
    let s = today.getSeconds()
    m = checkTime(m)
    s = checkTime(s)

    return h + ":" + m + ":" + s
  }

  const checkTime = (i) => {
    if (i < 10) {i = "0" + i}  // add zero in front of numbers < 10
    return i
  }

  const handleQueue = () => {
    if ( localStorage.getItem('cashier_trans') === null ) {
      dispatch({
        type: 'pos/changeQueue',
        payload: {
          queue: '1',
        },
      })


      dispatch({
        type: 'pos/showQueueModal',
        payload: {
          modalType: 'queue',
        },
      })
    }
    else {
      Modal.warning({
        title: 'Warning',
        content: 'Please finish your current Transaction...!',
      })
    }
  }

  const handleMemberBrowse = () => {
    //get member data
    dispatch({
      type: 'pos/getMembers',
    })

    dispatch({
      type: 'pos/showMemberModal',
      payload: {
        modalType: 'browseMember',
      },
    })
  }

  const handleSuspend = () => {
    dispatch({type: 'pos/insertQueueCache'})
  }

  const modalEditPayment = (record) => {
    dispatch({
      type: 'pos/showPaymentModal',
      payload: {
        item: record,
        modalType: 'modalPayment'
      },
    })
  }

  const modalEditService = (record) => {
    dispatch({
      type: 'pos/showServiceListModal',
      payload: {
        item: record,
        modalType: 'modalService'
      },
    })
  }

  const handleMechanicBrowse = () => {
    //get mechanic data
     dispatch({
       type: 'pos/getMechanics',
     })

    dispatch({
      type: 'pos/showMechanicModal',
      payload: {
        modalType: 'browseMechanic',
      },
    })
  }

  const handleProductBrowse = () => {
    //get product data
    dispatch({
      type: 'pos/getProducts',
    })

    dispatch({
      type: 'pos/showProductModal',
      payload: {
        modalType: 'browseProduct',
      },
    })
  }
  const handleServiceBrowse = () => {
    dispatch({
      type: 'pos/getServices',
    })

    dispatch({
      type: 'pos/showServiceModal',
      payload: {
        modalType: 'browseService',
      },
    })
  }

  const handlePayment = () => {
    dispatch({ type: 'pos/setCurTotal' })

    dispatch({ type: 'payment/setLastTrans' })

    dispatch({ type: 'payment/setCompanyName', payload: { code: 'COMPANY'} })

    dispatch({ type: 'payment/setCurTotal', payload: { grandTotal: curTotal } })

    dispatch(routerRedux.push('/transaction/pos/payment'))
  }

  const hdlUnitClick = () => {
    dispatch({ type: 'unit/query', payload: { id: memberInformation.memberCode } })
  }

  const handleDiscount = (tipe, value) => {
    let discountQty
    if(tipe<5){
      discountQty = 'Discount'
    }
    else if (tipe ===5){
      discountQty = 'Quantity'
    }
    if ( value ) {
      if ( value < (curRecord) ) {
        dispatch({
          type: 'pos/setUtil',
          payload: {
            kodeUtil: (tipe == 4 ? 'discount' :
              tipe === 5 ? 'quantity'
                : 'disc' + tipe),
            infoUtil: `Insert ${discountQty} ` + (tipe == 4 ? 'Nominal' : tipe === 5 ? '' : (tipe + ' (%)')) + ' for Record ' + value,
          },
        })

        dispatch({
          type: 'pos/setEffectedRecord',
          payload: {
            effectedRecord: value
          },
        })
      }
      else {
        const modal = Modal.warning({
          title: 'Warning',
          content: 'Record is out of range...!',
        })


        setTimeout(() => modal.destroy(), 1000)
      }
    }
    else {
      const modal = Modal.warning({
        title: 'Warning',
        content: `Please define Record to be Change !`,
      })

      setTimeout(() => modal.destroy(), 1000)
    }

    setCurBarcode('', 1)
  }

  const handleVoid = (value) => {
    if (value) {
      if (value < (curRecord)) {
        Modal.confirm({
          title: 'Are you sure want to void/delete item Record ' + value + '?',
          content: 'This Operation cannot be undone...!',
          onOk() {
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
              type: 'pos/setCurTotal',
            })
          },
          onCancel() {},
        })
      }
      else {
        const modal = Modal.warning({
          title: 'Warning',
          content: 'Record is out of range...!',
        })

        setTimeout(() => modal.destroy(), 1000)
      }
    }
    else {
      const modal = Modal.warning({
        title: 'Warning',
        content: 'Please define Record to be Void...!',
      })

      setTimeout(() => modal.destroy(), 1000)
    }

    setCurBarcode('', 1)
  }

  const setCurBarcode = (curBarcode, curQty) => {
    dispatch({
      type: 'pos/setCurBarcode',
      payload: {
        curBarcode: curBarcode,
        curQty: curQty,
      },
    })
  }

  const modalShiftProps = {
    item: dataCashierTrans,
    listCashier: listCashier,
    curCashierNo: curCashierNo,
    visible: modalShiftVisible,
    cashierId: user.userid,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onBack() {
      dispatch({ type: 'pos/backPrevious' })
    },
    onCancel () {
      Modal.error({
          title: 'Error',
          content: 'Please Use Confirm Button...!'})
    },
    onOk (data) {
      dispatch({ type: 'app/foldSider' })

      dispatch({
        type: 'pos/setCashierTrans',
        payload: data,
      })
    },
  }
  const modalMemberProps = {
    location: location,
    loading: loading,
    pos: pos,
    visible: modalMemberVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onCancel () { dispatch({ type: 'pos/hideMemberModal' }) },
    onChooseItem (item) {
      localStorage.removeItem('member', [])
      localStorage.removeItem('memberUnit')
      let listByCode = (localStorage.getItem('member') === null ? [] : localStorage.getItem('member'))

      let arrayProd
      if ( JSON.stringify(listByCode) == "[]" ) {
        arrayProd = listByCode.slice()
      }
      else {
        arrayProd = JSON.parse(listByCode.slice())
      }
      arrayProd.push({
        'memberCode': item.memberCode,
        'memberName': item.memberName,
        'address01': item.address01,
        'point': item.point ? item.point : 0,
        'id': item.id,
        'memberTypeId': item.memberTypeId ? item.memberTypeId : 7,
        'gender': item.gender,
        'phone': item.mobileNumber === '' ? item.phoneNumber : item.mobileNumber
      })

      localStorage.setItem('member', JSON.stringify(arrayProd))
      dispatch({ type: 'pos/queryGetMemberSuccess', payload: { memberInformation: item } }),
      dispatch({ type: 'pos/setUtil', payload: { kodeUtil: 'mechanic', infoUtil: 'Mechanic' }})
      dispatch({ type: 'unit/lov', payload: { id: item.memberCode }}),
      dispatch({
        type: 'pos/hideMemberModal',
      })

      setCurBarcode('', 1)
    },
    // dispatch({
    //   type: 'pos/querySuccessByCode',
    //   payload: {
    //     listByCode: item,
    //     curRecord: curRecord + 1,
    //   },
    // })
  }
  const modalPaymentProps = {
    location: location,
    loading: loading,
    pos: pos,
    item: itemPayment,
    visible: modalPaymentVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onCancel () {
      dispatch({type: 'pos/hidePaymentModal'})
    },
    onChooseItem (data) {
      dispatch({ type: 'pos/editPayment', payload:{ value: data.VALUE, effectedRecord: data.Record, kodeUtil: data.Payment } })
      dispatch({type: 'pos/hidePaymentModal'})
    },
  }
  const ModalServiceListProps = {
    location: location,
    loading: loading,
    pos: pos,
    item: itemService,
    visible: modalServiceListVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onCancel () {
      dispatch({type: 'pos/hideServiceListModal'})
    },
    onChooseItem (data) {
      console.log('Service')
      dispatch({ type: 'pos/editService', payload:{ value: data.VALUE, effectedRecord: data.Record, kodeUtil: data.Payment } })
      dispatch({type: 'pos/hideServiceListModal'})
    },
  }

  const modalMechanicProps = {
    location: location,
    loading: loading,
    pos: pos,
    visible: modalMechanicVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onCancel () { dispatch({ type: 'pos/hideMechanicModal' }) },
    onChooseItem (item) {
      console.log('modalMechanicProps');
      localStorage.removeItem('mechanic')
      let arrayProd = []
      arrayProd.push({
        mechanicName: item.employeeName,
        mechanicCode: item.employeeId
      })
      localStorage.setItem('mechanic', JSON.stringify(arrayProd))
      dispatch({ type: 'pos/queryGetMechanicSuccess', payload: { mechanicInformation: item } })
      dispatch({ type: 'pos/setUtil', payload: { kodeUtil: 'barcode', infoUtil: 'Product' },})
      dispatch({ type: 'pos/hideMechanicModal' })
    },
  }

  const modalProductProps = {
    location: location,
    loading: loading,
    pos: pos,
    visible: modalProductVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onCancel () { dispatch({ type: 'pos/hideProductModal' }) },
    onChooseItem (item) {
      let listByCode = (localStorage.getItem('cashier_trans') === null ? [] : localStorage.getItem('cashier_trans'))

      let arrayProd
      if ( JSON.stringify(listByCode) == "[]" ) {
        arrayProd = listByCode.slice()
      }
      else {
        arrayProd = JSON.parse(listByCode.slice())
      }

      arrayProd.push({
        'no': arrayProd.length + 1,
        'code': item.productCode,
        'productId': item.id,
        'name': item.productName,
        'qty': curQty,
        'price': (memberInformation.memberTypeId != 2 ? item.sellPrice : item.distPrice02),
        'discount': 0,
        'disc1': 0,
        'disc2': 0,
        'disc3': 0,
        'total': (memberInformation.memberTypeId != 2 ? item.sellPrice : item.distPrice02) * curQty,
      })

      localStorage.setItem('cashier_trans', JSON.stringify(arrayProd))
      dispatch({ type: 'pos/querySuccessByCode', payload: { listByCode: item, curRecord: curRecord + 1, } })
      dispatch({ type: 'pos/setUtil', payload: { kodeUtil: 'barcode', infoUtil: 'Product' },})
      dispatch({ type: 'pos/hideProductModal' })
    },
  }

  const modalServiceProps = {
    location: location,
    loading: loading,
    pos: pos,
    visible: modalServiceVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onCancel () {
      dispatch({
        type: 'pos/hideServiceModal',
      })
    },
    onChooseItem (item) {
      let listByCode = (localStorage.getItem('service_detail') === null ? [] : localStorage.getItem('service_detail'))

      let arrayProd
      if ( JSON.stringify(listByCode) == "[]" ) {
        arrayProd = listByCode.slice()
      }
      else {
        arrayProd = JSON.parse(listByCode.slice())
      }


      arrayProd.push({
        'no': arrayProd.length + 1,
        'code': item.serviceCode,
        'productId': item.id,
        'name': item.serviceName,
        'qty': curQty,
        'price':  item.serviceCost,
        'discount': 0,
        'disc1': 0,
        'disc2': 0,
        'disc3': 0,
        'total':  item.serviceCost * curQty
      })

      localStorage.setItem('service_detail', JSON.stringify(arrayProd))

      dispatch({
        type: 'pos/queryServiceSuccessByCode',
        payload: {
          listByCode: item,
          curRecord: curRecord + 1,
        },
      })

      dispatch({
        type: 'pos/hideServiceModal',
      })

      setCurBarcode('', 1)
    },
  }

  const modalQueueProps = {
    location: location,
    loading: loading,
    pos: pos,
    visible: modalQueueVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onCancel () {
      dispatch({
        type: 'pos/hideQueueModal',
      })
    },
  }

  const handleKeyPress = (e) => {
    const { value } = e.target
    if ( e.key == '+' ) {
      setCurBarcode('', value)
    }
    else if ( e.key == 'Enter' ) {
      if ( kodeUtil == 'barcode' ) {
        if ( value ) {
          dispatch({
            type: 'pos/getStock',
            payload: { productCode: value,
              listByCode: (localStorage.getItem('cashier_trans') === null ? [] : localStorage.getItem('cashier_trans')),
              curQty: curQty,
              memberCode: memberInformation.memberCode,
              curRecord: curRecord,}
          })
        }
      }
      else if ( kodeUtil == 'member' ) {

        if ( value ) {
          dispatch({ type: 'pos/getMember', payload: { memberCode: value, } })

          dispatch({ type: 'unit/lov', payload: { id: value } })
        }

        dispatch({
          type: 'pos/setUtil',
          payload: {
            kodeUtil: 'mechanic',
            infoUtil: 'Mechanic',
          },
        })
      }
      else if ( kodeUtil == 'mechanic' ) {
        if ( value ) {
          dispatch({ type: 'pos/getMechanic', payload: { employeeId: value, } })
        }

        dispatch({
          type: 'pos/setUtil',
          payload: {
            kodeUtil: 'barcode',
            infoUtil: 'Product',
          },
        })
      }
      else if ( kodeUtil == 'service' ) {
        if ( value ) {
          dispatch({
            type: 'pos/getService',
            payload: { serviceId: value,
              listByCode: (localStorage.getItem('cashier_trans') === null ? [] : localStorage.getItem('cashier_trans')),
              curQty: curQty,
              memberCode: memberInformation.memberCode,
              curRecord: curRecord,}
          })
        }
      }
      else if ( kodeUtil == 'discount' || kodeUtil == 'disc1' || kodeUtil == 'disc2' || kodeUtil == 'disc3' || kodeUtil === 'quantity' ) {
        console.log('quantity value', value)
        if ( value ) {
          dispatch({ type: 'pos/editPayment', payload:{ value: value, effectedRecord: effectedRecord, kodeUtil: kodeUtil } })
        }
        dispatch({
          type: 'pos/setUtil',
          payload: {
            kodeUtil: 'barcode',
            infoUtil: 'Product',
          },
        })
      }

      if ( kodeUtil != 'refund' ) {
        setCurBarcode('', 1)
      }
      else {
        if ( value ) {
          setCurBarcode('', value * -1)
        }
        else {
          setCurBarcode('', 1)
        }
      }
    }
  }

  const onChange = (e) => {
    const {value} = e.target
    if (value != '+') {
      setCurBarcode(value, curQty)
    }
  }

  const handleKeyDown = (e) => {
    const { value } = e.target

    if (e.keyCode in keyShortcut) {
      keyShortcut[e.keyCode] = true

      if ( keyShortcut[17] && keyShortcut[18] && keyShortcut[77] ) { //shortcut member (Ctrl + Alt + M)
        dispatch({
          type: 'pos/setUtil',
          payload: {
            kodeUtil: 'member',
            infoUtil: 'Member',
          },
        })
      }
      else if ( keyShortcut[17] && keyShortcut[18] && keyShortcut[72] ) { //shortcut untuk Help (Ctrl + ALT + H)
        console.log('shortcut key help');
        dispatch({ type: 'app/shortcutKeyShow' })
      }
      else if ( keyShortcut[17] && keyShortcut[18] && keyShortcut[67] ) { //shortcut mechanic (Ctrl + Alt + C)
        dispatch({
          type: 'pos/setUtil',
          payload: {
            kodeUtil: 'mechanic',
            infoUtil: 'Mechanic',
          },
        })
      }
      else if ( keyShortcut[17] && keyShortcut[16] && keyShortcut[52] ) { //shortcut discount nominal (Ctrl + Shift + 4)
        handleDiscount(4, value)
      }
      else if ( keyShortcut[17] && keyShortcut[16] && keyShortcut[49] ) { //shortcut discount 1 (Ctrl + Shift + 1)
        handleDiscount(1, value)
      }
      else if ( keyShortcut[17] && keyShortcut[16] && keyShortcut[50] ) { //shortcut discount 2 (Ctrl + Shift + 2)
        handleDiscount(2, value)
      }
      else if ( keyShortcut[17] && keyShortcut[16] && keyShortcut[51] ) { //shortcut discount 3 (Ctrl + Shift + 3)
        handleDiscount(3, value)
      }
      else if ( keyShortcut[17] && keyShortcut[75] ) { //shortcut modified quantity (Ctrl + Shift + Q)
        console.log('handle quantity')
        handleDiscount(5, value)
      }
      else if ( keyShortcut[17] && keyShortcut[16] && keyShortcut[76] ) { //shortcut untuk Closing Cashier (Ctrl + Shift + L)
        let curData = (localStorage.getItem('cashier_trans') === null ? [] : JSON.parse(localStorage.getItem('cashier_trans')))

        let curQueue1 = (localStorage.getItem('queue1') === null ? [] : JSON.parse(localStorage.getItem('queue1')))
        let curQueue2 = (localStorage.getItem('queue2') === null ? [] : JSON.parse(localStorage.getItem('queue2')))
        let curQueue3 = (localStorage.getItem('queue3') === null ? [] : JSON.parse(localStorage.getItem('queue3')))

        keyShortcut[17] = false
        keyShortcut[16] = false
        keyShortcut[76] = false

        if ( JSON.stringify(curData) == '[]' && JSON.stringify(curQueue1) == '[]' && JSON.stringify(curQueue2) == '[]' && JSON.stringify(curQueue3) == '[]' ) {
          Modal.confirm({
            title: 'Are you sure want to close this Cashier?',
            content: 'This Operation cannot be undone...!',
            onOk() {
              dispatch({
                type: 'pos/setCloseCashier',
                payload: {
                  total: 0,
                  totalCreditCard: 0,
                  status: "C",
                  cashierNo: curCashierNo,
                  shift: curShift,
                  transDate: getDate(3),
                }
              })

              dispatch({
                type: 'pos/showShiftModal',
              })
            },
            onCancel() {},
          })
        }
        else {
          Modal.warning({
            title: 'Warning',
            content: 'Cannot closed cashier when having transaction...!',
          })
        }
      }
      else if ( keyShortcut[17] && keyShortcut[16] && keyShortcut[85] ) { //shortcut for insertQueue (Ctrl + Shift + U)
        keyShortcut[17] = false
        keyShortcut[16] = false
        keyShortcut[85] = false

        let arrayProd = []

        const memberUnit = localStorage.getItem('memberUnit') ? localStorage.getItem('memberUnit') : ''
        const lastMeter = localStorage.getItem('lastMeter') ? localStorage.getItem('lastMeter') : ''
        const cashier_trans = localStorage.getItem('cashier_trans') ? JSON.parse(localStorage.getItem('cashier_trans')) : []

        let listByCode = (localStorage.getItem('member') === null ? [] : localStorage.getItem('member'))
        let memberInformation
        if ( JSON.stringify(listByCode) == "[]" ) {
          memberInformation = listByCode.slice()
        }
        else {
          memberInformation = listByCode
        }
        const memberInfo = memberInformation ? JSON.parse(memberInformation)[0] : []

        //start-mechanicInfo
        const mechanicInfo = localStorage.getItem('mechanic') ? JSON.parse(localStorage.getItem('mechanic')) : []
        const mechanic = mechanicInfo[0]
        //end-mechanicInfo

        arrayProd.push({
            cashier_trans: cashier_trans,
            memberCode: memberInfo.memberCode,
            memberName: memberInfo.memberName,
            point: memberInfo.point,
            memberUnit: memberUnit,
            lastMeter: lastMeter,
            mechanicCode: mechanic.mechanicCode,
            mechanicName: mechanic.mechanicName
        })
        if ( localStorage.getItem('cashier_trans') === null ) {
          Modal.warning({
            title: 'Warning',
            content: 'Transaction Not Found...!',
          })
        }
        else {
          if ( localStorage.getItem('queue1') === null ) {
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
                queue: '1',
              },
            })
          }
          else if ( localStorage.getItem('queue2') === null ) {
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
                queue: '2',
              },
            })
          }
          else if ( localStorage.getItem('queue3') === null ) {
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
                queue: '3',
              },
            })
          }
          else {
            Modal.warning({
              title: 'Warning',
              content: 'Queues are full, Please finish previous transaction first...!',
            })
          }
        }
      }
    }
    else if ( e.keyCode == '113' ) { //Tombol F2 untuk memilih antara product atau service
      console.log('F2', kodeUtil)
      if ( kodeUtil == 'barcode' ) {
        dispatch({
          type: 'pos/setUtil',
          payload: {
            kodeUtil: 'service',
            infoUtil: 'Service',
          },
        })
      }
      else if ( kodeUtil == 'service' || kodeUtil == 'member' || kodeUtil == 'mechanic' ) {
        dispatch({
          type: 'pos/setUtil',
          payload: {
            kodeUtil: 'barcode',
            infoUtil: 'Product',
          },
        })
      }
    }
    else if ( e.keyCode == '118' ) { //Tombol F7 untuk void/hapus item
      handleVoid(value)
    }
    else if ( e.keyCode == '120' ) { //Tombol F9 untuk void/hapus all item
      Modal.confirm({
        title: 'Are you sure want to void/delete all items?',
        content: 'This Operation cannot be undone...!',
        onOk() {
          localStorage.removeItem('cashier_trans')
          localStorage.removeItem('service_detail')
          dispatch({
            type: 'pos/setCurTotal',
          })
        },
        onCancel() {},
      })
    }
    else if ( e.keyCode == '115' ) { //Tombol F4 untuk refund
      dispatch({
        type: 'pos/setUtil',
        payload: {
          kodeUtil: 'refund',
          infoUtil: 'Input Qty Refund',
        },
      })
    }
  }

  const dataTrans = () => {
    let product = localStorage.getItem('cashier_trans') === null ? [] : JSON.parse(localStorage.getItem('cashier_trans'))
    return (product)
  }

  const dataService = () => {
    let service = localStorage.getItem('service_detail') === null ? [] : JSON.parse(localStorage.getItem('service_detail'))
    return (service)
  }

  const hdlPopoverClose = () => {
    dispatch({ type: 'pos/modalPopoverClose' })
  }
  const hdlPopoverVisibleChange = () => {
    dispatch({ type: 'pos/modalPopoverShow' })
  }
  const hdlTableRowClick = (record) => {
    dispatch({
      type: 'pos/chooseMemberUnit',
      payload: { policeNo: record.policeNo },
    })
    localStorage.setItem('memberUnit',record.policeNo)
    dispatch({
      type: 'payment/setPoliceNo',
      payload: { policeNo: record.policeNo },
    })
    dispatch({
      type: 'payment/setLastMeter',
      payload: { policeNo: record.policeNo },
    })
  }

  const columns = [{
    title: 'Unit No',
    dataIndex: 'policeNo',
    key: 'policeNo',
    width: 100,
  }, {
    title: 'Merk',
    dataIndex: 'merk',
    key: 'merk',
    width: 250,
  }, {
    title: 'Model',
    dataIndex: 'model',
    key: 'model',
    width: 200,
  }]
  const titlePopover = (
    <Row>
      <Col span={8}>Choose Member Unit</Col>
      <Col span={1} offset={15}>
        <Button shape="circle" icon="close-circle" size="small"
                onClick={() => hdlPopoverClose()}/>
      </Col>
    </Row>
  )
  const contentPopover = (
    <div>
        <Table
          columns={columns}
          dataSource={listUnit ? listUnit : listLovMemberUnit}
          size='small'
          bordered
          pagination={{ pageSize: 5 }}
          onRowClick={(record) => hdlTableRowClick(record)}
          locale = {{
            emptyText: 'No Unit',
          }}
        />
    </div>
  )
/*===================BEGIN=====================*/
/*=================LAST KM=====================*/
const CustomizedForm = Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      lastMeter: {
        ...props.lastMeter,
        value: props.lastMeter.value,
      },
    };
  },
  onValuesChange(_, values) {
    localStorage.setItem('lastMeter', memberUnitInfo.unitNo === "" ? 0 : values.lastMeter ? values.lastMeter : 0)
    dispatch({
      type: 'payment/setLastMeter',
      payload: {
        lastMeter: memberUnitInfo.unitNo ? lastMeter : 0,
        policeNo: memberUnitInfo.unitNo ? memberUnitInfo.unitNo : memberUnitInfo
      },
    })
  },
})((props) => {
  const { getFieldDecorator } = props.form;
  return (
      <FormItem label="KM" {...formItemLayout}>
        {getFieldDecorator('lastMeter', {
          rules: [{ required: true, message: 'Required' }],
        })(<Input />)}
      </FormItem>
  );
});

class LastMeter extends React.Component {
  state = {
    fields: {
      lastMeter: {
        value: lastMeter,
      },
    },
  };
  handleFormChange = (changedFields) => {
    this.setState({
      fields: { ...this.state.fields, ...changedFields },
    });
  }
  render() {
    const fields = this.state.fields;
    return (
      <div>
        <CustomizedForm {...fields} onChange={this.handleFormChange} />
      </div>
    );
  }
}
/*=================LAST KM=====================*/
/*===================END=======================*/

  return (
    <div className="content-inner">
      {modalShiftVisible && <ModalShift {...modalShiftProps} />}

      <Row gutter={24} style={{ marginBottom: 16 }}>
        <Col lg={18} md={20}>
          <Card bordered={false} bodyStyle={{ padding: 0, margin: 0 }} noHovering>
            <Form layout="vertical">
              {/*<Input placeholder="Name" disabled style={{ marginBottom: 8}}/>*/}
              {infoUtil && <Tag color="green" style={{ marginBottom: 8}}> {infoUtil} </Tag> }
              <Input size="large" autoFocus={true} value={curBarcode} style={{ fontSize: 24, marginBottom: 8 }}
                     placeholder="Search Code Here" onKeyDown={(e) => handleKeyDown(e)} onChange={(e) => onChange(e)}
                     onKeyPress={(e) => handleKeyPress(e)} />
            </Form>

            <ButtonGroup>
              <Button type="primary" size="large" icon="down-square-o" onClick={handleMemberBrowse}>Member</Button>
              <Tooltip title="add Member">
                <Button type="primary" size="large" icon="plus-square-o" className="button-width02">
                </Button>
              </Tooltip>
            </ButtonGroup>
            {modalMemberVisible && <Browse {...modalMemberProps} />}

            <Button type="primary" size="large" icon="down-square-o" className="button-width01"
                    onClick={handleMechanicBrowse}>Mechanic
            </Button>
            {modalMechanicVisible && <Browse {...modalMechanicProps} />}

            <ButtonGroup>
              <Button type="primary" size="large" icon="down-square-o" onClick={handleProductBrowse}>Product</Button>
              <Tooltip title="add Product">
                <Button type="primary" size="large" icon="plus-square-o" className="button-width02">
                </Button>
              </Tooltip>
            </ButtonGroup>
            {modalProductVisible && <Browse {...modalProductProps} />}

            <Button type="primary" size="large" icon="down-square-o" className="button-width01"
                    onClick={handleServiceBrowse}>Service
            </Button>
            {modalServiceVisible && <Browse {...modalServiceProps} />}

            <Button type="primary" size="large" icon="down-square-o" className="button-width01"
                    onClick={handleQueue}>Queue
            </Button>
            {modalQueueVisible && <Browse {...modalQueueProps} />}


            <Form layout="inline">
              <Row>
                <Col lg={{ span: 10 }}>
                  <FormItem label="Qty">
                    <Input value={totalQty} style={{ fontSize:24, marginBottom: 8}} />
                  </FormItem>
                </Col>
                <Col xs={{ span: 5, offset: 2 }} lg={{ span: 10, offset: 4 }}>
                  <FormItem label="Total">
                    <Input value={totalPayment} style={{ fontSize:24, marginBottom: 8}} />
                  </FormItem>
                </Col>
              </Row>
            </Form>
            <Tabs defaultActiveKey="1">
              <TabPane tab="Product" key="1">
                <Table
                rowKey={(record, key) => key}
                pagination={{ pageSize: 5 }}
                bordered={true}
                size="small"
                scroll={{ x: '130%' }}
                locale = {{
                  emptyText: 'Your Payment List',
                }}
                columns={[
                  {
                    title: 'No',
                    dataIndex: 'no',
                  },
                  {
                    title: 'Code',
                    dataIndex: 'code',
                  },
                  {
                    title: 'Product Name',
                    dataIndex: 'name',
                  },
                  {
                    title: 'Q',
                    dataIndex: 'qty',
                  },
                  {
                    title: 'Price',
                    dataIndex: 'price',
                  },
                  {
                    title: 'Disc1(%)',
                    dataIndex: 'disc1',
                  },
                  {
                    title: 'Disc2(%)',
                    dataIndex: 'disc2',
                  },
                  {
                    title: 'Disc3(%)',
                    dataIndex: 'disc3',
                  },
                  {
                    title: 'Disc',
                    dataIndex: 'discount',
                  },
                  {
                    title: 'Total',
                    dataIndex: 'total',
                  },
                ]}
                onRowClick={(record)=>modalEditPayment(record)}
                dataSource={dataTrans()}
                style={{ marginBottom: 16 }}
              />
                {modalPaymentVisible && <Browse {...modalPaymentProps} />}
              </TabPane>
              <TabPane tab="Service" key="2"><Table
                rowKey={(record, key) => key}
                pagination={{ pageSize: 5 }}
                bordered={true}
                size="small"
                scroll={{ x: '130%' }}
                locale = {{
                  emptyText: 'Your Payment List',
                }}
                columns={[
                  {
                    title: 'No',
                    dataIndex: 'no',
                  },
                  {
                    title: 'Code',
                    dataIndex: 'code',
                  },
                  {
                    title: 'Service Name',
                    dataIndex: 'name',
                  },
                  {
                    title: 'Q',
                    dataIndex: 'qty',
                  },
                  {
                    title: 'Price',
                    dataIndex: 'price',
                  },
                  {
                    title: 'Disc1(%)',
                    dataIndex: 'disc1',
                  },
                  {
                    title: 'Disc2(%)',
                    dataIndex: 'disc2',
                  },
                  {
                    title: 'Disc3(%)',
                    dataIndex: 'disc3',
                  },
                  {
                    title: 'Disc',
                    dataIndex: 'discount',
                  },
                  {
                    title: 'Total',
                    dataIndex: 'total',
                  },
                ]}
                onRowClick={(record)=>modalEditService(record)}
                dataSource={dataService()}
                style={{ marginBottom: 16 }}
              />
                {modalServiceListVisible && <Browse {...ModalServiceListProps} />}</TabPane>
            </Tabs>
          </Card>
        </Col>
        <Col lg={6} md={4}>
          <Collapse defaultActiveKey={['1','2']}>
            <Panel header="Member Info" key="1">
              <Form layout="horizontal">
                <FormItem label="Name" {...formItemLayout}>
                  <Input  value={memberInformation.memberName} disabled />
                </FormItem>
                <FormItem label='Unit' hasFeedback {...formItemLayout}>
                  <Col span={20}>
                    <Input value={ memberUnitInfo.unitNo } />
                  </Col>
                  <Col span={4}>
                    <Popover title={titlePopover}
                             content={contentPopover}
                             visible={visiblePopover}
                             onVisibleChange={() => hdlPopoverVisibleChange()}
                             placement="left" trigger='click'>
                      <Button type='primary' icon="down-square-o" onClick={hdlUnitClick}>
                      </Button>
                    </Popover>
                  </Col>
                </FormItem>
                  <LastMeter />
                <FormItem label="Code" {...formItemLayout}>
                  <Input  value={memberInformation.memberCode} disabled />
                </FormItem>
                <FormItem label="Point" {...formItemLayout}>
                  <Input value={memberInformation.point} disabled />
                </FormItem>
              </Form>
            </Panel>
            <Panel header="Mechanic Info" key="2">
              <Form layout="horizontal">
                <FormItem label="Name" {...formItemLayout}>
                  <Input value={mechanicInformation.employeeName ?  mechanicInformation.employeeName : mechanicInformation.mechanicCode} disabled />
                </FormItem>
                <FormItem label="ID" {...formItemLayout}>
                  <Input value={mechanicInformation.employeeId ?  mechanicInformation.employeeId : mechanicInformation.mechanicName} disabled />
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
                <Col span={12} style={{padding:12}}>
                  <Row>
                    <Col xs={24} sm={24} md={16} lg={16} xl={18}>
                      <Button style={{ fontWeight: 400, fontSize: 'large', width: '200%', height: 40, color: '#000000', background: '#8fc9fb' }} className="margin-right" width="100%" onClick={handlePayment}> Payment </Button>
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

      <Row>
        <Card bordered={false} title="Information">
          <Row gutter={32}>
            <Col xs={24} sm={24} md={4} lg={4} xl={4}> Cashier : {curCashierNo} </Col>
            <Col xs={24} sm={24} md={4} lg={4} xl={4}> Name : {user.userid} </Col>
            <Col xs={24} sm={24} md={4} lg={4} xl={4}> Shift : {curShift} </Col>
            <Col xs={24} sm={24} md={4} lg={4} xl={4}> Date : {getDate(1)} </Col>
            <Col xs={24} sm={24} md={4} lg={4} xl={4}> Time : {setTime()} </Col>
          </Row>
        </Card>
      </Row>
    </div>
  )
}


Pos.propTypes = {
  pos: PropTypes.object,
  unit: PropTypes.object,
  app: PropTypes.object,
  position: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}


export default connect(({ pos, unit, app, position, loading }) => ({ pos, unit, app, position, loading }))(Pos)

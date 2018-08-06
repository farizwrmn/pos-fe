import React from 'react'
import PropTypes from 'prop-types'
import PaymentList from './PaymentList'
import ServiceList from './ServiceList'

const Browse = ({ location, onChange, dispatch, pos, loading, DeleteItem, onChooseItem, totalItem, onChangeTotalItem, ...modalProps }) => {
  const { pagination, itemPayment, itemService, modalType, isMotion } = pos
  let title = ''
  if (modalType === 'modalPayment') {
    title = `Edit ${itemPayment.code} - ${itemPayment.name}`
  } else if (modalType === 'modalService') {
    title = `Edit ${itemService.code} - ${itemService.name}`
  } else {
    title = ''
  }
  const listProps = {
    pagination,
    location,
    width: '45%',
    title,
    item: modalType === 'modalPayment' ? itemPayment : {},
    itemService: modalType === 'modalService' ? itemService : {},
    isMotion,
    totalItem,
    onChooseItem (item) {
      onChooseItem(item)
    },
    DeleteItem (item) {
      DeleteItem(item)
    },
    onChangeTotalItem (e) {
      onChangeTotalItem(e)
    },
    ...modalProps
  }
  return (
    <div>
      {(modalType === 'modalPayment') && <PaymentList {...listProps} />}
      {(modalType === 'modalService') && <ServiceList {...listProps} />}
    </div>
  )
}

Browse.propTypes = {
  pos: PropTypes.object,
  location: PropTypes.object,
  loading: PropTypes.object,
  onChangeTotalItem: PropTypes.func.isRequired,
  DeleteItem: PropTypes.func.isRequired,
  onChooseItem: PropTypes.func.isRequired,
  totalItem: PropTypes.string
}

export default Browse

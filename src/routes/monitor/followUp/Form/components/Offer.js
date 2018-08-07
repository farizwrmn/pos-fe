import React from 'react'
import { Button } from 'antd'
import { DataQuery } from 'components'
import styles from './index.less'
import ModalAcceptOffer from './ModalAcceptOffer'
import ModalDenyOffer from './ModalDenyOffer'

const { Promo, Product, Service } = DataQuery

const Offer = ({
  memberInfo,
  nextStep,
  modalAcceptOffer,
  modalDenyOffer,
  showModalPending,
  showModalAcceptOffer,
  showModalDenyOffer,
  onSubmitAcceptOffer,
  onSubmitDenyOffer
}) => {
  const tableProps = {
    isModal: false,
    enableFilter: false,
    enableChoosePromoDetail: false,
    showPagination: false
  }

  const modalAcceptOfferProps = {
    title: 'Accept Offering',
    visible: modalAcceptOffer,
    onSubmitAcceptOffer,
    onCancel () {
      showModalAcceptOffer()
    }
  }

  const modalDenyOfferProps = {
    title: 'Deny Offering',
    visible: modalDenyOffer,
    onSubmitDenyOffer,
    onCancel () {
      showModalDenyOffer()
    }
  }

  return (
    <div>
      {modalAcceptOffer && <ModalAcceptOffer {...modalAcceptOfferProps} />}
      {modalDenyOffer && <ModalDenyOffer {...modalDenyOfferProps} />}
      <div className={styles.tableWrapper}>
        <h3>Current Promo</h3>
        <Promo {...tableProps} />
      </div>
      <div className={styles.tableWrapper}>
        <h3>Products</h3>
        <Product {...tableProps} />
      </div>
      <div className={styles.tableWrapper}>
        <h3>Services</h3>
        <Service {...tableProps} />
      </div>
      {memberInfo.status !== '1' &&
        <div>
          <Button className="button-right-side" size="large" onClick={showModalAcceptOffer}>Accept</Button>
          <Button className="button-right-side" size="large" onClick={showModalDenyOffer}>Deny</Button>
          <Button className="button-right-side" size="large" onClick={showModalPending}>Pending</Button>
        </div>
      }
      {
        memberInfo.status === '1' && <Button className="button-right-side" size="large" onClick={() => nextStep(3)}>Next</Button>
      }
    </div>
  )
}

export default Offer

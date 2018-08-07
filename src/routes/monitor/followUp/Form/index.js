import React from 'react'
import { Steps } from 'antd'
import { View, Call, ModalPending, Offer, ThankYou } from './components'

const Step = Steps.Step

const Form = ({ currentStep, memberInfo, listTransactionDetail, updateHeaderStatus, modalFeedback,
  currentFeedback, showModalFeedback, submitFeedbackItem, itemFeedbacks, updateNextServiceAndCustomerSatisfaction,
  nextStep, modalPending, modalAcceptOffer, modalDenyOffer, showModalPending, showModalAcceptOffer,
  showModalDenyOffer, onSubmitPending, onSubmitAcceptOffer, onSubmitDenyOffer }) => {
  let details = listTransactionDetail.map((x) => {
    return {
      id: x.id,
      type: x.typeCode === 'p' ? 'Product' : 'Service',
      promo: x.bundlingName,
      item: x.productName || x.serviceName,
      qty: x.qty,
      total: ((x.qty * x.sellingPrice) - x.discount - (x.disc1 / 100) - (x.disc2 / 100) - (x.disc3 / 100)).toLocaleString()
    }
  })

  let viewProps = {
    memberInfo,
    details,
    updateHeaderStatus
  }

  let callProps = {
    memberInfo,
    details,
    modalFeedback,
    currentFeedback,
    showModalFeedback,
    submitFeedbackItem,
    itemFeedbacks,
    updateNextServiceAndCustomerSatisfaction,
    nextStep,
    showModalPending
  }

  let offerProps = {
    memberInfo,
    nextStep,
    modalAcceptOffer,
    modalDenyOffer,
    showModalPending,
    showModalAcceptOffer,
    showModalDenyOffer,
    onSubmitAcceptOffer,
    onSubmitDenyOffer
  }

  const thankyouProps = {
    memberInfo
  }

  const steps = [
    { key: 0, title: 'View', content: <View {...viewProps} /> },
    { key: 1, title: 'Call', content: <Call {...callProps} /> },
    { key: 2, title: 'Offering', content: <Offer {...offerProps} /> },
    { key: 3, title: 'Thank you', content: <ThankYou {...thankyouProps} /> }
  ]

  const modalProps = {
    title: 'Pending',
    visible: modalPending,
    onSubmitPending,
    onCancel () {
      showModalPending()
    }
  }

  const changeStep = (key) => {
    if (memberInfo.status === '2' || memberInfo.status === '3') {
      if (memberInfo.customerSatisfaction) {
        if (key > 2) return false
      } else if (key > 1) return false
    } else if (memberInfo.status === '0' || memberInfo.status === '4') return false
    nextStep(key)
  }

  return (
    <div>
      {modalPending && <ModalPending {...modalProps} />}
      <Steps current={currentStep}>
        {steps.map(x => <Step onClick={() => changeStep(x.key)} key={x.key} title={x.title} />)}
      </Steps>
      <div className="steps-content">{steps[currentStep].content}</div>
    </div>
  )
}

export default Form

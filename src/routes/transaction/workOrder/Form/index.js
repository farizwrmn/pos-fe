import React from 'react'
import { Steps } from 'antd'

const Step = Steps.Step

const Form = ({ currentStep }) => {
  const steps = [
    { key: 0, title: 'Workorder', content: <div /> },
    { key: 1, title: 'Custom Field', content: <div /> },
    { key: 2, title: 'View', content: <div /> }
  ]

  return (
    <div>
      <Steps current={currentStep}>
        {steps.map(x => <Step key={x.key} title={x.title} />)}
      </Steps>
      <div className="steps-content">{steps[currentStep].content}</div>
    </div>
  )
}

export default Form

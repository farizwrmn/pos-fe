import React from 'react'
import { Steps } from 'antd'
import { WO, CustomFields } from './components'

const Step = Steps.Step

const Form = ({ nextStep, currentStep, ...formProps }) => {
  const steps = [
    { key: 0, title: 'Workorder', content: <WO {...formProps} /> },
    { key: 1, title: 'Custom Field', content: <CustomFields {...formProps} /> }
  ]

  const changeStep = (key) => {
    if (key !== 1) {
      nextStep(key)
    }
  }

  return (
    <div>
      <Steps current={currentStep}>
        {steps.map(x => <Step onClick={() => changeStep(x.key)} key={x.key} title={x.title} />)}
      </Steps>
      <div className="steps-content" style={{ marginTop: 20 }}>{steps[currentStep].content}</div>
    </div>
  )
}

export default Form

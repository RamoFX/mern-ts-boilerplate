import React, { FC } from 'react'

import './style.scss'

import MainLayout from 'layout/MainLayout'

import 'helpers/basic'
import 'helpers/dom'



const Root: FC = () => {
  const appMode = 'normal'

  return (
    <div className="root">
      { appMode == 'normal' && <MainLayout /> }
    </div>
  )
}



export default Root

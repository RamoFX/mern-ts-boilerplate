import React, { FC, useState, useEffect } from 'react'

import './style.scss'



const Root: FC = () => {
  // Helpers
  const path = (base: string, ...items: string[]): string => {
    return [base, ...items].join('/')
  }

  // Main component
  const editFilePath = 'mern-ts-boilerplate/frontend/source/app/ui/main/Root/index.tsx'

  type TError = null | {message: string}
  const [error, setError] = useState<TError>(null)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState('')

  const apiRoot = 'http://localhost:8079/api'

  useEffect(() => {
    fetch(path(apiRoot, 'dummy'))
      .then( response => response.json() )
      .then( data => {
        setLoading(false)
        setData(JSON.stringify(data))
      } )
      .catch( error => {
        setLoading(false)
        setError(error)
      } )
  }, [])

  return <div className='root'>
      <div className='top-bar'></div>
      <div className='content'>
        <span>Edit <pre>{ editFilePath }</pre> to see the changes!</span>
        <span>Data from API: <pre>{ loading ? 'Fetching...' : error ? error!.message : data }</pre></span>
      </div>
    </div>
}



export default Root

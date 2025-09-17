import React from 'react'
import { getSessionDate } from "./getSessionDate";

function Logo() {
    return (
    <>
        <div className='logo' style={{marginLeft: '10px', marginRight: '35px'}}>BillBoard: {getSessionDate()}</div>
    </>
  )
}

export default Logo
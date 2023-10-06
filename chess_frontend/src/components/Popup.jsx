import React from 'react'
import { useSelector } from 'react-redux'

function Popup() {
    const popup = useSelector((state) => state.popup)
    
    return (
        popup && 
        <div className='px-12 py-3 absolute left-0 top-0 rounded-sm' style={{backgroundColor:popup.type==='success'?'#B2FFC8':'#FFDDDD'}}>
            <p className='font-mono' style={{color:popup.type==='success'?'1AAB00':'#F30000'}}>{popup.msg}</p>
        </div>
    )
}

export default Popup
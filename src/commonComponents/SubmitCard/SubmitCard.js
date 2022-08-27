import React, {useEffect, useState} from "react";
import { Row, Col, Modal, Button, Card} from "react-bootstrap";
import { ReactComponent as SuccessSvg } from "../../assets/images/icon_svg/success.svg";
import { ReactComponent as FailedSvg } from "../../assets/images/icon_svg/failed.svg";



const SubmitCard= ({showToast, onHide, isSuccess, message}) => {
    const [data, setData] = useState({
        isOnScreen: false,
        isOpen: true
    })

    useEffect(()=>{
        show();
        setTimeout(() => {
          hide();
        }, 3000);
    },[])

    // useEffect(()=>{
    //         if(!data.isOnScreen) {
    //             onHide()
    //         }
    // },[data.isOnScreen])

    const show = () => {
        setTimeout(() => {
            setData({
                ...data,
                isOnScreen: true,
            })
        }, 0);
    }

    const hide = () => {
        setData({
            ...data,
            isOnScreen: false,
            isOpen: false
        });
        onHide()
    }

    return (
        <div className="toastBox">
                <div className={
                    'toastWrapper ' +
                    (data?.isOnScreen ? 'slideIn fadeOut' : (data?.isOpen ? 'offScreen ' : 'hide ')) + " " +(isSuccess ? 'success' : 'failed')
                }>
                    <span className='card-body-paragraph'>{message}</span>
                </div>
            </div>
    )
}
export default SubmitCard;
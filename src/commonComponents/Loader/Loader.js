import React from "react";
import imgLoader from "../../assets/images/loader.gif";

const Loader = ({ scale, message, customStyle }) => {

  return (
    <div className={`text-center main-loader ${customStyle}`}>
      <div className="ripple">
        <img src={imgLoader} height={scale} alt="spinner" />&nbsp;
      </div>
      {message ? (
        <div className="loader-message">
          <span className="main-paragraph">{message}</span>
        </div>
      ) : null}
    </div>
  );
};

export default  Loader ;

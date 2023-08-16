import React from "react";

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  showConfirmButton,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="confirm-dialog">
      <div className="confirm-dialog-content">
        <h1>{title}</h1>
        <p style={{ whiteSpace: "pre-line" }}>{message}</p>
        <div className="btn-group">
          {showConfirmButton ? (
            <>
              <button className="btn" onClick={onCancel}>
                No
              </button>
              <button className="btn" onClick={onConfirm}>
                Yes
              </button>
            </>
          ) : 
          <button className='btn' onClick={onCancel}>Okay</button>}
        </div>
      </div>
    </div>
  );
}

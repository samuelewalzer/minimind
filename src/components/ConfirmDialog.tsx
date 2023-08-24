import { useEffect, useRef } from "react";

type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  message: string;
  showConfirmButton: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  showConfirmButton,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const confirmButtonRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      confirmButtonRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="confirm-dialog">
      <div className="confirm-dialog-content">
        <h1>{title}</h1>
        <p>{message}</p>
        <div className="btn-group">
          {showConfirmButton ? (
            <>
              <button className="btn" onClick={onCancel}>
                No
              </button>
              <button
                ref={confirmButtonRef}
                className="btn"
                onClick={onConfirm}
              >
                Yes
              </button>
            </>
          ) : (
            <button ref={confirmButtonRef} className="btn" onClick={onCancel}>
              Okay
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

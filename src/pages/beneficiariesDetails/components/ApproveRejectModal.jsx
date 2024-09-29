import React, { useState } from "react";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";

export default function ApproveRejectModal({
  type,
  closeModal,
  handleVerifyAPI,
  beneficiaryId,
  userId,
  verifyStatus,
}) {
  const [rejectionMessage, setRejectionMessage] = useState("");
  const [messageError, setMessageError] = useState(false);

  const getModalContent = () => {
    switch (type) {
      case "approve":
        return {
          message: "Are you sure you want to approve the case?",
          icon: <FaCheckCircle className="text-green-500 text-5xl" />,
          isRemarkRequired: false,
        };
      case "reject":
        return {
          message: "Are you sure you want to reject the case?",
          icon: <FaExclamationCircle className="text-red-500 text-5xl" />,
          isRemarkRequired: true,
        };
      case "dc-approve":
        return {
          message:
            "Once approved the payment request will be sent to the bank.",
          icon: <RiMoneyRupeeCircleFill className="text-yellow-500 text-5xl" />,
          isRemarkRequired: false,
        };
      default:
        return null;
    }
  };

  const modalContent = getModalContent(beneficiaryId, userId);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-center mb-4">{modalContent.icon}</div>
        <p className="text-center mb-8 text-xl font-semibold">
          {modalContent.message}
        </p>
        {modalContent.isRemarkRequired && (
          <div className="mb-4">
            <textarea
              placeholder="Write remark*"
              className="border border-gray-300 rounded w-full p-2 outline-blue-600"
              value={rejectionMessage}
              onChange={(e) => {
                setRejectionMessage(e.target.value.replace(/\s+/g, " "));
              }}
            />
            {messageError && (
              <div className="text-xs text-red-500">Message is required</div>
            )}
          </div>
        )}
        <div className="flex gap-5 justify-between w-full">
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 w-full"
            onClick={() => closeModal()}
          >
            Back
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full"
            onClick={() => {
              if (verifyStatus === "0" && !rejectionMessage) {
                setMessageError(true);
                return;
              }
              handleVerifyAPI(
                beneficiaryId,
                verifyStatus,
                userId,
                rejectionMessage
              );
              closeModal();
            }}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { IoInformationCircle } from "react-icons/io5";

export default function ConfirmationModal({ closeModal, handleConfirm }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-center mb-4">
          <IoInformationCircle className="text-yellow-500 text-6xl" />
        </div>
        <p className="text-center mb-8 text-xl font-semibold">
          Are you sure you want to submit the form? Once submitted, bulk edits
          to disbursement details will no longer be possible. However, you will
          still be able to edit details for individual beneficiaries.
        </p>
        <div className="flex gap-5 justify-between w-full">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 w-full"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full"
            onClick={() => {
              handleConfirm();
              closeModal();
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

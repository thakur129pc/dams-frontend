import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CONSTANTS from "../../../constants.json";
import { RiFileExcel2Line } from "react-icons/ri";

const VillageDetails = ({
  khatauni,
  villageId,
  villageName,
  villageArea,
  villageNameHindi,
  totalBeneficiaries,
}) => {
  const navigate = useNavigate();
  // User role
  const { userRole } = useSelector((state) => state.userDetailsSlice.details);

  return (
    <div className="border border-gray-300 p-4 rounded-lg shadow-xl bg-white flex justify-between flex-col">
      <div>
        <div className="text-lg font-semibold text-gray-700 mb-2">
          {villageName} / {villageNameHindi}
        </div>
        <div className="text-gray-600 mb-1">
          <span className="font-medium">{CONSTANTS.TOTAL_KHATAUNI}:</span>{" "}
          {khatauni}
        </div>
        <div className="text-gray-600 mb-1">
          <span className="font-medium">{CONSTANTS.TOTAL_AREA}:</span>{" "}
          {villageArea}
        </div>
        <div className="text-gray-600 mb-2">
          <span className="font-medium">{CONSTANTS.TOTAL_BENEFICIARIES}:</span>{" "}
          {totalBeneficiaries}
        </div>
      </div>
      <div className="flex justify-between flex-wrap gap-2 items-center w-full text-xs">
        {/* View details */}
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 shadow-lg rounded-sm"
          onClick={() =>
            navigate(
              `/beneficiaries-list/${villageId}/${villageName}/${totalBeneficiaries}`
            )
          }
        >
          {CONSTANTS.BUTTON.VIEW_DETAILS}
        </button>
        {/* Upload data */}
        {userRole === "0" && (
          <button
            className="bg-green-500 rounded-sm hover:bg-green-600 text-white px-2 py-1 flex items-center gap-1 shadow-lg"
            onClick={() => navigate(`/upload-beneficiaries/${villageId}`)}
          >
            <RiFileExcel2Line size={14}/>
            {CONSTANTS.BUTTON.UPLOAD_DATA}
          </button>
        )}
      </div>
    </div>
  );
};

VillageDetails.propTypes = {
  villageNameHindi: PropTypes.string,
  khatauni: PropTypes.number.isRequired,
  villageId: PropTypes.string.isRequired,
  villageName: PropTypes.string.isRequired,
  villageName: PropTypes.string.isRequired,
  totalBeneficiaries: PropTypes.number.isRequired,
};

export default VillageDetails;

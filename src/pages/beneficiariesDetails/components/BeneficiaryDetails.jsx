import React from "react";
import CONSTANTS from "../../../constants.json";
import { CustomizeString } from "../../../utils/SeprateString";

const BeneficiaryDetails = ({ details }) => {
  const {
    beneficiaryName,
    khasraNumber,
    acquiredKhasraNumber,
    areaVariety,
    acquiredRakbha,
    beneficiaryShare,
    landPricePerSqMt,
    acquiredBeneficiaryShare,
  } = details;
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-gray-700">
        <div>
          <div className="font-bold">{CONSTANTS.BENEFICIARY_NAME}</div>
          <div className="text-gray-600">{beneficiaryName}</div>
        </div>

        <div>
          <div className="font-bold">{CONSTANTS.BENEFICIARY_SHARE}</div>
          <div className="text-gray-600">{beneficiaryShare}</div>
        </div>

        <div>
          <div className="font-bold">{CONSTANTS.KHASRA_NUMBER}</div>
          <div className="text-gray-600">{CustomizeString(khasraNumber)}</div>
        </div>

        <div>
          <div className="font-bold">{CONSTANTS.ACQUIRED_KHASRA_NUMBER}</div>
          <div className="text-gray-600">
            {CustomizeString(acquiredKhasraNumber)}
          </div>
        </div>

        <div>
          <div className="font-bold">{CONSTANTS.AREA_VARIETY}</div>
          <div className="text-gray-600">{CustomizeString(areaVariety)}</div>
        </div>

        <div>
          <div className="font-bold">{CONSTANTS.ACQUIRED_RAKBA}</div>
          <div className="text-gray-600">{CustomizeString(acquiredRakbha)}</div>
        </div>

        <div>
          <div className="font-bold">
            {CONSTANTS.ACQUIRED_BENEFICIARY_SHARE}
          </div>
          <div className="text-gray-600">{acquiredBeneficiaryShare}</div>
        </div>

        <div>
          <div className="font-bold">{CONSTANTS.LAND_PRICE_PER_SQ_MT}</div>
          <div className="text-gray-600">{landPricePerSqMt}</div>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryDetails;

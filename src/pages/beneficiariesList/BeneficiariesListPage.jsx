import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { groupByKhatauni } from "../../utils/filterGroupSearch";
import toast from "react-hot-toast";
import CONSTANTS from "../../constants.json";
import { RiFileExcel2Line } from "react-icons/ri";
import Pagination from "../../components/Pagination";
import { getVillageBeneficiariesList } from "../../redux/apis/beneficiariesAPI";
import { SeprateString } from "../../utils/SeprateString";

const BeneficiariesListPage = () => {
  const [allCheckbox, setAllCheckbox] = useState(false);
  const [paginatedData, setPaginatedData] = useState([]);
  const [selectedKhatauni, setSelectedKhatauni] = useState([]);
  const [groupedBeneficiaries, setGroupedBeneficiaries] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { villageId, villageName, totalBeneficiaries } = useParams();
  const { userRole } = useSelector((state) => state.userDetailsSlice.details);

  const beneficiaryList = useSelector(
    (state) => state.beneficiariesListSlice.villageBeneficiaries
  );

  // To handle khatauni check
  const handleKhatauniCheck = (event) => {
    if (event.checked) {
      const khatauniArray = Object.keys(groupedBeneficiaries)?.map(
        (khatauni) => khatauni
      );
      if (khatauniArray.length === selectedKhatauni.length + 1) {
        setAllCheckbox(true);
      }
      setSelectedKhatauni([...selectedKhatauni, event.value]);
    } else {
      let updatedArray = selectedKhatauni.filter((num) => num !== event.value);
      setSelectedKhatauni(updatedArray);
      setAllCheckbox(false);
    }
  };

  // To handle select-all checkbox
  const handleAllKhatauniCheck = (event) => {
    if (event.checked) {
      const khatauniArray = Object.keys(groupedBeneficiaries)?.map(
        (khatauni) => khatauni
      );
      setSelectedKhatauni([...khatauniArray]);
      setAllCheckbox(true);
    } else {
      setAllCheckbox(false);
      setSelectedKhatauni([]);
    }
  };

  // To handle add details button
  const handleAddDetails = () => {
    const khatauni = selectedKhatauni.join("-");
    // villageName to be changed to villageId
    navigate(`/add-disbursement/${villageName}/${khatauni}`);
  };

  // To handle add details button
  const setDisbursementStatus = (status) => {
    if (status == "1") {
      return <div className="text-green-500">(Added)</div>;
    } else {
      return <div className="text-red-500">(Pending)</div>;
    }
  };

  useEffect(() => {
    setGroupedBeneficiaries(groupByKhatauni(beneficiaryList));
  }, [beneficiaryList]);

  useEffect(() => {
    // Village beneficiaries API
    dispatch(getVillageBeneficiariesList(villageId)).then((res) => {
      if (res.success) {
        // Group beneficiaries by Khatauni
        setGroupedBeneficiaries(groupByKhatauni(res.beneficiaries));
      } else {
        toast.error(res.message);
      }
    });
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between gap-2 flex-wrap pb-6 items-center">
        <div className="text-lg font-semibold text-gray-600 mb-2 sm:mb-0">
          {CONSTANTS.VILLAGE}: {villageName} - {CONSTANTS.TOTAL_BENEFICIARIES}:{" "}
          {totalBeneficiaries}
        </div>
        {userRole === "0" && (
          <button
            onClick={() => {
              navigate(`/upload-beneficiaries/${villageId}`);
            }}
            className="bg-green-500 hover:bg-green-600 text-white rounded-md px-4 py-2 mb-2 sm:mb-0"
          >
            <div className="flex items-center gap-1">
              <RiFileExcel2Line size={20} />
              {CONSTANTS.BUTTON.UPLOAD_BENEFICIARIES_DATA}
            </div>
          </button>
        )}
      </div>

      <div className="overflow-auto border rounded-lg shadow-lg">
        {/* Table Header */}
        <table className="min-w-full text-left table-auto">
          <thead className="bg-gray-200 text-sm">
            <tr>
              {userRole === "0" && (
                <th className="px-3 py-2 font-medium text-center">{CONSTANTS.DISBURSEMENT_STATUS}</th>
              )}
              <th className="px-3 py-2">{CONSTANTS.SERIAL_NUMBER}</th>
              <th className="px-3 py-2">{CONSTANTS.BENEFICIARY_NAME}</th>
              <th className="px-3 py-2">{CONSTANTS.KHASRA_NUMBER}</th>
              <th className="px-3 py-2">{CONSTANTS.AREA_VARIETY}</th>
              <th className="px-3 py-2">{CONSTANTS.ACQUIRED_KHASRA_NUMBER}</th>
              <th className="px-3 py-2">{CONSTANTS.ACQUIRED_RAKBA}</th>
              <th className="px-3 py-2">{CONSTANTS.BENEFICIARY_SHARE}</th>
              <th className="px-3 py-2">
                {CONSTANTS.ACQUIRED_BENEFICIARY_SHARE}
              </th>
              <th className="px-3 py-2">{CONSTANTS.LAND_PRICE_PER_SQ_MT}</th>
            </tr>
          </thead>
          {beneficiaryList?.length > 0 ? (
            <tbody className="text-sm">
              <tr>
                <td
                  colSpan={userRole === "0" ? "10" : "9"}
                  className="px-4 py-2 font-semibold"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <input
                        type="checkbox"
                        id="all"
                        checked={allCheckbox}
                        className="form-checkbox"
                        onChange={(event) => {
                          handleAllKhatauniCheck(event.target);
                        }}
                      />
                      <label htmlFor="all" className="cursor-pointer">
                        {CONSTANTS.BUTTON.SELECT_ALL}
                      </label>
                    </div>
                    <div className="flex justify-end space-x-4">
                      {userRole !== "0" && (
                        <button
                          disabled={!selectedKhatauni.length}
                          className={`text-white px-4 py-1 rounded-md text-sm ${
                            selectedKhatauni.length
                              ? "bg-blue-500 hover:bg-blue-600"
                              : "bg-gray-300 cursor-not-allowed"
                          }`}
                        >
                          {CONSTANTS.BUTTON.DOWNLOAD_INVOICE}
                        </button>
                      )}
                      {userRole === "0" && (
                        <button
                          disabled={!selectedKhatauni.length}
                          onClick={() => {
                            handleAddDetails();
                          }}
                          className={`text-white px-4 py-1 rounded-md text-sm ${
                            selectedKhatauni.length
                              ? "bg-blue-500 hover:bg-blue-600"
                              : "bg-gray-300 cursor-not-allowed"
                          }`}
                        >
                          + {CONSTANTS.BUTTON.ADD_DETAILS}
                        </button>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
              {/* Iterate over each (Khatauni) group */}
              {paginatedData?.map((khatauniSankhya) => (
                <React.Fragment key={khatauniSankhya}>
                  {/* Section Header */}
                  <tr className="bg-gray-100">
                    <td
                      colSpan={userRole === "0" ? "10" : "9"}
                      className="px-4 py-2 font-semibold"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <input
                            value={khatauniSankhya}
                            id={khatauniSankhya}
                            checked={selectedKhatauni.includes(khatauniSankhya)}
                            type="checkbox"
                            className="form-checkbox"
                            onChange={(event) => {
                              handleKhatauniCheck(event.target);
                            }}
                          />
                          <label
                            htmlFor={khatauniSankhya}
                            className="cursor-pointer"
                          >
                            {CONSTANTS.KHATAUNI_SANKHYA}: {khatauniSankhya}
                          </label>
                        </div>
                        <div>
                          <Link
                            to={`/beneficiaries-details/${villageId}/${khatauniSankhya}`}
                            className="hover:underline px-3 py-2 text-blue-600"
                          >
                            {CONSTANTS.BUTTON.VIEW_DETAILS}
                          </Link>
                          {userRole === "0" && (
                            <Link
                              to={`/add-disbursement/${villageName}/${khatauniSankhya}`}
                              className="hover:underline px-3 py-2 text-blue-600"
                            >
                              {CONSTANTS.BUTTON.EDIT_DETAILS}
                            </Link>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* Rows for each Serial Number under Khatauni Sankhya */}
                  {groupedBeneficiaries[khatauniSankhya]?.map((item) => (
                    <tr key={item.serialNumber}>
                      {userRole === "0" && (
                        <td className="px-3 py-2 text-center">
                          {setDisbursementStatus(item.isDisbursementUploaded)}
                        </td>
                      )}
                      <td className="px-3 py-2">{item.serialNumber}</td>
                      <td className="px-3 py-2">{item.beneficiaryName}</td>
                      <td className="px-3 py-2">
                        {SeprateString(item.khasraNumber)}
                      </td>
                      <td className="px-3 py-2">
                        {SeprateString(item.areaVariety)}
                      </td>
                      <td className="px-3 py-2">
                        {SeprateString(item.acquiredKhasraNumber)}
                      </td>
                      <td className="px-3 py-2">
                        {SeprateString(item.acquiredRakbha)}
                      </td>
                      <td className="px-3 py-2">{item.beneficiaryShare}</td>
                      <td className="px-3 py-2">
                        {item.acquiredBeneficiaryShare}
                      </td>
                      <td className="px-3 py-2">{item.landPricePerSqMt}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          ) : (
            <tbody className="text-sm">
              <tr className="py-5">
                <td
                  colSpan={userRole === "0" ? "10" : "9"}
                  className="px-4 py-5 font-semibold text-center"
                >
                  {CONSTANTS.NO_DATA}
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        data={groupedBeneficiaries}
        itemsPerPage={2}
        setPaginatedData={setPaginatedData}
      />
    </div>
  );
};

export default BeneficiariesListPage;

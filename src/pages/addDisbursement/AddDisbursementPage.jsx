import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { formatNumberWithCommas } from "../../utils/priceFormat";
import {
  getKhatauniDetails,
  uploadDisbursementDetails,
} from "../../redux/apis/beneficiariesAPI";
import toast from "react-hot-toast";
import BackButton from "../../components/BackButton";
import CONSTANTS from "../../constants.json";
import { CustomizeString } from "../../utils/SeprateString";
import ConfirmationModal from "./components/ConfirmationModal";

const AddDisbursementPage = () => {
  const [initialValues, setInitialValues] = useState({
    beneficiaries: [],
  });
  const [isChecked, setIsChecked] = useState(false);
  const [checkError, setCheckError] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [makaanDebounceTimeout, setMakaanDebounceTimeout] = useState();
  const [interestDays, setInterestDays] = useState();
  const [isDisbursementSubmitted, setIsDisbursementSubmitted] = useState();
  const [toastId, setToastId] = useState(null);
  const [beneficiaryList, setBeneficiaryList] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { villageName, khatauni, villageId } = useParams();

  const validationSchema = Yup.object().shape({
    bhumiCompensation: Yup.number()
      .min(0, "Invalid value")
      .test("is-decimal", "Invalid value", (value) =>
        /^\d+(\.\d{1,2})?$/.test(value)
      )
      .required("*required field"),
    faldaarBhumiCompensation: Yup.number()
      .min(0, "Invalid value")
      .test("is-decimal", "Invalid value", (value) =>
        /^\d+(\.\d{1,2})?$/.test(value)
      )
      .required("*required field"),
    gairFaldaarBhumiCompensation: Yup.number()
      .min(0, "Invalid value")
      .test("is-decimal", "Invalid value", (value) =>
        /^\d+(\.\d{1,2})?$/.test(value)
      )
      .required("*required field"),
    beneficiaries: Yup.array().of(
      Yup.object().shape({
        housePrice: Yup.number()
          .min(0, "Invalid value")
          .test("is-decimal", "Invalid value", (value) =>
            /^\d+(\.\d{1,2})?$/.test(value)
          )
          .required("*required field"),
        vivran: Yup.string().max(500, "Max 500 characters"),
      })
    ),
  });

  const onSubmit = (values) => {
    if (!isChecked) {
      setCheckError(true);
      return;
    }
    setModalOpen(true);
  };

  const handleConfirmSubmit = (values) => {
    console.log(values, "---");
    const payload = {
      ...values,
      khatauniSankhya: khatauni,
      villageId,
    };
    // Add Disbursement API
    dispatch(uploadDisbursementDetails(payload)).then((res) => {
      if (res.success) {
        toast.success(res.message);
        navigate(-1);
      } else {
        toast.error(res.message);
      }
    });
  };

  useEffect(() => {
    // Set initial values for the form
    if (!beneficiaryList?.beneficiaries?.length) {
      return;
    }
    setInitialValues({
      bhumiCompensation:
        beneficiaryList.khatauniDetails.bhumiCompensation || "",
      gairFaldaarBhumiCompensation:
        beneficiaryList.khatauniDetails.gairFaldaarBhumiCompensation || "",
      faldaarBhumiCompensation:
        beneficiaryList.khatauniDetails.faldaarBhumiCompensation || "",
      makaanCompensation:
        beneficiaryList.khatauniDetails.makaanCompensation || "",
      beneficiaries: beneficiaryList.beneficiaries?.map((item) => ({
        beneficiaryId: item.beneficiaryId || "",
        beneficiaryShare: item.beneficiaryShare || 1,
        bhumiPrice: item.bhumiPrice || 0,
        faldaarBhumiPrice: item.faldaarBhumiPrice || 0,
        gairFaldaarBhumiPrice: item.gairFaldaarBhumiPrice || 0,
        housePrice: item.housePrice || 0,
        toshan: item.toshan || 0,
        interest: item.interest || 0,
        totalCompensation: item.totalCompensation || 0,
        vivran: item.vivran || "",
        isConsent: "1",
      })),
    });
    setInterestDays(
      beneficiaryList.khatauniDetails.villageId.interestDays || 0
    );
  }, [beneficiaryList]);

  useEffect(() => {
    // Khatauni details + beneficiaries API
    dispatch(getKhatauniDetails({ villageId, khatauniSankhya: khatauni })).then(
      (res) => {
        if (res.success) {
          const data = res.beneficiaries.sort(
            (a, b) => a.serialNumber - b.serialNumber
          );
          setBeneficiaryList({ ...res, beneficiaries: data });
          setIsDisbursementSubmitted(
            res.khatauniDetails.isDisbursementSubmitted
          );
        } else {
          toast.error(res.message);
        }
      }
    );
  }, []);

  return (
    <div className="p-4">
      {/* Action Buttons */}
      <div className="flex gap-3 mt-1 justify-start items-center pb-5">
        <BackButton />
        <div className="text-lg font-semibold text-gray-700 gap-1 flex flex-wrap">
          {CONSTANTS.PAGES_NAME.DISBURSEMENT_DETAILS}
          <span>-</span>
          <div className="font-medium text-gray-500 mb-2 sm:mb-0">
            {villageName}
          </div>
        </div>
      </div>
      {isDisbursementSubmitted === "0" && (
        <div className="text-md flex justify-between flex-wrap-reverse pb-4 items-center">
          {/* Verification Checkbox */}
          <div className="mb-2">
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                name="isConsent"
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                onChange={(event) => {
                  setIsChecked(event.target.checked);
                  if (event.target.checked) {
                    setCheckError(false);
                  } else {
                    setCheckError(true);
                  }
                }}
              />
              <label
                htmlFor="isConsent"
                className="ml-2 block text-md text-gray-900"
              ></label>
              {CONSTANTS.BUTTON.DISBURSEMENT_CHECK}
            </div>
            {checkError && (
              <div className="text-red-500 text-xs">
                {CONSTANTS.ERROR.CONSENT}
              </div>
            )}
          </div>

          <div className="flex gap-5 flex-wrap">
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-4 py-1 mb-2 sm:mb-0"
            >
              {CONSTANTS.BUTTON.CANCEL}
            </button>
            <button
              form="beneficiaryForm"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-1 mb-2 sm:mb-0"
              type="submit"
            >
              {CONSTANTS.BUTTON.SAVE_DETAILS}
            </button>
          </div>
        </div>
      )}

      <div className="border rounded-lg shadow-lg">
        {/* Formik Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={onSubmit}
        >
          {({ values, setFieldValue }) => {
            useEffect(() => {
              if (isDisbursementSubmitted === "1") {
                return;
              }
              console.log("run");
              const debounceTimeout = setTimeout(() => {
                let bhumiCompensation = values.bhumiCompensation;
                let faldaarBhumiCompensation = values.faldaarBhumiCompensation;
                let gairFaldaarBhumiCompensation =
                  values.gairFaldaarBhumiCompensation;

                values.beneficiaries.forEach((_, index) => {
                  const beneficiaryShare =
                    values?.beneficiaries[index]?.beneficiaryShare;
                  const housePrice =
                    parseFloat(values?.beneficiaries[index]?.housePrice) || 0;

                  // Calculate bhumi price
                  let bhumiPrice = parseFloat(
                    bhumiCompensation * eval(beneficiaryShare)
                  ).toFixed(2);
                  // Set calculated bhumi price
                  setFieldValue(
                    `beneficiaries[${index}].bhumiPrice`,
                    bhumiPrice
                  );

                  // Calculate faldaar bhumi price
                  let faldaarBhumiPrice = parseFloat(
                    faldaarBhumiCompensation * eval(beneficiaryShare)
                  ).toFixed(2);
                  // Set calculated bhumi price
                  setFieldValue(
                    `beneficiaries[${index}].faldaarBhumiPrice`,
                    faldaarBhumiPrice
                  );

                  // Calculate faldaar bhumi price
                  let gairFaldaarBhumiPrice = parseFloat(
                    gairFaldaarBhumiCompensation * eval(beneficiaryShare)
                  ).toFixed(2);
                  // Set calculated bhumi price
                  setFieldValue(
                    `beneficiaries[${index}].gairFaldaarBhumiPrice`,
                    gairFaldaarBhumiPrice
                  );

                  // Calculate toshan
                  const toshan =
                    +bhumiPrice +
                    +faldaarBhumiPrice +
                    +gairFaldaarBhumiPrice +
                    +housePrice;
                  // Set the calculated toshan value in Formik's state
                  setFieldValue(
                    `beneficiaries[${index}].toshan`,
                    toshan.toFixed(2)
                  );

                  // Calculate interest
                  const timeInYears = interestDays / 365;
                  const interest = (toshan * 12 * timeInYears) / 100;
                  // Set calculated interest
                  setFieldValue(
                    `beneficiaries[${index}].interest`,
                    parseFloat(interest.toFixed(2))
                  );

                  // Calculate total compensation
                  const total = 2 * toshan + interest;
                  // Set calculated interest
                  setFieldValue(
                    `beneficiaries[${index}].totalCompensation`,
                    parseFloat(total.toFixed(2))
                  );

                  // Set vivran
                  setFieldValue(
                    `beneficiaries[${index}].vivran`,
                    values?.beneficiaries[index]?.vivran?.replace(/\s+/g, " ")
                  );
                });
              }, 500);
              return () => clearTimeout(debounceTimeout);
            }, [
              values.bhumiCompensation,
              values.faldaarBhumiCompensation,
              values.gairFaldaarBhumiCompensation,
            ]);

            const handleFieldChange = (index, field, value) => {
              // Update the specific field's value
              setFieldValue(
                `beneficiaries[${index}].${field}`,
                field === "vivran"
                  ? value?.replace(/\s+/g, " ")
                  : parseFloat(value) || 0
              );

              // Perform the calculations based on the new values
              const updatedValues = {
                ...values.beneficiaries[index],
                [field]:
                  field === "vivran"
                    ? value?.replace(/\s+/g, " ")
                    : parseFloat(value),
              };

              // Get updated values for recalculations
              const bhumiPrice = parseFloat(updatedValues?.bhumiPrice) || 0;
              const faldaarBhumiPrice =
                parseFloat(updatedValues?.faldaarBhumiPrice) || 0;
              const gairFaldaarBhumiPrice =
                parseFloat(updatedValues?.gairFaldaarBhumiPrice) || 0;
              const housePrice = parseFloat(updatedValues?.housePrice) || 0;

              // Calculate toshan
              const toshan =
                bhumiPrice +
                faldaarBhumiPrice +
                gairFaldaarBhumiPrice +
                housePrice;
              setFieldValue(
                `beneficiaries[${index}].toshan`,
                parseFloat(toshan.toFixed(2))
              );

              // Calculate interest
              const timeInYears = interestDays / 365;
              const interest = (toshan * 12 * timeInYears) / 100;
              setFieldValue(
                `beneficiaries[${index}].interest`,
                parseFloat(interest.toFixed(2))
              );

              // Calculate total compensation
              const total = 2 * toshan + interest;
              setFieldValue(
                `beneficiaries[${index}].totalCompensation`,
                parseFloat(total.toFixed(2))
              );

              if (makaanDebounceTimeout) {
                clearTimeout(makaanDebounceTimeout);
              }
              let debounceTimeout = setTimeout(() => {
                // Calculate makaan compensation
                if (field === "housePrice") {
                  let makaanCompensation = +parseFloat(value).toFixed(2) || 0;
                  values.beneficiaries.forEach((beneficiary, i) => {
                    if (i === index) {
                      return;
                    }
                    makaanCompensation += +beneficiary.housePrice;
                  });
                  setFieldValue(`makaanCompensation`, makaanCompensation);
                }
              }, 500);
              setMakaanDebounceTimeout(debounceTimeout);
            };

            return (
              <Form id="beneficiaryForm">
                <div className="bg-white rounded-lg p-6 m-2 shadow-lg border border-gray-100 text-sm">
                  <div className="flex justify-between flex-wrap gap-5 text-gray-700">
                    <div className="flex flex-col gap-2">
                      <div className="font-semibold">
                        {CONSTANTS.KHATAUNI_SANKHYA}
                      </div>
                      <div className="text-gray-600">
                        {beneficiaryList?.khatauniDetails?.khatauniSankhya}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="font-semibold">
                        {CONSTANTS.LAND_PRICE_PER_SQ_MT}
                      </div>
                      <div className="text-gray-600">
                        <span className="font-semibold">₹ </span>
                        {
                          beneficiaryList?.khatauniDetails?.landPriceId
                            ?.landPricePerSqMtr
                        }
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="font-semibold">
                        कुल अधिग्रिहत भूमि (SqMt)
                      </div>
                      <div className="text-gray-600">
                        {CustomizeString(
                          beneficiaryList?.khatauniDetails?.totalAcquiredBhumi
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="font-semibold">
                        कुल मुआवजा - मकान इत्यादि
                      </div>
                      <div className="flex gap-1 items-center relative">
                        <div className="border rounded px-2 py-1 w-auto flex gap-1">
                          <span className="font-semibold">₹</span>
                          {formatNumberWithCommas(values?.makaanCompensation)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between flex-wrap gap-5 items-center text-gray-700 pt-5">
                    <div className="flex flex-col gap-2">
                      <div className="font-semibold">कुल मुआवजा - भूमि</div>
                      <div className="flex gap-1 items-center relative">
                        <span className="font-semibold">₹</span>
                        <Field
                          name="bhumiCompensation"
                          type="number"
                          className={`custom-input ${
                            isDisbursementSubmitted === "1" &&
                            "border-gray-200 bg-white"
                          } border rounded px-2 py-1 w-24 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                          placeholder="*मकान"
                          disabled={isDisbursementSubmitted === "1"}
                          value={values?.bhumiCompensation}
                          onKeyDown={(e) => {
                            if (
                              e.key === "-" ||
                              e.key === "e" ||
                              e.key === "+"
                            ) {
                              e.preventDefault();
                            }
                          }}
                          onWheel={(e) => e.target.blur()}
                        />
                        <ErrorMessage
                          name="bhumiCompensation"
                          component="div"
                          className="text-red-500 text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="font-semibold">
                        कुल मुआवजा - फलदार भूमि
                      </div>
                      <div className="flex gap-1 items-center relative">
                        <span className="font-semibold">₹</span>
                        <Field
                          name="faldaarBhumiCompensation"
                          type="number"
                          className={`custom-input ${
                            isDisbursementSubmitted === "1" &&
                            "border-gray-200 bg-white"
                          } border rounded px-2 py-1 w-24 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                          placeholder="*मकान"
                          disabled={isDisbursementSubmitted === "1"}
                          value={values?.faldaarBhumiCompensation}
                          onKeyDown={(e) => {
                            if (
                              e.key === "-" ||
                              e.key === "e" ||
                              e.key === "+"
                            ) {
                              e.preventDefault();
                            }
                          }}
                          onWheel={(e) => e.target.blur()}
                        />
                        <ErrorMessage
                          name="faldaarBhumiCompensation"
                          component="div"
                          className="text-red-500 text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="font-semibold">
                        कुल मुआवजा - गैर फलदार भूमि
                      </div>
                      <div className="flex gap-1 items-center relative">
                        <span className="font-semibold">₹</span>
                        <Field
                          name="gairFaldaarBhumiCompensation"
                          type="number"
                          className={`custom-input ${
                            isDisbursementSubmitted === "1" &&
                            "border-gray-200 bg-white"
                          } border rounded px-2 py-1 w-24 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                          placeholder="*मकान"
                          disabled={isDisbursementSubmitted === "1"}
                          value={values?.gairFaldaarBhumiCompensation}
                          onKeyDown={(e) => {
                            if (
                              e.key === "-" ||
                              e.key === "e" ||
                              e.key === "+"
                            ) {
                              e.preventDefault();
                            }
                          }}
                          onWheel={(e) => e.target.blur()}
                        />
                        <ErrorMessage
                          name="gairFaldaarBhumiCompensation"
                          component="div"
                          className="text-red-500 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-left overflow-x-auto custom-scrollbar">
                  <table>
                    <thead className="bg-gray-200 text-xs">
                      <tr>
                        <th className="px-2 py-3 text-center">
                          {CONSTANTS.SERIAL_NUMBER}
                        </th>
                        <th className="px-2 py-3">
                          {CONSTANTS.BENEFICIARY_NAME}
                        </th>
                        <th className="px-2 py-3">
                          {CONSTANTS.BENEFICIARY_SHARE}
                        </th>
                        <th className="px-2 py-3">{CONSTANTS.BHUMI_PRICE}</th>
                        <th className="px-2 py-3">
                          {CONSTANTS.FALDAAR_BHUMI_PRICE}
                        </th>
                        <th className="px-2 py-3">
                          {CONSTANTS.GAIR_FALDAAR_BHUMI_PRICE}
                        </th>
                        <th className="px-2 py-3">{CONSTANTS.HOUSE_PRICE}</th>
                        <th className="px-2 py-3">{CONSTANTS.TOSHAN}</th>
                        <th className="px-2 py-3">
                          {CONSTANTS.INTEREST} ({interestDays} days)
                        </th>
                        <th className="px-2 py-3">
                          {CONSTANTS.TOTAL_COMPENSATION}
                        </th>
                        <th className="px-2 py-3">{CONSTANTS.VIVRAN}</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs">
                      {beneficiaryList?.beneficiaries?.map(
                        (beneficiary, index) => {
                          return (
                            <tr key={index}>
                              {/* Serial Number */}
                              <td className="px-2 py-3 text-center">
                                {beneficiary.serialNumber}
                              </td>
                              {/* Beneficiary Name */}
                              <td className="px-2 py-3 min-w-24">
                                {beneficiary.beneficiaryName}
                              </td>
                              {/* Beneficiary Share */}
                              <td className="px-2 py-3">
                                {beneficiary.beneficiaryShare}
                              </td>
                              {/* Bhumi Price */}
                              <td className="px-2 py-3">
                                <div className="border rounded px-2 py-1 flex gap-1">
                                  <span className="font-semibold">₹</span>
                                  {formatNumberWithCommas(
                                    values?.beneficiaries[index]?.bhumiPrice
                                  )}
                                </div>
                              </td>
                              {/* Faldaar bhumi */}
                              <td className="px-2 py-3">
                                <div className="border rounded px-2 py-1 flex gap-1">
                                  <span className="font-semibold">₹</span>
                                  {formatNumberWithCommas(
                                    values?.beneficiaries[index]
                                      ?.faldaarBhumiPrice
                                  )}
                                </div>
                              </td>
                              {/* Gair faldaar bhumi */}
                              <td className="px-2 py-3">
                                <div className="border rounded px-2 py-1 flex gap-1">
                                  <span className="font-semibold">₹</span>
                                  {formatNumberWithCommas(
                                    values?.beneficiaries[index]
                                      ?.gairFaldaarBhumiPrice
                                  )}
                                </div>
                              </td>
                              {/* House */}
                              <td className="px-2 py-3">
                                {isDisbursementSubmitted === "0" ? (
                                  <div className="flex gap-1 items-center relative">
                                    <span className="font-semibold">₹</span>
                                    <Field
                                      name={`beneficiaries[${index}].housePrice`}
                                      type="number"
                                      className="custom-input px-2 py-1 border rounded w-24 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                      placeholder="*मकान"
                                      value={
                                        values?.beneficiaries[index]?.housePrice
                                      }
                                      onChange={(e) =>
                                        handleFieldChange(
                                          index,
                                          "housePrice",
                                          e.target.value || 0
                                        )
                                      }
                                      onKeyDown={(e) => {
                                        if (
                                          e.key === "-" ||
                                          e.key === "e" ||
                                          e.key === "+"
                                        ) {
                                          e.preventDefault();
                                        }
                                      }}
                                      onWheel={(e) => e.target.blur()}
                                    />
                                    <ErrorMessage
                                      name={`beneficiaries[${index}].housePrice`}
                                      component="div"
                                      className="text-red-500 text-xs absolute top-8 left-3"
                                    />
                                  </div>
                                ) : (
                                  <div className="border rounded px-2 py-1 flex gap-1">
                                    <span className="font-semibold">₹</span>
                                    {formatNumberWithCommas(
                                      values?.beneficiaries[index]?.housePrice
                                    )}
                                  </div>
                                )}
                              </td>
                              {/* Automatically calculated Toshan */}
                              <td className="px-2 py-3">
                                <div className="border rounded px-2 py-1 w-auto flex gap-1">
                                  <span className="font-semibold">₹</span>
                                  {formatNumberWithCommas(
                                    values?.beneficiaries[index]?.toshan
                                  )}
                                </div>
                              </td>
                              {/* Interest */}
                              <td className="px-2 py-3">
                                <div className="border rounded px-2 py-1 w-auto flex gap-1">
                                  <span className="font-semibold">₹</span>
                                  {formatNumberWithCommas(
                                    values?.beneficiaries[index]?.interest
                                  )}
                                </div>
                              </td>
                              {/* Total Compensation */}
                              <td className="px-2 py-3">
                                <div className="flex gap-1 font-semibold items-center">
                                  <span>₹</span>
                                  {formatNumberWithCommas(
                                    values?.beneficiaries[index]
                                      ?.totalCompensation
                                  )}
                                </div>
                              </td>
                              {/* Vivran */}
                              <td className="px-2 py-3">
                                <div className="relative">
                                  <Field
                                    name={`beneficiaries[${index}].vivran`}
                                    as="textarea"
                                    rows="1"
                                    className={`custom-input ${
                                      isDisbursementSubmitted === "1" &&
                                      "border-gray-200 bg-white"
                                    } border rounded px-2 py-2 w-28 hide-scrollbar min-h-[32px] max-h-[100px]`}
                                    placeholder="--"
                                    disabled={isDisbursementSubmitted === "1"}
                                    value={
                                      values?.beneficiaries[index]?.vivran || ""
                                    }
                                    onChange={(e) => {
                                      if (e.target.value.length > 500) {
                                        if (toastId) {
                                          toast.dismiss(toastId);
                                        }
                                        const id = toast.error(
                                          "Maximum character limit of 500 reached"
                                        );
                                        setToastId(id);
                                      }
                                      if (e.target.value.length <= 500) {
                                        handleFieldChange(
                                          index,
                                          "vivran",
                                          e.target.value
                                        );
                                      }
                                    }}
                                  />
                                  <ErrorMessage
                                    name={`beneficiaries[${index}].vivran`}
                                    component="div"
                                    className="text-red-500 text-xs absolute bottom-[-12.5px]"
                                  />
                                </div>
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>
                {isModalOpen && (
                  <ConfirmationModal
                    closeModal={() => setModalOpen(false)}
                    handleConfirm={() => handleConfirmSubmit(values)}
                  />
                )}
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default AddDisbursementPage;

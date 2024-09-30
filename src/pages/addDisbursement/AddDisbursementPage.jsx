import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { formatNumberWithCommas } from "../../utils/priceFormat";
import { uploadDisbursementDetails } from "../../redux/apis/beneficiariesAPI";
import { filterByKhatauni } from "../../utils/filterGroupSearch";
import toast from "react-hot-toast";
import CONSTANTS from "../../constants.json";

const AddDisbursementPage = () => {
  const [filteredBeneficiariesList, setFilteredBeneficiariesList] = useState(
    []
  );
  const [initialValues, setInitialValues] = useState({
    beneficiaries: [],
  });
  const [isChecked, setIsChecked] = useState(false);
  const [checkError, setCheckError] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { villageName, khatauni } = useParams();
  const beneficiaryList = useSelector(
    (state) => state.beneficiariesListSlice.villageBeneficiaries
  );

  const validationSchema = Yup.object().shape({
    beneficiaries: Yup.array().of(
      Yup.object().shape({
        faldaarBhumiPrice: Yup.number()
          .min(0, "Invalid value")
          .test("is-decimal", "Invalid value", (value) =>
            /^\d+(\.\d{1,2})?$/.test(value)
          )
          .required("*required field"),
        gairFaldaarBhumiPrice: Yup.number()
          .min(0, "Invalid value")
          .test("is-decimal", "Invalid value", (value) =>
            /^\d+(\.\d{1,2})?$/.test(value)
          )
          .required("*required field"),
        housePrice: Yup.number()
          .min(0, "Invalid value")
          .test("is-decimal", "Invalid value", (value) =>
            /^\d+(\.\d{1,2})?$/.test(value)
          )
          .required("*required field"),
        vivran: Yup.string(),
      })
    ),
  });

  const onSubmit = (values) => {
    if (!isChecked) {
      setCheckError(true);
      return;
    }
    const payload = {
      ...values,
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
    setInitialValues({
      beneficiaries: filteredBeneficiariesList?.map((item) => ({
        beneficiaryId: item.beneficiaryId,
        landPricePerSqMt: item.landPricePerSqMt,
        acquiredBeneficiaryShare: item.acquiredBeneficiaryShare,
        interestDays: item.interestDays,
        bhumiPrice: item.bhumiPrice || 0,
        faldaarBhumiPrice: item.faldaarBhumiPrice || 0,
        gairFaldaarBhumiPrice: item.gairFaldaarBhumiPrice || 0,
        housePrice: item.housePrice || 0,
        toshan: item.toshan || 0,
        interest: item.interest || 0,
        totalCompensation: item.totalCompensation || 0,
        vivran: item.vivran || "",
        isConsent: "0",
      })),
    });
  }, [filteredBeneficiariesList]);

  useEffect(() => {
    // Filter beneficiaries on the basis of selected khautani
    setFilteredBeneficiariesList(
      filterByKhatauni(beneficiaryList, khatauni.split("-"))
    );
  }, [beneficiaryList]);

  return (
    <div className="p-4">
      {/* Action Buttons */}
      <div className="text-xl font-semibold text-gray-700 mb-3 gap-1 flex flex-wrap">
        {CONSTANTS.PAGES_NAME.ADD_DISBURSEMENT_DETAILS}
        <span>-</span>
        <div className="font-medium text-gray-500 mb-2 sm:mb-0">
          {villageName}
        </div>
      </div>
      <div className="text-lg flex justify-between flex-wrap-reverse py-5 items-center">
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
              className="ml-2 block text-sm text-gray-900"
            ></label>
            {CONSTANTS.BUTTON.DISBURSEMENT_CHECK}
          </div>
          {checkError && (
            <div className="text-red-500 text-sm">
              {CONSTANTS.ERROR.CONSENT}
            </div>
          )}
        </div>
        <div className="flex gap-5 flex-wrap">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-4 py-1 mb-2 sm:mb-0"
          >
            {CONSTANTS.BUTTON.CANCLE}
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

      <div className="overflow-x-scroll border rounded-lg shadow-lg">
        {/* Formik Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={onSubmit}
        >
          {({ values, setFieldValue }) => {
            useEffect(() => {
              values.beneficiaries.forEach((_, index) => {
                const bhumiPrice =
                  parseFloat(values?.beneficiaries[index]?.bhumiPrice) || 0;
                const faldaarBhumiPrice =
                  parseFloat(values?.beneficiaries[index]?.faldaarBhumiPrice) ||
                  0;
                const gairFaldaarBhumiPrice =
                  parseFloat(
                    values?.beneficiaries[index]?.gairFaldaarBhumiPrice
                  ) || 0;
                const housePrice =
                  parseFloat(values?.beneficiaries[index]?.housePrice) || 0;

                // Calculate bhumi price
                let bhumi =
                  values?.beneficiaries[index].landPricePerSqMt *
                  parseFloat(
                    values?.beneficiaries[index].acquiredBeneficiaryShare
                      .split("-")
                      .join("")
                  );
                // Set calculated bhumi price
                setFieldValue(
                  `beneficiaries[${index}].bhumiPrice`,
                  parseFloat(bhumi.toFixed(2))
                );

                // Calculate toshan
                const toshan =
                  bhumiPrice +
                  faldaarBhumiPrice +
                  gairFaldaarBhumiPrice +
                  housePrice;
                // Set the calculated toshan value in Formik's state
                setFieldValue(
                  `beneficiaries[${index}].toshan`,
                  parseFloat(toshan.toFixed(2))
                );

                // Calculate interest
                const timeInYears =
                  values?.beneficiaries[index]?.interestDays / 365;
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

                // Set calculated interest
                setFieldValue(
                  `beneficiaries[${index}].vivran`,
                  values?.beneficiaries[index].vivran.replace(/\s+/g, " ")
                );
              });
            }, [values.beneficiaries]);

            return (
              <Form id="beneficiaryForm">
                <table className="text-left">
                  <thead className="bg-gray-200 text-xs">
                    <tr>
                      <th className="px-2 py-3">{CONSTANTS.SERIAL_NUMBER}</th>
                      <th className="px-2 py-3">
                        {CONSTANTS.BENEFICIARY_NAME}
                      </th>
                      <th className="px-2 py-3">
                        {CONSTANTS.LAND_PRICE_PER_SQ_MT}
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
                      <th className="px-2 py-3">{CONSTANTS.INTEREST}</th>
                      <th className="px-2 py-3">
                        {CONSTANTS.TOTAL_COMPENSATION}
                      </th>
                      <th className="px-2 py-3">{CONSTANTS.VIVRAN}</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    {filteredBeneficiariesList?.map((beneficiary, index) => {
                      return (
                        <tr key={index}>
                          {/* Serial Number */}
                          <td className="px-2 py-3">
                            {beneficiary.serialNumber}
                          </td>
                          {/* Beneficiary Name */}
                          <td className="px-2 py-3 min-w-[150px]">
                            {beneficiary.beneficiaryName}
                          </td>
                          {/* Price Per Sq Mt */}
                          <td className="px-2 py-3">
                            <div className="flex gap-1 items-center">
                              <span className="font-semibold">₹</span>
                              <Field
                                name={`beneficiaries[${index}].landPricePerSqMt`}
                                className="border rounded px-2 py-1 w-16"
                                readOnly
                              />
                            </div>
                          </td>
                          {/* Bhumi Price */}
                          <td className="px-2 py-3">
                            <div className="border rounded px-2 py-1 w-auto flex gap-1">
                              <span className="font-semibold">₹</span>
                              {formatNumberWithCommas(
                                values?.beneficiaries[index]?.bhumiPrice
                              )}
                            </div>
                          </td>
                          {/* Faldaar bhumi */}
                          <td className="px-2 py-3">
                            <div className="flex gap-1 items-center relative">
                              <span className="font-semibold">₹</span>
                              <Field
                                name={`beneficiaries[${index}].faldaarBhumiPrice`}
                                type="number"
                                className="custom-input border w-24 rounded px-2 py-1 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder="*फलदार"
                                onKeyDown={(e) => {
                                  if (
                                    e.key === "-" ||
                                    e.key === "e" ||
                                    e.key === "+"
                                  ) {
                                    e.preventDefault();
                                  }
                                }}
                              />
                              <ErrorMessage
                                name={`beneficiaries[${index}].faldaarBhumiPrice`}
                                component="div"
                                className="text-red-500 text-xs absolute top-7 left-3"
                              />
                            </div>
                          </td>
                          {/* Gair faldaar bhumi */}
                          <td className="px-2 py-3">
                            <div className="flex gap-1 items-center relative">
                              <span className="font-semibold">₹</span>
                              <Field
                                name={`beneficiaries[${index}].gairFaldaarBhumiPrice`}
                                type="number"
                                className="custom-input border rounded px-2 py-1 w-24 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder="*गैर फलदार"
                                onKeyDown={(e) => {
                                  if (
                                    e.key === "-" ||
                                    e.key === "e" ||
                                    e.key === "+"
                                  ) {
                                    e.preventDefault();
                                  }
                                }}
                              />
                              <ErrorMessage
                                name={`beneficiaries[${index}].gairFaldaarBhumiPrice`}
                                component="div"
                                className="text-red-500 text-xs absolute top-7 left-3"
                              />
                            </div>
                          </td>
                          {/* House */}
                          <td className="px-2 py-3">
                            <div className="flex gap-1 items-center relative">
                              <span className="font-semibold">₹</span>
                              <Field
                                name={`beneficiaries[${index}].housePrice`}
                                type="number"
                                className="custom-input border rounded px-2 py-1 w-24 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder="*मकान"
                                onKeyDown={(e) => {
                                  if (
                                    e.key === "-" ||
                                    e.key === "e" ||
                                    e.key === "+"
                                  ) {
                                    e.preventDefault();
                                  }
                                }}
                              />
                              <ErrorMessage
                                name={`beneficiaries[${index}].housePrice`}
                                component="div"
                                className="text-red-500 text-xs absolute top-7 left-3"
                              />
                            </div>
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
                                values?.beneficiaries[index]?.totalCompensation
                              )}
                            </div>
                          </td>
                          {/* Vivran */}
                          <td className="px-2 py-3">
                            <Field
                              name={`beneficiaries[${index}].vivran`}
                              as="textarea"
                              rows="1"
                              className="custom-input border rounded px-2 py-2 w-28 hide-scrollbar"
                              placeholder="--"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default AddDisbursementPage;

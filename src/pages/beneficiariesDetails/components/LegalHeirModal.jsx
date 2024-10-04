import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { addLegalHeir } from "../../../redux/apis/beneficiariesAPI";
import { useDispatch } from "react-redux";

// Modal component
const LegalHeirModal = ({
  closeModal,
  beneficiaryId,
  setRecallAPI,
  recallAPI,
}) => {
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    beneficiaryType: Yup.string().required("Beneficiary type is required"),
    beneficiaries: Yup.array().of(
      Yup.object({
        name: Yup.string().required("Beneficiary name is required"),
        percentage: Yup.number()
          .min(1, "Minimum 1%")
          .max(100, "Maximum 100%")
          .test("is-decimal", "Up to 2 decimals allowed", (value) =>
            /^\d+(\.\d{1,2})?$/.test(value)
          )
          .required("Share percentage is required"),
      })
    ),
  });

  const initialValues = {
    beneficiaryId: beneficiaryId,
    beneficiaryType: "poa",
    beneficiaries: [{ name: "", percentage: 100 }],
  };

  const userTypes = [
    { value: "poa", label: "Power of attorney (POA)" },
    { value: "nok", label: "Next of kin (NOK)" },
  ];

  const handleSubmit = (values, { setSubmitting }) => {
    const total = values.beneficiaries.reduce(
      (acc, beneficiary) => acc + Number(beneficiary.percentage),
      0
    );
    if (total !== 100) {
      toast.error(
        "Total share percentage of all the beneficiaries must be 100%"
      );
    } else {
      // Add Legal Heir API
      dispatch(addLegalHeir(values)).then((res) => {
        if (res.success) {
          toast.success(res.message);
          setRecallAPI(!recallAPI);
          closeModal();
        } else {
          toast.error(res.message);
        }
      });
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[300px] sm:w-[350px] md:w-[380px] lg:w-[380px]">
        <h3 className="mb-4 text-gray-700 font-bold text-center">
          Add Legal Heir
        </h3>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form>
              {/* Beneficiary Type Dropdown */}
              <div className="mb-6">
                <label
                  htmlFor="beneficiaryType"
                  className="block text-left text-sm font-medium leading-6 text-gray-900"
                >
                  Change Beneficiary Type
                </label>
                <Field
                  as="select"
                  name="beneficiaryType"
                  className="custom-input"
                >
                  {userTypes?.map((opt) => {
                    return (
                      <option
                        value={opt.value}
                        label={opt.label}
                        key={opt.value}
                      ></option>
                    );
                  })}
                </Field>
                <ErrorMessage
                  name="beneficiaryType"
                  component="div"
                  className="error"
                />
              </div>

              <div className="max-h-[300px] overflow-y-scroll custom-scrollbar pr-1">
                {" "}
                {/* Beneficiaries Field Array */}
                <FieldArray name="beneficiaries">
                  {({ remove, push }) => (
                    <>
                      {values.beneficiaries.map((_, index) => (
                        <>
                          <div className="text-xs text-gray-600 font-medium">
                            LEGAL HEIR - {index + 1}
                          </div>
                          <div
                            key={index}
                            className="mb-4 px-3 pb-3 pt-1 bg-slate-50 rounded-lg"
                          >
                            {/* New Beneficiary Name */}
                            <label
                              htmlFor={`beneficiaries.${index}.name`}
                              className="block text-left text-sm font-medium leading-6 text-gray-800"
                            >
                              New Beneficiary Name
                            </label>
                            <Field
                              name={`beneficiaries.${index}.name`}
                              className="custom-input"
                              placeholder="Enter name"
                            />
                            <ErrorMessage
                              name={`beneficiaries.${index}.name`}
                              component="div"
                              className="text-red-500 text-xs"
                            />

                            {/* Share Percentage */}
                            <label
                              htmlFor={`beneficiaries.${index}.percentage`}
                              className="block text-left text-sm font-medium leading-6 text-gray-800 mt-2"
                            >
                              Share Percentage
                            </label>
                            <Field
                              name={`beneficiaries.${index}.percentage`}
                              type="number"
                              className="custom-input  appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              placeholder="Enter percentage"
                              onChange={(e) => {
                                setFieldValue(
                                  `beneficiaries.${index}.percentage`,
                                  e.target.value &&
                                    parseFloat(
                                      Number(e.target.value).toFixed(2)
                                    )
                                );
                              }}
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
                              name={`beneficiaries.${index}.percentage`}
                              component="div"
                              className="text-red-500 text-xs"
                            />

                            {index > 0 && (
                              <button
                                type="button"
                                className="text-blue-500 mt-2 text-sm"
                                onClick={() => remove(index)}
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </>
                      ))}

                      {/* Add New Beneficiary Button */}
                      <button
                        type="button"
                        className="bg-green-500 text-white text-sm px-4 py-1 rounded-lg hover:bg-green-600"
                        onClick={() => {
                          const total = values.beneficiaries.reduce(
                            (acc, beneficiary) =>
                              acc +
                              parseFloat(beneficiary.percentage.toFixed(2)),
                            0
                          );
                          push({
                            name: "",
                            percentage: parseFloat((100 - total).toFixed(2)),
                          });
                        }}
                      >
                        Add Beneficiary
                      </button>
                    </>
                  )}
                </FieldArray>
              </div>

              {/* Cancel and Save Buttons */}
              <div className="flex justify-between mt-4 gap-5">
                <button
                  className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-400 w-full"
                  onClick={() => closeModal()}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full"
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LegalHeirModal;

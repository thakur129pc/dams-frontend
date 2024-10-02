import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  villageBeneficiaries: [],
  paymentBeneficiaries: [],
  beneficiariesDetails: [],
};

const beneficiariesListSlice = createSlice({
  name: "beneficiariesList",
  initialState,
  reducers: {
    updateAllBeneficiariesList: (state, action) => {
      state.list = [...action.payload];
    },
    removeAllBeneficiariesList: (state) => {
      state.list = [];
    },
    updateVillageBeneficiariesList: (state, action) => {
      const data = action.payload.sort(
        (a, b) => a.serialNumber - b.serialNumber
      );
      state.villageBeneficiaries = [...data];
    },
    removeVillageBeneficiariesList: (state) => {
      state.villageBeneficiaries = [];
    },
    updateBeneficiariesDetails: (state, action) => {
      const beneficiaryId = action.payload.id;
      let data = action.payload.data.sort(
        (a, b) => a.serialNumber - b.serialNumber
      );
      if (beneficiaryId) {
        data = data.filter((item) => item.beneficiaryId === beneficiaryId);
      }
      state.beneficiariesDetails = [...data];
    },
    removeBeneficiariesDetails: (state) => {
      state.beneficiariesDetails = [];
    },
    updatePaymentBeneficiaries: (state, action) => {
      state.paymentBeneficiaries = [...action.payload];
    },
    removePaymentBeneficiaries: (state) => {
      state.paymentBeneficiaries = [];
    },
  },
});

export const {
  updateAllBeneficiariesList,
  updateVillageBeneficiariesList,
  updateBeneficiariesDetails,
  updatePaymentBeneficiaries,
  removeAllBeneficiariesList,
  removeVillageBeneficiariesList,
  removeBeneficiariesDetails,
  removePaymentBeneficiaries,
} = beneficiariesListSlice.actions;
export default beneficiariesListSlice.reducer;

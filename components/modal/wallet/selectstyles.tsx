import { StylesConfig } from "react-select";

export const reactSelectStyles: StylesConfig = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "#0d0b14",
    border: "none",
    borderRadius: "8px",
    padding: "0 10px",
    height: "40px",
    fontSize: "14px",
    color: "#fff",
    fontStyle: "normal",
    fontWeight: 500,
    lineHeight: "normal",
    boxShadow: "none",
    "&:hover": {
      border: "none",
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#221E29" : "#0d0b14",
    color: "#fff",
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: 500,
    lineHeight: "normal",
    "&:hover": {
      backgroundColor: "#221E29",
    },
  }),
  input: (provided, state) => ({
    ...provided,
    color: "#fff",
    fontStyle: "normal",
    fontWeight: 500,
    lineHeight: "normal",
    caretColor: "transparent",
  }),
  menuList: (provided, state) => ({
    ...provided,
    backgroundColor: "#0d0b14",
    color: "#fff",
    fontStyle: "normal",
    fontWeight: 500,
    lineHeight: "normal",
  }),
  singleValue: (provided, state) => ({
    ...provided,
    color: "#fff",
    fontStyle: "normal",
    fontWeight: 500,
    lineHeight: "normal",
  }),
  placeholder: (provided, state) => ({
    ...provided,
    color: "#5F586A",
    fontStyle: "normal",
    fontWeight: 500,
    lineHeight: "normal",
  }),
};

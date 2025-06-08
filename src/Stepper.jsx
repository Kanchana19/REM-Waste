// Stepper.js – horizontal progress tracker
import React from "react";
import {
  FaMapMarkerAlt,
  FaTrashAlt,
  FaBoxOpen,
  FaShieldAlt,
  FaRegCalendarAlt,
  FaRegCreditCard,
  FaCheck,
} from "react-icons/fa";
import "./App.css";                     // uses the shared stylesheet

const steps = [
  { label: "Postcode",     icon: FaMapMarkerAlt },
  { label: "Waste Type",   icon: FaTrashAlt },
  { label: "Select Skip",  icon: FaBoxOpen },
  { label: "Permit Check", icon: FaShieldAlt },
  { label: "Choose Date",  icon: FaRegCalendarAlt },
  { label: "Payment",      icon: FaRegCreditCard },
];

/* currentStep → 0-based index of the active step */
export default function Stepper({ currentStep = 0 }) {
  return (
    <nav className="stepper-bar">
      {steps.map(({ label, icon: Icon }, idx) => {
        const state =
          idx < currentStep ? "done" : idx === currentStep ? "active" : "todo";
        return (
          <React.Fragment key={label}>
            <div className={`step-item ${state}`}>
              <span className="circle">
                {idx < currentStep ? <FaCheck size={13} /> : <Icon size={13} />}
              </span>
              <span className="step-text">{label}</span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`step-line ${state}`} />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

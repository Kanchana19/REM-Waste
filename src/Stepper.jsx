import React from "react";
import { FaCheck } from "react-icons/fa";
import {
  FaMapMarkerAlt,
  FaTrashAlt,
  FaBoxOpen,
  FaShieldAlt,
  FaRegCalendarAlt,
  FaRegCreditCard,
} from "react-icons/fa";
import "./App.css";                 // uses global stepper rules

const STEPS = [
  { label: "Postcode",     icon: FaMapMarkerAlt },
  { label: "Waste Type",   icon: FaTrashAlt },
  { label: "Select Skip",  icon: FaBoxOpen },
  { label: "Permit Check", icon: FaShieldAlt },
  { label: "Choose Date",  icon: FaRegCalendarAlt },
  { label: "Payment",      icon: FaRegCreditCard },
];

export default function Stepper({ current = 0 }) {
  return (
    <nav className="stepper-bar">
      {STEPS.map(({ label, icon: Icon }, i) => {
        const state =
          i < current ? "done" : i === current ? "active" : "todo";
        return (
          <React.Fragment key={label}>
            <div className={`step-item ${state}`}>
              <span className="circle">
                {i < current ? <FaCheck size={13} /> : <Icon size={13} />}
              </span>
              <span className="step-text">{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`step-line ${state}`} />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

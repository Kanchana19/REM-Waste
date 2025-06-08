import React, { useEffect, useState } from "react";
import "./App.css";
import {
  FaMapMarkerAlt,
  FaTrashAlt,
  FaBoxOpen,
  FaShieldAlt,
  FaRegCalendarAlt,
  FaRegCreditCard,
  FaCheck,
} from "react-icons/fa";

/* ─── stepper data ───────────────── */
const STEPS = [
  { label: "Postcode",     icon: FaMapMarkerAlt },
  { label: "Waste Type",   icon: FaTrashAlt },
  { label: "Select Skip",  icon: FaBoxOpen },
  { label: "Permit Check", icon: FaShieldAlt },
  { label: "Choose Date",  icon: FaRegCalendarAlt },
  { label: "Payment",      icon: FaRegCreditCard },
];
const CURRENT_STEP = 2; // 0-based index (“Select Skip”)

/* ─── stepper component ──────────── */
function Stepper() {
  return (
    <nav className="stepper-bar">
      {STEPS.map(({ label, icon: Icon }, i) => {
        const state = i < CURRENT_STEP ? "done" : i === CURRENT_STEP ? "active" : "todo";
        return (
          <React.Fragment key={label}>
            <div className={`step-item ${state}`}>
              <span className="circle">
                {i < CURRENT_STEP ? <FaCheck size={13} /> : <Icon size={13} />}
              </span>
              <span className="step-text">{label}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`step-line ${state}`} />}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export default function App() {
  /* pretend these come from previous steps */
  const postcode = "NR32";
  const area     = "Lowestoft";

  /* data + ui state */
  const [skips, setSkips]         = useState([]);
  const [selected, setSelected]   = useState(null);
  const [confirmed, setConfirmed] = useState(false); // turns CTA green
  const [modalOpen, setModalOpen] = useState(false); // modal visibility

  /* fetch once */
  useEffect(() => {
    fetch(
      `https://app.wewantwaste.co.uk/api/skips/by-location?postcode=${postcode}&area=${area}`
    )
      .then(r => r.json())
      .then(d => setSkips(d.skips ?? d));
  }, [postcode, area]);

  /* handlers */
  const handleRadio = (skip) => {
    setSelected(skip);
    setConfirmed(false);      // reset CTA phase when user changes size
  };

  const handlePrimary = () => {
    if (!selected) return;
    setModalOpen(true);       // show confirmation modal
  };

  const confirmSelection = () => {
    setConfirmed(true);       // lock selection (green button)
    setModalOpen(false);
    console.log("Chosen skip:", selected);
    // navigate() or props.onSelect?.(selected) etc.
  };

  /* ─── render ───────────────────── */
  return (
    <>
      <Stepper />

      <div className="screen">
        {/* ========= SPEC PANEL ========= */}
        <section className="spec-panel">
          <h1 className="panel-title">Choose Your Skip</h1>
          <p className="panel-sub">Select the best skip for your needs.</p>

          <div className="radio-list">
            {skips.map(skip => (
              <label key={skip.id} className="radio-item">
                <input
                  type="radio"
                  name="skip"
                  checked={selected?.id === skip.id}
                  onChange={() => handleRadio(skip)}
                />
                {skip.size} Yard
              </label>
            ))}
          </div>

          <hr className="divider" />

          {selected && (
            <>
              <p className="meta-label">Hire period</p>
              <p className="meta-value">{selected.hire_period_days} day</p>

              <hr className="divider" />

              <p className="meta-label">Price</p>
              <p className="price">£{selected.price_before_vat}</p>
            </>
          )}

          {/* primary CTA */}
          <button
            className={`cta-btn ${confirmed ? "confirmed" : ""}`}
            disabled={!selected}
            onClick={handlePrimary}
          >
            {confirmed ? (
              <>
                <FaCheck style={{ marginRight: 8 }} /> Selected
              </>
            ) : selected ? (
              "Select skip"
            ) : (
              "Choose a skip"
            )}
          </button>
        </section>

        {/* ========= PREVIEW ========= */}
        <div className="preview-wrap">
          {selected ? (
            <img
              className="skip-img"
              src="/eye.jpg" /* replace with skip.image_url */
              alt={`${selected.size} yard skip`}
            />
          ) : (
            <p className="preview-hint">Pick a size to preview</p>
          )}
        </div>
      </div>

      {/* ========= MODAL ========= */}
      {modalOpen && selected && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}   /* stop overlay close */
          >
            <button
              className="modal-close"
              onClick={() => setModalOpen(false)}
              aria-label="Close"
            >
              &times;
            </button>

            <h2>{selected.size} Yard Skip</h2>
            <p>{selected.hire_period_days} day hire period</p>
            <p className="modal-price">£{selected.price_before_vat}</p>

            <button className="modal-cta" onClick={confirmSelection}>
              Continue
            </button>
          </div>
        </div>
      )}
    </>
  );
}

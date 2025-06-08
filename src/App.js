import React, { useEffect, useState } from "react";
import "./App.css";
import Stepper from "./Stepper";
import {
  FaCheck,
  FaExclamationTriangle,
} from "react-icons/fa";

const API = (pc, area) =>
  `https://app.wewantwaste.co.uk/api/skips/by-location?postcode=${pc}&area=${area}`;

export default function App() {
  const [skips, setSkips]       = useState([]);
  const [selected, setSelected] = useState(null);
  const [locked, setLocked]     = useState(false);
  const [showModal, setShow]    = useState(false);

  /* fetch once */
  useEffect(() => {
    fetch(API("NR32", "Lowestoft"))
      .then((r) => r.json())
      .then((d) => setSkips(d.skips ?? d));
  }, []);

  /* handlers */
  const choose = (s) => { setSelected(s); setLocked(false); };
  const open   = () => selected && setShow(true);
  const confirm= () => { setLocked(true); setShow(false); };

  return (
    <>
      <Stepper current={2} />

      <main className="screen">
        {/* panel */}
        <section className="spec-panel">
          <h1 className="panel-title">Choose Your Skip</h1>
          <p  className="panel-sub">Select the best skip for your needs.</p>

          <div className="radio-list">
            {skips.map((s) => (
              <label key={s.id} className="radio-item">
                <input
                  type="radio"
                  name="skip"
                  checked={selected?.id === s.id}
                  onChange={() => choose(s)}
                />
                {s.size} Yard
              </label>
            ))}
          </div>

          {selected && (
            <>
              <hr className="divider" />
              <span className="meta-label">Hire period</span>
              <span className="meta-value">{selected.hire_period_days} day</span>

              <hr className="divider" />
              <span className="meta-label">Price</span>
              <span className="price">£{selected.price_before_vat}</span>
            </>
          )}

          <button
            className={`cta-btn ${locked ? "confirmed" : ""}`}
            disabled={!selected}
            onClick={open}
          >
            {locked && <FaCheck style={{ marginRight: 8 }} />}
            {locked ? "Selected" : selected ? "Select skip" : "Choose a skip"}
          </button>
        </section>

        {/* preview */}
        <div className="preview-wrap">
          {selected ? (
            <div className="img-wrap">
              <img
                className="skip-img"
                src="/eye.jpg"              /* replace with selected.image_url */
                alt={`${selected.size} yard skip`}
              />

              <span className="yard-pill">{selected.size} Yards</span>

              {!selected.allowed_on_road && (
                <span className="road-badge">
                  <FaExclamationTriangle className="road-icon" />
                  Not Allowed On The Road
                </span>
              )}
            </div>
          ) : (
            <p className="preview-hint">Pick a size to preview</p>
          )}
        </div>
      </main>

      {/* modal */}
      {showModal && selected && (
        <div className="modal-overlay" onClick={() => setShow(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShow(false)}>
              &times;
            </button>

            <h2>{selected.size} Yard Skip</h2>
            <p>{selected.hire_period_days} day hire period</p>
            <p className="modal-price">£{selected.price_before_vat}</p>

            <button className="modal-cta" onClick={confirm}>
              Continue
            </button>
          </div>
        </div>
      )}
    </>
  );
}

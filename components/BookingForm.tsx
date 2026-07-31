"use client";

import { FormEvent, useState } from "react";

export default function BookingForm({ whatsappNumber }: { whatsappNumber: string }) {
  const [isOpening, setIsOpening] = useState(false);

  function bookVisit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const message = [
      "Hello OM VALUE HOMES, I want to book a FREE Site Visit.",
      "",
      `Name: ${form.get("name")}`,
      `Phone: ${form.get("phone")}`,
      `Interested in: ${form.get("home")}`,
      `Purpose: ${form.get("purpose")}`,
      `Preferred date: ${form.get("date")}`,
    ].join("\n");

    setIsOpening(true);
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
    window.setTimeout(() => setIsOpening(false), 1200);
  }

  return (
    <form className="booking-card" id="book" onSubmit={bookVisit}>
      <div className="booking-heading">
        <p>Free Site Visit</p>
        <span>01</span>
      </div>
      <h2>Plan your visit</h2>
      <p>Share your preference. Our property advisor will confirm your tour.</p>

      <label>
        <span>Name</span>
        <input name="name" type="text" placeholder="Your full name" autoComplete="name" required />
      </label>
      <label>
        <span>Phone</span>
        <input
          name="phone"
          type="tel"
          placeholder="10-digit mobile number"
          autoComplete="tel"
          inputMode="numeric"
          pattern="[0-9]{10}"
          maxLength={10}
          required
        />
      </label>
      <div className="booking-row">
        <label>
          <span>Interested in</span>
          <select name="home" defaultValue="1 BHK" required>
            <option>1 BHK</option>
            <option>2 BHK</option>
            <option>3 BHK</option>
          </select>
        </label>
        <label>
          <span>Purpose</span>
          <select name="purpose" defaultValue="Self-use" required>
            <option>Self-use</option>
            <option>Investment</option>
          </select>
        </label>
      </div>
      <label>
        <span>Preferred visit date</span>
        <input name="date" type="date" min={new Date().toISOString().slice(0, 10)} required />
      </label>
      <button type="submit" disabled={isOpening}>
        {isOpening ? "Opening WhatsApp…" : "Continue on WhatsApp"}
        <span aria-hidden="true">→</span>
      </button>
      <small>By continuing, you agree to be contacted about this enquiry.</small>
    </form>
  );
}

"use client";

import React, { useState } from "react";
import { Container } from "../../layout/container";
import { HOSPITAL_INFO } from "../../../constants";
import {
  Calendar,
  Clock,
  PhoneCall,
  Send,
  CheckCircle2,
  ShieldCheck,
  User,
  Heart,
  MessageSquare,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import styles from "./contact-form.module.css";

const SERVICES_OPTIONS = [
  "General OPD & Preventive Checkup",
  "24/7 Emergency & ICU Inquiry",
  "Specialized Cat Care OPD",
  "Surgeries & Modular OT Consult",
  "In-House Diagnostic Lab & Imaging",
  "Luxury Pet Boarding & Daycare",
  "Therapeutic Grooming & Spa",
  "Home Veterinary Visit Request",
];

const SPECIES_OPTIONS = [
  "Dog (Canine)",
  "Cat (Feline)",
  "Bird (Avian)",
  "Rabbit / Hamster",
  "Exotic / Other",
];

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    parentName: "",
    phone: "",
    email: "",
    petName: "",
    petSpecies: "Dog (Canine)",
    preferredCampus: "sector-90",
    serviceType: "General OPD & Preventive Checkup",
    preferredDate: "",
    notes: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate clean dispatch
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <section className={styles.section} id="contact" aria-labelledby="form-heading">
      <Container>
        <div className={styles.wrapper}>
          {/* Left Column: Context & Guarantees */}
          <div className={styles.infoCol}>
            <span className={styles.eyebrow}>Fast Response Guarantee</span>

            <h2 id="form-heading" className={styles.title}>
              Request an Appointment or Consultation
            </h2>

            <p className={styles.desc}>
              Submit your preferred date and requirements. Our clinical reception desk confirms OPD appointments within 15–30 minutes during hospital hours.
            </p>

            {/* Reassurance Points */}
            <div className={styles.guaranteeList}>
              <div className={styles.guaranteeItem}>
                <div className={styles.guaranteeIcon}>
                  <ShieldCheck size={18} aria-hidden="true" />
                </div>
                <div>
                  <h3 className={styles.guaranteeTitle}>Zero Wait Time for Trauma</h3>
                  <p className={styles.guaranteeText}>
                    If your pet has sustained an acute injury or poisoning, call our 24/7 line directly. You do not need an appointment.
                  </p>
                </div>
              </div>

              <div className={styles.guaranteeItem}>
                <div className={styles.guaranteeIcon}>
                  <Sparkles size={18} aria-hidden="true" />
                </div>
                <div>
                  <h3 className={styles.guaranteeTitle}>Transparent Treatment Estimates</h3>
                  <p className={styles.guaranteeText}>
                    Our veterinarians explain diagnosis, medication plans, and price estimates transparently before initiating treatment.
                  </p>
                </div>
              </div>

              <div className={styles.guaranteeItem}>
                <div className={styles.guaranteeIcon}>
                  <Heart size={18} aria-hidden="true" />
                </div>
                <div>
                  <h3 className={styles.guaranteeTitle}>Quiet Feline &amp; Canine Zones</h3>
                  <p className={styles.guaranteeText}>
                    Species-separated consultation waiting rooms in Sector 90 keep sensitive cats and reactive dogs stress-free.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Helpline Box */}
            <div className={styles.directHelpline}>
              <div className={styles.helplineContent}>
                <span className={styles.helplineLabel}>Prefer to speak right now?</span>
                <span className={styles.helplineSub}>Our care team is on the line 24 hours a day</span>
              </div>
              <a
                href={`tel:${HOSPITAL_INFO.phone.replace(/\s+/g, "")}`}
                className={styles.helplineBtn}
              >
                <PhoneCall size={14} aria-hidden="true" />
                <span>Call {HOSPITAL_INFO.phone}</span>
              </a>
            </div>
          </div>

          {/* Right Column: Appointment Form */}
          <div className={styles.formCol}>
            {submitted ? (
              <div className={styles.successState}>
                <div className={styles.successIcon}>
                  <CheckCircle2 size={40} aria-hidden="true" />
                </div>
                <h3 className={styles.successTitle}>Appointment Request Received!</h3>
                <p className={styles.successText}>
                  Thank you, <strong>{formData.parentName || "Pet Parent"}</strong>. Our hospital reception at{" "}
                  <strong>
                    {formData.preferredCampus === "sector-90"
                      ? "Sector 90 Hospital"
                      : "Sector 87 Pet World"}
                  </strong>{" "}
                  has received your request for <strong>{formData.petName || "your pet"}</strong> and will call you back on{" "}
                  <strong>{formData.phone}</strong> shortly to confirm your consultation time slot.
                </p>

                <button
                  type="button"
                  className={styles.resetBtn}
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      parentName: "",
                      phone: "",
                      email: "",
                      petName: "",
                      petSpecies: "Dog (Canine)",
                      preferredCampus: "sector-90",
                      serviceType: "General OPD & Preventive Checkup",
                      preferredDate: "",
                      notes: "",
                    });
                  }}
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formHeader}>
                  <h3 className={styles.formTitle}>Book a Scheduled Visit</h3>
                  <span className={styles.formSubtitle}>Fields marked with * are required</span>
                </div>

                {/* 1. Preferred Campus Radio Pills */}
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>
                    Preferred Hospital Campus <span className={styles.req}>*</span>
                  </label>
                  <div className={styles.campusToggle}>
                    <button
                      type="button"
                      className={`${styles.campusChoice} ${
                        formData.preferredCampus === "sector-90"
                          ? styles.campusChoiceActive
                          : ""
                      }`}
                      onClick={() =>
                        setFormData({ ...formData, preferredCampus: "sector-90" })
                      }
                    >
                      <span className={styles.choiceTitle}>Sector 90 Hospital</span>
                      <span className={styles.choiceDesc}>24/7 ICU, Surgery &amp; Cat OPD</span>
                    </button>

                    <button
                      type="button"
                      className={`${styles.campusChoice} ${
                        formData.preferredCampus === "sector-87"
                          ? styles.campusChoiceActive
                          : ""
                      }`}
                      onClick={() =>
                        setFormData({ ...formData, preferredCampus: "sector-87" })
                      }
                    >
                      <span className={styles.choiceTitle}>Sector 87 Pet World</span>
                      <span className={styles.choiceDesc}>Boarding, Daycare &amp; Grooming</span>
                    </button>
                  </div>
                </div>

                {/* 2. Parent Name & Phone */}
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="parentName" className={styles.label}>
                      Pet Parent Name <span className={styles.req}>*</span>
                    </label>
                    <div className={styles.inputWrap}>
                      <User size={15} className={styles.inputIcon} aria-hidden="true" />
                      <input
                        type="text"
                        id="parentName"
                        required
                        placeholder="e.g. Rahul Sharma"
                        className={styles.input}
                        value={formData.parentName}
                        onChange={(e) =>
                          setFormData({ ...formData, parentName: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="phone" className={styles.label}>
                      Mobile Phone Number <span className={styles.req}>*</span>
                    </label>
                    <div className={styles.inputWrap}>
                      <PhoneCall size={15} className={styles.inputIcon} aria-hidden="true" />
                      <input
                        type="tel"
                        id="phone"
                        required
                        placeholder="e.g. +91 98765 43210"
                        className={styles.input}
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Pet Name & Species */}
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="petName" className={styles.label}>
                      Pet&apos;s Name <span className={styles.req}>*</span>
                    </label>
                    <div className={styles.inputWrap}>
                      <Heart size={15} className={styles.inputIcon} aria-hidden="true" />
                      <input
                        type="text"
                        id="petName"
                        required
                        placeholder="e.g. Bruno / Simba"
                        className={styles.input}
                        value={formData.petName}
                        onChange={(e) =>
                          setFormData({ ...formData, petName: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="petSpecies" className={styles.label}>
                      Species <span className={styles.req}>*</span>
                    </label>
                    <select
                      id="petSpecies"
                      className={styles.select}
                      value={formData.petSpecies}
                      onChange={(e) =>
                        setFormData({ ...formData, petSpecies: e.target.value })
                      }
                    >
                      {SPECIES_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 4. Service Type & Preferred Date */}
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="serviceType" className={styles.label}>
                      Service Required <span className={styles.req}>*</span>
                    </label>
                    <select
                      id="serviceType"
                      className={styles.select}
                      value={formData.serviceType}
                      onChange={(e) =>
                        setFormData({ ...formData, serviceType: e.target.value })
                      }
                    >
                      {SERVICES_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="preferredDate" className={styles.label}>
                      Preferred Date
                    </label>
                    <div className={styles.inputWrap}>
                      <Calendar size={15} className={styles.inputIcon} aria-hidden="true" />
                      <input
                        type="date"
                        id="preferredDate"
                        className={styles.input}
                        value={formData.preferredDate}
                        onChange={(e) =>
                          setFormData({ ...formData, preferredDate: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Message / Symptoms */}
                <div className={styles.field}>
                  <label htmlFor="notes" className={styles.label}>
                    Symptoms or Specific Questions
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    placeholder="Briefly describe what your pet is experiencing or any specific requests..."
                    className={styles.textarea}
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={styles.submitBtn}
                >
                  <Send size={15} aria-hidden="true" />
                  <span>{loading ? "Sending Request..." : "Request Appointment"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};

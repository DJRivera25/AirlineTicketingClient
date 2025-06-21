import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import FlightSearchForm from "../components/FlightSearchForm";
import Footer from "../components/Footer";
import SearchContext from "../context/FlightSearchContext";

const Home = () => {
  const navigate = useNavigate();
  const { searchFlights } = useContext(SearchContext);

  const [form, setForm] = useState({
    from: "",
    to: "",
    departure: "",
    return: "",
    passengers: 1,
    class: "",
    tripType: "round-trip", // 👈 Add this
  });

  const handleChange = (eOrObj) => {
    if (eOrObj?.target) {
      // Case 1: from an event
      setForm((prev) => ({
        ...prev,
        [eOrObj.target.name]: eOrObj.target.value,
      }));
    } else {
      // Case 2: from a plain object
      setForm((prev) => ({
        ...prev,
        ...eOrObj,
      }));
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      await searchFlights(form);
      navigate("/flights");
    } catch (err) {
      console.error("Search failed", err);
      alert("HOME.JS Flight search failed.");
    }
  };

  return (
    <>
      {/* Main content */}
      <HeroSection />
      <div className="relative z-10 p-6 max-w-7xl mx-auto space-y-16">
        <FlightSearchForm form={form} handleChange={handleChange} handleSearch={handleSearch} />
        <Footer />
      </div>
    </>
  );
};

export default Home;

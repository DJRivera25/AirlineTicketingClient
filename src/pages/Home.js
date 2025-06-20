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
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
      <div className="relative z-10 p-6 max-w-7xl mx-auto space-y-16">
        <HeroSection />
        <FlightSearchForm form={form} handleChange={handleChange} handleSearch={handleSearch} />
        <Footer />
      </div>
    </>
  );
};

export default Home;

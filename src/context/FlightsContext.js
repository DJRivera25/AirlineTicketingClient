// FlightsContext.js
import { createContext, useState } from "react";
import axios from "axios";

const FlightsContext = createContext();

export const FlightsProvider = ({ children }) => {
  const [flights, setFlights] = useState([]);

  const fetchFlights = async (page = 1, limit = 5, search = "") => {
    const res = await axios.get(`${process.env.REACT_APP_API_BASEURL}/flights`, {
      params: {
        page,
        limit,
        search,
      },
    });

    setFlights(res.data.flights); // assuming backend returns { flights, totalPages }
    return res.data;
  };

  const addFlight = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_BASEURL}/flights`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setFlights((prev) => [...prev, res.data]);
  };

  const deleteFlight = async (id) => {
    await axios.delete(`${process.env.REACT_APP_API_BASEURL}/flights/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setFlights((prev) => prev.filter((f) => f._id !== id));
  };

  return (
    <FlightsContext.Provider value={{ flights, fetchFlights, addFlight, deleteFlight }}>
      {children}
    </FlightsContext.Provider>
  );
};

export default FlightsContext; // ✅ Add this line

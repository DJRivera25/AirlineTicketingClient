// data/locations.js

const locations = [
  {
    continent: "Asia",
    countries: [
      {
        country: "Philippines",
        cities: [
          { name: "Manila", code: "MNL" },
          { name: "Cebu", code: "CEB" },
          { name: "Davao", code: "DVO" },
          { name: "Clark", code: "CRK" },
        ],
      },
      {
        country: "Japan",
        cities: [
          { name: "Tokyo", code: "NRT" },
          { name: "Osaka", code: "KIX" },
          { name: "Nagoya", code: "NGO" },
          { name: "Fukuoka", code: "FUK" },
        ],
      },
      {
        country: "South Korea",
        cities: [
          { name: "Seoul", code: "ICN" },
          { name: "Busan", code: "PUS" },
        ],
      },
      {
        country: "Singapore",
        cities: [{ name: "Singapore", code: "SIN" }],
      },
      {
        country: "Thailand",
        cities: [
          { name: "Bangkok", code: "BKK" },
          { name: "Chiang Mai", code: "CNX" },
        ],
      },
    ],
  },
  {
    continent: "Europe",
    countries: [
      {
        country: "United Kingdom",
        cities: [
          { name: "London", code: "LHR" },
          { name: "Manchester", code: "MAN" },
        ],
      },
      {
        country: "Germany",
        cities: [
          { name: "Frankfurt", code: "FRA" },
          { name: "Munich", code: "MUC" },
        ],
      },
    ],
  },
  {
    continent: "North America",
    countries: [
      {
        country: "United States",
        cities: [
          { name: "New York", code: "JFK" },
          { name: "Los Angeles", code: "LAX" },
          { name: "San Francisco", code: "SFO" },
        ],
      },
      {
        country: "Canada",
        cities: [
          { name: "Toronto", code: "YYZ" },
          { name: "Vancouver", code: "YVR" },
        ],
      },
    ],
  },
];

export default locations;

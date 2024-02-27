// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import useLatLng from "../hooks/GetLatLng";
import Message from "./Message";
import Spinner from "./Spinner";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../context/CititesContext";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const navigate = useNavigate();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState(null);
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [lat, lng] = useLatLng();
  const [isLoadingGetDetails, setIsLoadingGetDetails] = useState(false);
  const [getDetailsError, setGetDetailsError] = useState("");
  const [emoji, setEmoji] = useState(null);
  const { createCity, isLoading } = useCities();

  async function handleSubmit(e) {
    e.preventDefault();
    const newCity = {
      cityName,
      country,
      emoji,
      position: { lat, lng },
      date,
      notes,
    };
    console.log(newCity);
    await createCity(newCity);
    navigate("/app/cities");
  }

  useEffect(() => {
    async function getDetails() {
      try {
        setIsLoadingGetDetails(true);
        setGetDetailsError("");
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
        );
        const data = await res.json();
        // console.log(data);
        if (!data.city)
          throw new Error(
            "Data not found ! Click on some habitable land bro :)"
          );
        setCityName(data.city);
        setCountry(data.countryName);
        setEmoji(convertToEmoji(data.countryCode));
      } catch (err) {
        console.log(err);
        setGetDetailsError(err.message);
      } finally {
        setIsLoadingGetDetails(false);
      }
    }
    getDetails();
  }, [lat, lng]);

  if (isLoadingGetDetails) return <Spinner />;
  if (!lat && !lng)
    return <Message message={"Start by clicking somewhere on the map"} />;
  if (getDetailsError) return <Message message={getDetailsError} />;
  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={(e) => {
        handleSubmit(e);
      }}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}
        <ReactDatePicker
          id="date"
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary" onClick={() => navigate(-1)}>
          Add
        </Button>
        <Button
          type="back"
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
        >
          &larr; Back
        </Button>
      </div>
    </form>
  );
}

export default Form;

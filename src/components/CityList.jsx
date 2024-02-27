import styles from "./CityList.module.css";
import style from "./CityItem.module.css";

import Spinner from "./Spinner";
import Message from "./Message";
import { Link } from "react-router-dom";
import { useCities } from "../context/CititesContext";

function CityList() {
  const { cities, isLoading } = useCities();
  if (isLoading) return <Spinner />;
  if (!cities.length) return <Message message="Visit some cities my boi" />;
  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  );
}

function CityItem({ city }) {
  const { cityName, emoji, id, position } = city;
  const { currentCity, deleteCity } = useCities();

  function handleDelete(e) {
    e.preventDefault();
    deleteCity(city.id);
  }

  return (
    <li>
      <Link
        className={`${style.cityItem} ${
          id === currentCity.id ? style["cityItem--active"] : ""
        }`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={style.emoji}>{emoji}</span>
        <h3 className={style.name}>{cityName}</h3>
        <button
          className={style.deleteBtn}
          onClick={(e) => handleDelete(e, city)}
        >
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityList;

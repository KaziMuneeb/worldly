import styles from "./CountryList.module.css";
import CountryItem from "./CountryItem";
import Spinner from "./Spinner";
import Message from "./Message";
import { useCities } from "../context/CititesContext";

function CountryList() {
  const { cities, isLoading } = useCities();

  if (isLoading) return <Spinner />;
  if (cities.length < 0)
    return <Message message="Visit some countries my boi" />;

  const countries = cities.reduce((arr, city) => {
    if (!arr.map((el) => el.country).includes(city.country))
      return [...arr, { country: city.country, emoji: city.emoji }];
    else {
      return arr;
    }
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country, index) => (
        <CountryItem country={country} key={index} />
      ))}
    </ul>
  );
}

export default CountryList;

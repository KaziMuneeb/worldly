import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

const CitiesContext = createContext();

const initalState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loader":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };

    case "currentCity/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };

    case "createdCity":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case "deletedCity":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
      };
    case "rejected":
      return { ...state, error: action.payload, isLoading: false };
    default:
      throw new Error("Ivalid action type detected !");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initalState
  );
  useEffect(function () {
    async function fetchCities() {
      try {
        dispatch({ type: "loader" });
        const res = await fetch(
          "https://my-json-server.typicode.com/KaziMuneeb/worldly/cities/"
        );
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch (err) {
        console.error(err.message);
        dispatch({ type: "rejected", payload: err.message });
      }
    }
    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (Number(id) === currentCity.id) return;
      try {
        dispatch({ type: "loader" });
        const res = await fetch(
          `https://my-json-server.typicode.com/KaziMuneeb/worldly/cities/${id}`
        );
        const data = await res.json();
        dispatch({ type: "currentCity/loaded", payload: data });
      } catch (err) {
        console.error(err.message);
        dispatch({ type: "rejected", payload: err.message });
      }
    },
    [currentCity.id]
  );

  async function createCity(newCity) {
    try {
      dispatch({ type: "loader" });
      const res = await fetch(
        `https://my-json-server.typicode.com/KaziMuneeb/worldly/cities/`,
        {
          method: "POST",
          body: JSON.stringify(newCity),
          headers: { "Content-type": "application/json" },
        }
      );
      const data = await res.json();
      dispatch({ type: "createdCity", payload: data });
    } catch (err) {
      console.error(err.message);
      dispatch({ type: "rejected", payload: err.message });
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: "loader" });
      await fetch(
        `https://my-json-server.typicode.com/KaziMuneeb/worldly/cities/${id}`,
        {
          method: "DELETE",
        }
      );
      dispatch({ type: "deletedCity", payload: id });
    } catch (err) {
      console.error(err.message);
      dispatch({ type: "rejected", payload: err.message });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        getCity,
        currentCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("Cities context was used outside of CiteisProvider");
  return context;
}

export { CitiesProvider, useCities };

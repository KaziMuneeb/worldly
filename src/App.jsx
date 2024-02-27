// import Product from "./pages/Product";
// import Pricing from "./pages/Pricing";
// import HomePage from "./pages/HomePage";
// import Login from "./pages/Login";
// import PageNotFound from "./pages/PageNotFound";
// import AppLayout from "./pages/AppLayout";
import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";
import SpinnerFullPage from "./components/SpinnerFullPage";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";
import { CitiesProvider } from "./context/CititesContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { Suspense, lazy } from "react";
polyfillCountryFlagEmojis();

const Product = lazy(() => import("./pages/Product"));
const Pricing = lazy(() => import("./pages/Pricing"));
const HomePage = lazy(() => import("./pages/HomePage"));
const Login = lazy(() => import("./pages/Login"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const AppLayout = lazy(() => import("./pages/AppLayout"));

function App() {
  return (
    <AuthProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Suspense fallback={<SpinnerFullPage />}>
            <Routes>
              <Route path="" element={<HomePage />} />
              <Route path="product" element={<Product />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="login" element={<Login />} />
              <Route
                path="app"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate replace to="cities" />} />
                <Route path="cities" element={<CityList />} />
                <Route path="cities/:id" element={<City />} />
                <Route path="countries" element={<CountryList />} />
                <Route path="form" element={<Form />} />
              </Route>
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>
  );
}

export default App;

import { BrowserRouter, Routes,Route } from "react-router-dom"
import HomePage from "./pages/Landing page/Home"
import About from "./pages/navbar/About"
import SignIn from "./pages/navbar/SignIn"
import SignUp from "./pages/navbar/SignUp"
import Profile from "./pages/navbar/Profile"
import Headers from "./components/Headers"
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import 'leaflet/dist/leaflet.css';


import PrivateRoute from "./components/PrivateRoute"
import PetStore from "./pages/Adoption/PetStore"
import PetDetails from "./pages/Adoption/PetDetails"
import RehomingForm from "./pages/Rehome/RehomeForm"
import StrayCausePage from "./pages/Shelter/Shelter"
import NGODashboard from "./pages/Ngo/Dashboard"
import VetFinder from "./pages/VetServices/VetServices"

export default function App() {
  return (
    
    < BrowserRouter >
      < Headers />
        <Routes>
        < Route path="/" element={ <HomePage /> }/>
        < Route path="/about" element={ <About /> }/>
        <Route path="/adopt" element={ <PetStore /> }/>
        <Route path="/adopt/:petId" element={ <PetDetails /> }/>
        < Route path="/rehome" element={ <RehomingForm /> }/>
        < Route path="/vet-services" element={ <VetFinder /> }/>
        < Route path="/sign-in" element={ <SignIn /> }/>
        < Route path="/sign-up" element={ <SignUp /> }/>
        <Route path="/stray-shelter" element={ <StrayCausePage /> }/>
        <Route path="/ngo/dashboard" element={ <NGODashboard /> }/>
        <Route  element={ <PrivateRoute /> }>
          < Route path="/profile" element={ <Profile /> }/>
        </Route>
        </Routes>
    </BrowserRouter>
  )
}

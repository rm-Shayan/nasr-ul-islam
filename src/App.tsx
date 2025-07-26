import { Routes,Route,Navigate} from "react-router-dom";
import { ProtectedRoute,Loader } from "./Components";
import { Suspense, lazy } from "react";
import {AuthRoute} from "./Components"
import { Layout } from "./Components/UI/Layout";
import {NamazProvider} from "./Context api"

const Autentication = lazy(() => import("./Pages/Authentication"));
const Login = lazy(() => import("./Pages/login"));
const SignUp = lazy(() => import("./Pages/signup"));
const Dashboard = lazy(() => import("./Pages/Home"));
const Profile = lazy(() => import("./Pages/Profile"));
const Prayer = lazy(() => import("./Pages/Prayer"));
const PrayerLedger=lazy(()=>import("./Pages/PrayerLedger"))
const PrayerHistory = lazy(() => import("./Pages/PrayerHistory"));
const PrayerCards=lazy(() => import("./Pages/PrayerCards"));
const NamazAukat=lazy(() => import("./Pages/NamazAukaat"));
const Setting=lazy(()=>import("./Pages/Setting"))


function App() {
  return (
    <>
     <Suspense fallback={<Loader />}>
     
      <Routes>

        {/* Public Routes */}

 <Route
  path="Auth"
  element={
    <AuthRoute>
      <Autentication /> {/* Yeh component <Outlet /> include karega */}
    </AuthRoute>
  }
>
  <Route index element={<Login />} />        {/* /Auth */}
  <Route path="login" element={<Login />} /> {/* /Auth/login */}
  <Route path="signup" element={< SignUp />} /> {/*Auth/signup*/}
</Route>

        {/* Protected Routes */}

<Route
  element={
    <ProtectedRoute>
      <NamazProvider>
        <Layout  />
      </NamazProvider>
    </ProtectedRoute>
  }
>
  <Route index path="/dashboard" element={<Dashboard />} />

  {/* prayer route */}
<Route
  path="/prayer"
  element={
    <ProtectedRoute>
      <Prayer />
    </ProtectedRoute>
  }
>
<Route index  element={<NamazAukat  />} />
  <Route path="PrayerCards"  element={<PrayerCards />} /> {/* ✅ Default: 5 prayer cards */}
<Route path="PrayerLedger" element={<PrayerLedger  />} />
  <Route path="PrayerHistory" element={<PrayerHistory />} /> {/* ✅ Nested: full history */}
</Route>



  <Route path="/profile" element={<Profile />} >
  <Route index element={<Setting />} />
  </Route>
</Route>


        {/* Default route */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Suspense>
    </>
  );
}


export default App;

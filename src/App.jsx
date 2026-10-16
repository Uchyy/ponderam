import { RouterProvider } from "react-router-dom";
import { router } from "./router.jsx";
import { AuthProvider } from "./providers/AuthProviders.tsx";
import { useState, useEffect } from 'react'
import { supabase } from './utils/supabase'
import { SnackbarProvider } from "./components/SnackBar.tsx";
import { UserProvider } from "./providers/UserProvider.tsx";

export default function App() {
  return <SnackbarProvider>
    <AuthProvider>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </AuthProvider>
  </SnackbarProvider>
}

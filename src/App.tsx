// src/App.tsx
import AppRouterWrapper from "./AppRouterWrapper";
import { Toaster } from "sonner";
import './index.css'

function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <AppRouterWrapper />
    </>
  );
}

export default App;

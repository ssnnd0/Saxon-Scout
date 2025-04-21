// src/App.tsx
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/auth-context-provider";
import { ApiProvider } from "./context/api-context-provider";
import { AppRoutes } from "./routes";
import { RootLayout } from "./components/layout/root-layout";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ApiProvider>
          <RootLayout>
            <AppRoutes />
          </RootLayout>
          <Toaster position="bottom-right" />
        </ApiProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
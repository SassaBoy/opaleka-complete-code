import React from "react";
import { AuthProvider } from "./context/AuthContext"; // Path to the AuthContext
import StackNavigator from "./navigation/StackNavigator"; // Your navigation stack

const App = () => {
  return (
    <AuthProvider>
      <StackNavigator />
    </AuthProvider>
  );
};

export default App;

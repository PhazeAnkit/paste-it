import { Routes, Route } from "react-router-dom";
import CreatePaste from "./pages/createPaste";
import ViewPaste from "./pages/viewPaste";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CreatePaste />} />
      <Route path="/p/:id" element={<ViewPaste />} />
    </Routes>
  );
}

export default App;

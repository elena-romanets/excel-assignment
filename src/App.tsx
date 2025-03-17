import { Route, Routes, BrowserRouter } from "react-router-dom";
import ExcelSheet from "./components/ExcelSheet";
import AssignmentDescription from "./components/AssignmentDescription";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AssignmentDescription />} />
        <Route path="/excel" element={<ExcelSheet />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const AssignmentDescription = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <h1>Technical assignment</h1>
      <p style={{ marginBottom: "20px", width: "50%", textAlign: "center" }}>
        Create a 10000x10000 excel sheet clone, which will allow a user to edit
        any cell. The excel sheet should support basic mathematical operations
        between columns (like A1+B1=C1).
      </p>
      <Button variant="contained" onClick={() => navigate("/excel")}>
        Create a 10_000x10_000 excel sheet clone
      </Button>
    </div>
  );
};

export default AssignmentDescription;

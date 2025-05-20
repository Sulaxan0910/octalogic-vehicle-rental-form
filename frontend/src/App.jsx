import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { DateRangePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import axios from "axios";

export default function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    wheels: "",
    vehicleType: "",
    model: "",
    dateRange: [null, null],
  });
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [models, setModels] = useState([]);
  const [error, setError] = useState("");

  // Fetch vehicle types whenever wheels changes
  useEffect(() => {
    if (formData.wheels) {
      axios
        .get(`http://localhost:5000/api/vehicle-types?wheels=${formData.wheels}`)
        .then((res) => {
          setVehicleTypes(res.data);
          setFormData((fd) => ({ ...fd, vehicleType: "", model: "" }));
          setModels([]);
        })
        .catch(() => {
          setVehicleTypes([]);
        });
    }
  }, [formData.wheels]);

  // Fetch models whenever vehicleType changes
  useEffect(() => {
    if (formData.vehicleType) {
      axios
        .get(`http://localhost:5000/api/vehicles/${formData.vehicleType}`)
        .then((res) => {
          setModels(res.data);
          setFormData((fd) => ({ ...fd, model: "" }));
        })
        .catch(() => {
          setModels([]);
        });
    }
  }, [formData.vehicleType]);

  const handleNext = () => {
    setError("");

    // Validation for each step
    if (step === 1) {
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        setError("Please enter your first and last name.");
        return;
      }
    } else if (step === 2) {
      if (!formData.wheels) {
        setError("Please select number of wheels.");
        return;
      }
    } else if (step === 3) {
      if (!formData.vehicleType) {
        setError("Please select a vehicle type.");
        return;
      }
    } else if (step === 4) {
      if (!formData.model) {
        setError("Please select a specific model.");
        return;
      }
    } else if (step === 5) {
      if (!formData.dateRange[0] || !formData.dateRange[1]) {
        setError("Please select a date range.");
        return;
      }
    }

    if (step === 5) {
      // Submit to backend
      axios
        .post("http://localhost:5000/api/bookings", formData)
        .then(() => alert("Booking successful!"))
        .catch(() => alert("Failed to submit booking."));
    } else {
      setStep(step + 1);
    }
  };
  console.log({formData});

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Step {step} of 5
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}

      {step === 1 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="First Name"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
          />
          <TextField
            label="Last Name"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
          />
        </Box>
      )}

      {step === 2 && (
        <RadioGroup
          value={formData.wheels}
          onChange={(e) => setFormData({ ...formData, wheels: e.target.value })}
        >
          <FormControlLabel value="2" control={<Radio />} label="2 Wheels" />
          <FormControlLabel value="4" control={<Radio />} label="4 Wheels" />
        </RadioGroup>
      )}

      {step === 3 && (
        <RadioGroup
          value={formData.vehicleType}
          onChange={(e) =>
            setFormData({ ...formData, vehicleType: e.target.value })
          }
        >
          {vehicleTypes.length === 0 && (
            <Typography>No vehicle types available</Typography>
          )}
          {vehicleTypes?.map((vt) => (
            <FormControlLabel
              key={vt.id}
              value={vt.id.toString()}
              control={<Radio />}
              label={vt.name}
            />
          ))}
        </RadioGroup>
      )}

      {step === 4 && (
        <RadioGroup
          value={formData.model}
          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
        >
          {models.length === 0 && <Typography>No models available</Typography>}
          {models.map((m) => (
            <FormControlLabel
              key={m.id}
              value={m.id.toString()}
              control={<Radio />}
              label={m.name}
            />
          ))}
        </RadioGroup>
      )}

      {step === 5 && (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateRangePicker
            startText="Start date"
            endText="End date"
            value={formData.dateRange}
            onChange={(newValue) => setFormData({ ...formData, dateRange: newValue })}
            renderInput={(startProps, endProps) => (
              <React.Fragment>
                <TextField {...startProps} sx={{ mr: 2 }} />
                <TextField {...endProps} />
              </React.Fragment>
            )}
          />
        </LocalizationProvider>
      )}

      <Button variant="contained" sx={{ mt: 3 }} onClick={handleNext}>
        {step === 5 ? "Submit" : "Next"}
      </Button>
    </Box>
  );
}

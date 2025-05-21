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
  Paper,
  LinearProgress,
  Container,
  Stack,
  Fade,
  styled,
  Snackbar,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";

// Styled components
const FormPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
}));

const StyledRadio = styled(Radio)(({ theme }) => ({
  "&.Mui-checked": {
    color: theme.palette.primary.main,
  },
}));

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  margin: theme.spacing(0.5, 0),
  padding: theme.spacing(1.0),
  borderRadius: theme.spacing(1),
  width: "100%",
  transition: "all 0.2s ease",
  "&:hover": {
    background: "rgba(0, 0, 0, 0.04)",
  },
  "&.Mui-checked": {
    background: "rgba(25, 118, 210, 0.08)",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(1),
  },
}));

export default function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    wheels: "",
    vehicleType: "",
    vehicleId: "",
    startDate: null,
    endDate: null,
  });
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;
  const baseUrl = import.meta.env.VITE_API_URL;

  // Fetch vehicle types whenever wheels changes
  useEffect(() => {
    if (formData.wheels) {
      axios
        .get(
          `${baseUrl}/vehicle-types?wheels=${formData.wheels}`
        )
        .then((res) => {
          setVehicleTypes(res.data);
          setFormData((fd) => ({ ...fd, vehicleType: "", vehicleId: "" }));
          setVehicles([]);
        })
        .catch(() => {
          setVehicleTypes([]);
          setError("Failed to fetch vehicle types");
        });
    }
  }, [formData.wheels]);

  // Fetch vehicles whenever vehicleType changes
  useEffect(() => {
    if (formData.vehicleType) {
      axios
        .get(`${baseUrl}/vehicles/${formData.vehicleType}`)
        .then((res) => {
          setVehicles(res.data);
          setFormData((fd) => ({ ...fd, vehicleId: "" }));
        })
        .catch(() => {
          setVehicles([]);
          setError("Failed to fetch vehicles");
        });
    }
  }, [formData.vehicleType]);

  const getErrorMessage = (error) => {
    if (!error) return "";

    // Handle specific backend error messages
    if (typeof error === "string") {
      switch (error.toLowerCase()) {
        case "booking overlaps with an existing one":
          return "This vehicle is already booked for the selected dates. Please choose different dates or select another vehicle.";
        case "missing required fields":
          return "Please fill in all required information.";
        case "invalid date format":
          return "Please select valid dates.";
        default:
          return error;
      }
    }
    return "An unexpected error occurred. Please try again.";
  };

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
      if (!formData.vehicleId) {
        setError("Please select a vehicle.");
        return;
      }
    } else if (step === 5) {
      if (!formData.startDate || !formData.endDate) {
        setError("Please select both start and end dates.");
        return;
      }
      if (formData.startDate > formData.endDate) {
        setError("End date must be after start date.");
        return;
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const startDate = new Date(formData.startDate);
      startDate.setHours(0, 0, 0, 0);

      if (startDate < today) {
        setError("Start date cannot be in the past.");
        return;
      }

      // Check if booking is too far in the future (e.g., more than 6 months)
      const sixMonthsFromNow = new Date();
      sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
      if (startDate > sixMonthsFromNow) {
        setError("Bookings can only be made up to 6 months in advance.");
        return;
      }

      // Check if booking duration is within limits (e.g., maximum 30 days)
      const durationInDays = Math.ceil(
        (formData.endDate - formData.startDate) / (1000 * 60 * 60 * 24)
      );
      if (durationInDays > 30) {
        setError("Bookings cannot exceed 30 days.");
        return;
      }
    }

    if (step === 5) {
      submitBooking();
    } else {
      setStep(step + 1);
    }
  };

  // ✅ Submit to backend
  const submitBooking = () => {
    const { firstName, lastName, vehicleId, startDate, endDate } = formData;

    const bookingData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      vehicleId: parseInt(vehicleId),
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
    };

    axios
      .post("${baseUrl}/book", bookingData)
      .then(() => {
        setFormData({
          firstName: "",
          lastName: "",
          wheels: "",
          vehicleType: "",
          vehicleId: "",
          startDate: null,
          endDate: null,
        });
        setStep(1);
        setAlertMessage(
          "Booking successful! Thank you for choosing our service."
        );
        setTimeout(() => setAlertMessage(""), 3000);
      })
      .catch((err) => {
        console.error(err);
        const backendError = err.response?.data?.message;
        setError(getErrorMessage(backendError));
      });
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError("");
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "What's your name?";
      case 2:
        return "How many wheels?";
      case 3:
        return "What type of vehicle?";
      case 4:
        return "Choose your vehicle";
      case 5:
        return "When do you need it?";
      default:
        return "";
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(120deg, #e0f2fe 0%, #f0f9ff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: { xs: 4, md: 8 },
        px: { xs: 2, md: 4 },
      }}
    >
      <Container maxWidth="sm" sx={{ width: "100%" }}>
        <FormPaper elevation={0}>
          <Stack spacing={3}>
            {/* Progress and step indicator */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Step {step} of {totalSteps}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Box>

            {/* Step title */}
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              {getStepTitle()}
            </Typography>

            {/* Error message with improved styling */}
            {error && (
              <Fade in={!!error}>
                <Alert
                  severity="error"
                  sx={{
                    borderRadius: 2,
                    "& .MuiAlert-message": {
                      fontSize: "0.95rem",
                    },
                  }}
                  onClose={() => setError("")}
                >
                  {error}
                </Alert>
              </Fade>
            )}
            {/* Success message with improved styling */}
            {alertMessage && (
              <Fade in={!!alertMessage}>
                <Alert
                  severity="success"
                  sx={{
                    borderRadius: 2,
                    "& .MuiAlert-message": {
                      fontSize: "0.95rem",
                    },
                  }}
                  onClose={() => setAlertMessage("")}
                >
                  {alertMessage}
                </Alert>
              </Fade>
            )}

            {/* Form steps */}
            <Fade in={true} key={step}>
              <Box>
                {step === 1 && (
                  <Stack spacing={3}>
                    <StyledTextField
                      label="First Name"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      fullWidth
                    />
                    <StyledTextField
                      label="Last Name"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      fullWidth
                    />
                  </Stack>
                )}

                {step === 2 && (
                  <RadioGroup
                    value={formData.wheels}
                    onChange={(e) =>
                      setFormData({ ...formData, wheels: e.target.value })
                    }
                  >
                    <StyledFormControlLabel
                      value="2"
                      control={<StyledRadio />}
                      label={
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          2 Wheels
                        </Typography>
                      }
                    />
                    <StyledFormControlLabel
                      value="4"
                      control={<StyledRadio />}
                      label={
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          4 Wheels
                        </Typography>
                      }
                    />
                  </RadioGroup>
                )}

                {step === 3 && (
                  <RadioGroup
                    value={formData.vehicleType}
                    onChange={(e) =>
                      setFormData({ ...formData, vehicleType: e.target.value })
                    }
                  >
                    {vehicleTypes.length === 0 ? (
                      <Typography color="text.secondary">
                        No vehicle types available
                      </Typography>
                    ) : (
                      vehicleTypes?.map((vt) => (
                        <StyledFormControlLabel
                          key={vt.id}
                          value={vt.id.toString()}
                          control={<StyledRadio />}
                          label={
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 500 }}
                            >
                              {vt.name}
                            </Typography>
                          }
                        />
                      ))
                    )}
                  </RadioGroup>
                )}

                {step === 4 && (
                  <RadioGroup
                    value={formData.vehicleId}
                    onChange={(e) =>
                      setFormData({ ...formData, vehicleId: e.target.value })
                    }
                  >
                    {vehicles.length === 0 ? (
                      <Typography color="text.secondary">
                        No vehicles available
                      </Typography>
                    ) : (
                      vehicles.map((vehicle) => (
                        <StyledFormControlLabel
                          key={vehicle.id}
                          value={vehicle.id.toString()}
                          control={<StyledRadio />}
                          label={
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 500 }}
                            >
                              {vehicle.model}
                            </Typography>
                          }
                        />
                      ))
                    )}
                  </RadioGroup>
                )}

                {step === 5 && (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Stack spacing={3}>
                      <DatePicker
                        label="Start Date"
                        value={formData.startDate}
                        onChange={(newValue) =>
                          setFormData({
                            ...formData,
                            startDate: newValue,
                            endDate: null,
                          })
                        }
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: Boolean(error && !formData.startDate),
                          },
                        }}
                        minDate={new Date()}
                      />
                      <DatePicker
                        label="End Date"
                        value={formData.endDate}
                        onChange={(newValue) =>
                          setFormData({ ...formData, endDate: newValue })
                        }
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: Boolean(error && !formData.endDate),
                          },
                        }}
                        minDate={formData.startDate || new Date()}
                      />
                    </Stack>
                  </LocalizationProvider>
                )}
              </Box>
            </Fade>

            {/* Navigation buttons */}
            <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
              {step > 1 && (
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                  }}
                >
                  Back
                </Button>
              )}
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{
                  flex: 1,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                }}
              >
                {step === 5 ? "Complete Booking" : "Continue"}
              </Button>
            </Stack>
          </Stack>
        </FormPaper>
      </Container>
    </Box>
  );
}

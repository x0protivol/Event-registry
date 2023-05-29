import { Box, Container, Stack, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useSigner } from "wagmi";
import * as Yup from "yup";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { ABI, CONTRACT_ADDRESS } from "../utils/web3";

export default function Home() {
  const navigate = useNavigate();
  const { data: signer } = useSigner();
  const [loading, setLoading] = useState(false);

  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

  const formik = useFormik({
    initialValues: {
      eventId: "",
      submit: null,
    },
    validationSchema: Yup.object({
      eventId: Yup.number().max(255).required("Please input your desird ID to navigate"),
    }),
    onSubmit: async (values, helpers) => {
      setLoading(true);
      try {
        const parentEvent = await contract.getParentEventId(values.eventId);
        const parentEventId = parentEvent.toNumber();
        const childEventIds = await contract.getChildEvents(values.eventId);

        if (parentEventId === 0) {
          toast.info("Your Event is parent Event");
          navigate(`/event/${values.eventId}`);
        } else {
          toast.info(`Your Event has parent Event. Parent Event: ${parentEventId}`);
          navigate(`/event/${parentEventId}/${values.eventId}`);
        }
      } catch (err) {
        helpers.setStatus({ success: false });
        if (err.message.includes("reverted")) {
          toast.error("Check if your event is valid or Mint a new one");
        } else {
          helpers.setErrors({ submit: err.message });
        }
        helpers.setSubmitting(false);
      }
      setLoading(false);
    },
  });

  return (
    <Container>
      <Box
        sx={{
          py: 3,
          width: "100%",
        }}
      >
        <form noValidate onSubmit={formik.handleSubmit}>
          <Typography textAlign="center">Navigate to your event</Typography>
          <Stack spacing={1} sx={{ my: 3, display: "flex", alignItems: "center" }}>
            <TextField
              required
              placeholder="1"
              name="eventId"
              label="Event ID"
              error={!!(formik.touched.eventId && formik.errors.eventId)}
              helperText={formik.touched.eventId && formik.errors.eventId}
              value={formik.values.eventId}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              sx={{ width: "35%" }}
            />
          </Stack>
          {formik.errors.submit && (
            <Typography textAlign="center" color="error" sx={{ mt: 3 }} variant="body2">
              {formik.errors.submit}
            </Typography>
          )}
          <Stack spacing={2} sx={{ mb: 3, display: "flex", justifyContent: "center" }} direction="row">
            {/* <Button sx={{ padding: 1, width: "35%" }} type="submit" variant="contained">
              Navigate
            </Button> */}
            <LoadingButton loading={loading} type="submit" variant="contained" sx={{ padding: 1, width: "35%" }}>
              Navigate
            </LoadingButton>
          </Stack>
        </form>
      </Box>
    </Container>
  );
}

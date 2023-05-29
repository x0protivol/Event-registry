import { useParams } from "react-router-dom";
import { useContractRead } from "wagmi";
import { CONTRACT_ADDRESS, ABI } from "../utils/web3";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function Event() {
  const { id } = useParams();
  const { data, isError, isLoading } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "getEventImage",
    args: [id],
  });

  return (
    <Container sx={{ my: 5, display: "flex", justifyContent: "center" }}>
      {isLoading ? (
        <Typography textAlign="center" variant="h3">
          Loading ...
        </Typography>
      ) : isError ? (
        <Typography textAlign="center" variant="h3">
          Event doesn't exist
        </Typography>
      ) : (
        <Card sx={{ width: 345 }}>
          <CardMedia sx={{ height: 345 }} image={`https://ipfs.io/ipfs/${data}`} title="event id" />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Event ID: {id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Event Image
            </Typography>
          </CardContent>
          {/* <CardActions>
            <Button size="small">Share</Button>
            <Button size="small">Learn More</Button>
          </CardActions> */}
        </Card>
      )}
    </Container>
  );
}

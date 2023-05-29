import { useContractRead } from "wagmi";
import { CONTRACT_ADDRESS, ABI } from "../../utils/web3";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { toast } from "react-toastify";

export default function EventCard(props) {
  const { id } = props;
  const navigate = useNavigate();
  const { data, isError } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "getEventImage",
    args: [id],
  });

  // const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

  // const browse = async () => {
  //   const parentEventId = parseInt(ethers.utils.formatEther(await contract.getParentEventId(id)));
  //   const childEventIds = await contract.getChildEvents(id);

  //   if (parentEventId === 0) {
  //     toast.info("Your Event is parent Event");
  //     navigate(`/event/${id}`);
  //   } else {
  //     toast.info("Your Event has parent Event");
  //     navigate(`/event/${parentEventId}/${id}`);
  //   }
  // };

  return (
    <Container sx={{ my: 5, display: "flex", justifyContent: "center" }}>
      {!isError ? (
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
            <Button size="small" onClick={browse}>
              Browse
            </Button>
          </CardActions> */}
        </Card>
      ) : null}
    </Container>
  );
}

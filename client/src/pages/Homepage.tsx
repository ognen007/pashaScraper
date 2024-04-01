import React, { useState } from "react";
import { Flex, Box, Img } from "@chakra-ui/react";
import Pasha from "../assets/Pasha.png";
import { PashaButton } from "../components/PashaButton";
import { PashaInput } from "../components/PashaInput";
import axios from "axios";

export const Homepage: React.FC = () => {
  const [niche, setNiche] = useState("");
  const [city, setCity] = useState("");

  const exportToExcel = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/scrape`, {
        params: {
          niche: niche,
          city: city
        },
        responseType: 'blob' // Specify binary response type as blob
      });

      const blob = new Blob([response.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'google_results.zip'; // Adjust the file name if necessary
      a.click();
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    }
  };

  return (
    <Flex
      width="100%"
      height="100vh"
      bg="#F2F2F2"
      justifyContent="center"
      alignItems="center"
    >
      <Box id="items" textAlign="center">
        <Img src={Pasha} />
        <br />
        <PashaInput setState={setNiche} state={niche} placeholder={"Enter Niche"} />
        <br />
        <PashaInput setState={setCity} state={city} placeholder={"Enter City"} />
        <br />
        <PashaButton label="Submit" onClick={() => exportToExcel()} />
      </Box>
    </Flex>
  );
};

export default Homepage;

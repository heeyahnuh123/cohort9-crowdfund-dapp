import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useConnection } from "...context/connection" 

function useCampaigns() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const campaign = await contract.campaign(); 
        const campaignList = [];

                    }

        setCampaigns(campaignList);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    }

    fetchCampaigns();
  }, []);

  return campaigns;
}

export default useCampaigns;

import { useEffect, useState } from "react";
import useCampaignCount from "./useCampaignCount";
import { useConnection } from "../context/connection";
import {
    getCrowdfundContract,
    getCrowdfundContractWithProvider,
} from "../utils";

const useAllCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const { provider } = useConnection();
    const campaignNo = useCampaignCount();

    useEffect(() => {
        const fetchAllCampaigns = async () => {
            try {
                const contract = await getCrowdfundContract(provider, false);
                const campaignsKeys = Array.from(
                    { length: Number(campaignNo) },
                    (_, i) => i + 1
                );
                const campaignPromises = campaignsKeys.map((id) =>
                    contract.crowd(id)
                );
        
                const campaignResults = await Promise.all(campaignPromises);
        
                const campaignDetailsPromises = campaignResults.map(async (details, index) => {
                    // Get contributors for each campaign
                    const contributors = await contract.getContributors(index + 1);
                    
                    return {
                        id: campaignsKeys[index],
                        title: details.title,
                        fundingGoal: details.fundingGoal,
                        owner: details.owner,
                        durationTime: Number(details.durationTime),
                        isActive: details.isActive,
                        fundingBalance: details.fundingBalance,
                        contributors: contributors, // Include contributors here
                    };
                });
        
                // Wait for all campaign details promises to resolve
                const campaignDetails = await Promise.all(campaignDetailsPromises);
        
                setCampaigns(campaignDetails);
            } catch (error) {
                console.error("Error fetching campaigns:", error);
            }
        };
        

        fetchAllCampaigns();

        // Listen for event
        const handleProposeCampaignEvent = async (id, title, amount, duration) => {
            try {
                const contract = await getCrowdfundContractWithProvider(provider);
                const campaignDetails = await contract.crowd(id);
        
                // Create a new campaign object
                const newCampaign = {
                    id: id,
                    title: title,
                    fundingGoal: amount,
                    owner: campaignDetails.owner,
                    durationTime: Number(duration),
                    isActive: campaignDetails.isActive,
                    fundingBalance: campaignDetails.fundingBalance,
                    contributors: [], // Initialize contributors as an empty array
                };
        
                // Add the new campaign to the existing campaigns
                setCampaigns((prevCampaigns) => [...prevCampaigns, newCampaign]);
            } catch (error) {
                console.error("Error handling ProposeCampaign event:", error);
            }
        };
        
        const contract = getCrowdfundContractWithProvider(provider);
        contract.on("ProposeCampaign", handleProposeCampaignEvent);

        return () => {
            contract.off("ProposeCampaign", handleProposeCampaignEvent);
        };
    }, [campaignNo, provider]);

    return campaigns;
};

export default useAllCampaigns;

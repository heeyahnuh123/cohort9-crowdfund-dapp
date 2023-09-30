import { useEffect, useState } from "react";
import useCampaignCount from "./useCampaignCount";
import { useConnection } from "../context/connection";
import {
    getCrowdFundInterface,
    getCrowdfundContractWithProvider,
    getMulticall2ContractWithProvider,
} from "../utils";
import { crowdfundContractAddress } from "../constants/addresses";

const useAllCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const { provider } = useConnection();
    const campaignNo = useCampaignCount();

    useEffect(() => {
        const fetchAllCampaigns = async () => {
            if (!campaignNo) return;
            try {
                const multicall2Contract =
                    getMulticall2ContractWithProvider(provider);

                const campaignsKeys = Array.from(
                    { length: Number(campaignNo) },
                    (_, i) => i + 1
                );
                const campaignPromises = campaignsKeys.map((id) =>
                    contract.crowd(id)
                );

                const campaignResults = await Promise.all(campaignPromises);

                const campaignDetails = campaignResults.map(
                    (details, index) => ({
                        id: campaignsKeys[index],
                        title: details.title,
                        fundingGoal: details.fundingGoal,
                        owner: details.owner,
                        durationTime: Number(details.durationTime),
                        isActive: details.isActive,
                        fundingBalance: details.fundingBalance,
                        contributors: details.contributors,
                    })
                );

                setCampaigns(campaignDetails);
            } catch (error) {
                console.error("Error fetching campaigns:", error);
            }
        };
        

        fetchAllCampaigns();
    }, [campaignNo, provider]);

    useEffect(() => {
        // Listen for event
        const handleProposeCampaignEvent = (id, title, amount, duration) => {
            console.log({ id, title, amount, duration });
        };
        const contract = getCrowdfundContractWithProvider(provider);
        contract.on("ProposeCampaign", handleProposeCampaignEvent);

        return () => {
            contract.off("ProposeCampaign", handleProposeCampaignEvent);
        };
    }, [campaigns, provider]);

    return campaigns;
};

export default useAllCampaigns;

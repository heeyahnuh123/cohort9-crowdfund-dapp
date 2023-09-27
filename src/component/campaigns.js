import React from "react";
import useCampaigns from "./hooks/useCampaigns"; 

function YourComponent() {
  const campaigns = useCampaigns(); // Use the custom hook to fetch campaigns

  // Render campaigns in your component
  return (
    <div>
      <h2>List of Campaigns:</h2>
      <ul>
        {campaigns.map((campaign) => (
          <li key={campaign.id}>
            
<strong>Name:</strong> {campaign.name}<br />
            <strong>Description:</strong> {campaign.description}<br />
           </li>
        ))}
      </ul>
    </div>
  );
}

export default YourComponent;


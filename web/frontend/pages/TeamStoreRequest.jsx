import { Page, Layout,Card } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { TeamStoreList } from "../components";
export default function TeamStoreRequest() {
  return (
    <Page>
      <TitleBar
        title="Requests"
        primaryAction={null}
      />
    
      <TeamStoreList />
    </Page>
  );
}

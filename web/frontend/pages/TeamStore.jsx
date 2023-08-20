import { Page, Layout,Card } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { TeamStoreEdit } from "../components";
export default function TeamStore() {
  return (
    <Page>
      <TitleBar
        title="Customers Team Store"
        primaryAction={null}
      />
    
      <TeamStoreEdit />
    </Page>
  );
}

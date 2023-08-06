import { Page, Layout,Card } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { EditForm } from "../components";
import { useLocation } from "react-router-dom";
export default function ManageCode() {
  const product = useLocation().search;
  const productid = new URLSearchParams(product).get('id');


  return (
    <Page>
      <TitleBar
        title="Edit"
        primaryAction={null}
      />
    
      <EditForm />
    </Page>
  );
}

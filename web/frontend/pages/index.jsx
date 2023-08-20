import { useNavigate, TitleBar, Loading, button } from "@shopify/app-bridge-react";
import {
  Card,
  EmptyState,
  Layout,
  Page,
  SkeletonBodyText,
  Button,
} from "@shopify/polaris";
import { QRCodeIndex } from "../components";
import { useAppQuery } from "../hooks";

export default function HomePage() {
  /*
    Add an App Bridge useNavigate hook to set up the navigate function.
    This function modifies the top-level browser URL so that you can
    navigate within the embedded app and keep the browser in sync on reload.
  */
  const navigate = useNavigate();

  /* useAppQuery wraps react-query and the App Bridge authenticatedFetch function */
 
  return (
    <Page>
     
      <Layout>
        <Layout.Section>
        <Card sectioned>
        <EmptyState
          heading=""
          /* This button will take the user to a Create a QR code page */
        
          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
        >
          <p>
            Add products Advanced Options
          </p>
          
          <p>
          <Button url="https://admin.shopify.com/store/big-league-shirts/products" primary>Add Advance Options Editing</Button>
          </p>
         
          <p style={{marginTop:15}}>
          <Button url="https://admin.shopify.com/store/big-league-shirts/customers" primary>Add Customers Edit</Button>
          </p>
 
          </EmptyState>
      </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

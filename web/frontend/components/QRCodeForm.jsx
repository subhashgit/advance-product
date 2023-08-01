import { useState, useCallback, useEffect } from "react";
import {
  Banner,
  Card,
  Form,
  FormLayout,
  TextField,
  Button,
  ChoiceList,
  Select,
  Thumbnail,
  Icon,
  Stack,
  TextStyle,
  Layout,
  EmptyState, RadioButton
} from "@shopify/polaris";
import {
  ContextualSaveBar,
  ResourcePicker,
  useNavigate,
} from "@shopify/app-bridge-react";
import { ImageMajor, AlertMinor } from "@shopify/polaris-icons";
import { useLocation } from "react-router-dom";
/* Import the useAuthenticatedFetch hook included in the Node app template */
import { useAuthenticatedFetch, useAppQuery } from "../hooks";

/* Import custom hooks for forms */
import { useForm, useField, notEmptyString } from "@shopify/react-form";


export function QRCodeForm() {
  const product = useLocation().search;
  const productid = new URLSearchParams(product).get('id');
  const fetch = useAuthenticatedFetch();
const [producttitle, setproducttitle] = useState();
const [productimage, setproductimage] = useState();

const [radioValue, setradioValue] = useState('');



const handleRadio = () => {alert(this.value)}

  useEffect(()=> {
    const fetchData =  async () => {
        try {
            const response = await fetch("/api/products/"+productid, {
              id: productid
          })
             const  getdata = await response.json();
             //console.log(getdata);
              setproducttitle(getdata.title);
              setproductimage(getdata.image.src);

        } catch(err){
            console.log(err)
        }
    }
       fetchData();

  },[])

  const [title, setTitle] = useState('')

 

  
  const handleSubmit = async () => {
    alert(radioValue);
    await fetch("/api/products/update/"+productid, {
      id: productid
  })
 }

  return (
    <Stack vertical>
    
      <Layout>
        <Layout.Section>

          <Thumbnail
      source={productimage}
      size="large"
      
    />

        <h1 style={{fontWeight: "bold", fontSize:20,marginBottom:40}}>{producttitle}</h1>
          <Form onSubmit={handleSubmit}>
            
            <FormLayout>
              
            <Card  sectioned title="Enabel Custom Design">
  <p>
            <RadioButton
             label="Enable"
             id="true"
             name="enabledesign"
             value="true"
             onChange={e => setradioValue('true')} 

      />
    
      <RadioButton
       label="Disable"
       id="false"
        value = 'false'
       name="enabledesign"
     
       onChange={e => setradioValue('false')} 
      />
      </p>
          
      <p   style={{marginTop:15}}>


                                <Button submit primary >Save</Button>

                                </p>            
                        </Card>

              
            </FormLayout>
          </Form>
        </Layout.Section>
      
       
      </Layout>
    </Stack>
  );
}
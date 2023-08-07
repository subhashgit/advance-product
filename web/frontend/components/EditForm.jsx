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
  EmptyState, RadioButton,Grid,Page,Toast,Frame
  
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


export function EditForm() {
  const product = useLocation().search;
  const productid = new URLSearchParams(product).get('id');
  const fetch = useAuthenticatedFetch();
const [producttitle, setproducttitle] = useState();
const [productimage, setproductimage] = useState('placeholder');
const [customDesign, setcustomDesign] = useState('false');
const [customDesignid, setcustomDesignid] = useState('');
const [customnumberid, setcustomnumberid] = useState('');
const [customnameid, setcustomnameid] = useState('');

const [customNumber, setcustomNumber] = useState('false');
const [customName, setcustomName] = useState('false');
const[enabledesignnamespace,setdesignnamespace ] = useState([]);

  useEffect(()=> {
    const fetchData =  async () => {
        try {
            const response = await fetch("/api/products/"+productid, {
              id: productid
          })
             const  getdata = await response.json();
             //console.log(getdata);
              setproducttitle(getdata.title);
              if(getdata.image != null)
            {  
              setproductimage(getdata.image.src);
            }
           

        } catch(err){
            console.log(err)
        }
    }
   fetchData();      

  },[])

  
  useEffect(()=> {

    const handlegetField = async () => {

      try {
          const responsed = await fetch("/api/products/metafields/"+productid, {
            id: productid,
            post:"get"
        })
         //  await console.log(responsed.json());
           
         const getresponsedata = await responsed.json();
           
         //  setdesignnamespace(getresponsedata);
          
 const data = getresponsedata.data; 
 console.log(getresponsedata);
 const resultupload = data.find(num => num.namespace === "advanceapp" && num.key === "isenableupload" );
  const resultcustomNumber = data.find(num => num.namespace === "advanceapp" && num.key === "iscustomnumber" );
  const resultcustomName = data.find(num => num.namespace === "advanceapp" && num.key === "iscustomname" );
 
  if(resultupload){
  setcustomDesign(resultupload.value);
  setcustomDesignid(resultupload.id); 
 }
 if(resultcustomNumber){
   setcustomNumber(resultcustomNumber.value);
   setcustomnumberid(resultcustomNumber.id); 
 }
 if(resultcustomName){
   setcustomName(resultcustomName.value);
   setcustomnameid(resultcustomName.id); 
 }
 
           
    
      } catch(err){
          console.log(err)
      }
    }
    handlegetField();

  },[])

  const [title, setTitle] = useState('')
  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive((active) => !active), []);
  const toastMarkup = active ? (
    <Toast content="Saved" onDismiss={toggleActive} duration={4500}/>
  ) : null;
 

  
  const handleSubmit = async () => {
setActive(true);

    try {
        const response = await fetch("/api/products/update/"+productid,{
            method:"put",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
            body: 
              JSON.stringify({ 
                id:productid,
              designval: customDesign,
              nameval:customName,
              numberval:customNumber
        })
           
            
   })
         await console.log(response.json());
        

    } catch(err){
        console.log(err)
    }


/**Metaupdate */

try {
  const response = await fetch("/api/products/metafields/update/"+productid,{
      method:"put",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
      body: 
        JSON.stringify({ 
          id:productid,
        designval: customDesign,
        nameval:customName,
        numberval:customNumber,
        customsesignid:customDesignid,
        customnumberid:customnumberid,
        customnameid:customnameid
  })
     
      
})
   await console.log(response.json());
  

} catch(err){
  console.log(err)
}



 }



  return (
    <Frame>
    <Page>
    <Stack vertical>
    
      <Layout>
        <Layout.Section>
        <Grid>
        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 2, xl: 2}}>
         
          <Thumbnail      source={productimage}      size="large"/>
         </Grid.Cell>
        <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 9, lg: 6, xl: 6}}>
    
          <h1 style={{fontWeight: "bold", fontSize:20,marginTop:30  ,textAlign:'left'}}>{producttitle}</h1>
         </Grid.Cell>
      </Grid>
      </Layout.Section>
         

      <Layout.Section>
          <Form onSubmit={handleSubmit}>
            
            <FormLayout>
              
            <Card  sectioned title="Enabel Custom Design">
  <p>
            <RadioButton
             label="Enable"
             id="true"
             name="enabledesign"
             value="true"
             checked={customDesign === 'true'}
             onChange={e => setcustomDesign('true')} 

      />
      <RadioButton
       label="Disable"
       id="false"
        value = 'false'
       name="enabledesign"
       checked={customDesign === 'false'}
       onChange={e => setcustomDesign('false')} 
      />
      </p>
          
    
                        </Card>
                        
                        <Card  sectioned title="Enabel Custom Name in Jersy">
  <p>
            <RadioButton
             label="Enable"
             id="truen"
             name="customName"
             value="true"
             checked={customName === 'true'}
             onChange={e => setcustomName('true')} 

      />
      <RadioButton
       label="Disable"
       id="falsen"
        value = 'false'
       name="customName"
       checked={customName === 'false'}
       onChange={e => setcustomName('false')} 
      />
      </p>
          
    
        
         
                        </Card>
                        <Card  sectioned title="Enabel Custom Number in Jersy">
  <p>
            <RadioButton
             label="Enable"
             id="trues"
             name="customNumber"
             value="true"
             checked={customNumber === 'true'}
             onChange={e => setcustomNumber('true')} 

      />
      <RadioButton
       label="Disable"
       id="falses"
        value ='false'
       name="customNumber"
       checked={customNumber === 'false'}
       onChange={e => setcustomNumber('false')} 
      />
      </p>
          
      <p   style={{marginTop:15}}>


                                <Button submit primary >Save</Button>

                                </p>            
                               
                                
        
         
                        </Card>
            </FormLayout>
          </Form>
          {toastMarkup}
        </Layout.Section>
      
      </Layout>
    </Stack>
    </Page>
    </Frame>
  );
}
import { useState, useCallback, useEffect } from "react";
import {
  Card,
  ResourceList,
  Avatar,
  ResourceItem,
  Button,
  RadioButton,
  Icon,
  TextField,
  Grid,
  FormLayout,
  Form,
  Toast,
  Frame,
  Tag

} from '@shopify/polaris';
import {
  ContextualSaveBar,
  ResourcePicker,
  useNavigate,
  useAppBridge
} from "@shopify/app-bridge-react";
import {
  DuplicateMinor
} from '@shopify/polaris-icons';

import { useAuthenticatedFetch, useAppQuery } from "../hooks";
import { useLocation } from "react-router-dom";
export  function TeamStoreEdit() {

  const customerparam = useLocation().search;
  const customerid = new URLSearchParams(customerparam).get('id');
  const [newlatestuser, setnewlatestuser] = useState('');
  const[uniquurl,setuniqurl] = useState('');
  const [teamcustomer, setteamcustomer] = useState('false');
  const [teamcustomerid, setteamcustomerid] = useState('');
  const [producthandlesid, setproducthandlesid] = useState('');
  const [shoplink, setshoplink] = useState('');
  const [storelink, setstorelink] = useState('');
  const [storename, setstorename] = useState('');
  const handleStoreName = useCallback(
    (newValue) => setstorename(newValue),
    [],
  );

  const[getshopdata,setgetshopdata] = useState('bigleagueshirts.com');
  const fetch = useAuthenticatedFetch();
  const [productids, setproductids] = useState([]);  
  const [selectedproducts, setselectedproducts] = useState('');  
 
  const [showResourcePicker, setShowResourcePicker] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const toggleResourcePicker = useCallback(
   () => setShowResourcePicker(!showResourcePicker),
   [showResourcePicker]
 );
 const date = new Date();

 const [active, setActive] = useState(false);
const toggleActive = useCallback(() => setActive((active) => !active), []);
const toastMarkup = active ? (
  <Toast content="Saved" onDismiss={toggleActive} duration={4500}/>
) : null;

  const [producthandles, setproducthandles] = useState([]);
  
  const removeTag = useCallback(
    (tag) => () => {

      setproducthandles((previousTags) =>
        previousTags.filter((previousTag) => previousTag !== tag),
      );
    },
    [],
  );

  




const pageid = 8008745091322;
//const pageid = 8557278953756;

  useEffect(()=> {
    
    const fetchData =  async () => {
        try {
            const response = await fetch("/api/customer/"+customerid,{
            method:'get'
                })
             const  getdata = await response.json();
             setnewlatestuser(getdata);
        } catch(err){
            console.log(err);
        }
    }

    const fetchShop =  async () => {
      try {
          const response = await fetch("/api/shop")
           const  getshopdata = await response.json(); 
           setgetshopdata(getshopdata.data[0].domain);
         
      } catch(err){
          console.log(err);
      }
  }
  setuniqurl(customerid);
   fetchData();      
   fetchShop();
  },[])
 
/***getmeta */
useEffect(()=> {

  const handlegetField = async () => {

   
    try {
        const responsed = await fetch("/api/customer/metafields/"+pageid, {
          customerid: customerid,
          post:"get"
      })
       //  await console.log(responsed.json());
         
       const getresponsedata = await responsed.json();
         console.log(getresponsedata);
       //  setdesignnamespace(getresponsedata);
        
const data = getresponsedata.data; 
if(data){
const resultisisenable = data.find(num => num.namespace === "teamstorevisivility" && num.key === customerid );
const resultcustomproducts = data.find(num => num.namespace === "teamstoreproducts" && num.key === customerid );
const resultstorelink = data.find(num => num.namespace === "teamstorelink" && num.key === customerid );
const resultstorename = data.find(num => num.namespace === "teamstorename" && num.key === customerid );
    

if(resultisisenable){
  setteamcustomer(resultisisenable.value);
setteamcustomerid(resultisisenable.id); 
}
if(resultcustomproducts){
//setproducthandles(resultcustomproducts.value);
 setproducthandlesid(resultcustomproducts.id); 
 var temp = new Array();
 temp = resultcustomproducts.value.split(",")
 setproducthandles(temp);

}

if(resultstorelink){
  setuniqurl(resultstorelink.value);
  setstorelink('https://'+getshopdata+'/products/team-store?id='+customerid)

}

if(resultstorename){
  setstorename(resultstorename.value);
}


}
    } catch(err){
        console.log(err)
    }
  }
  handlegetField();

},[])

/**endgetmeta */

const getselectedproducts  = useCallback(({ selection }) => { 

const textarray = [];
for ( let i = 0; i < selection.length; i++) { 
  const csvLine = (selection[i].handle);
  textarray.push(csvLine)
}

const children = producthandles.concat(producthandles, textarray); 


function removeDuplicates(arr) {
    return arr.filter((item,
      index) => arr.indexOf(item) === index);
    }
     const getremo = removeDuplicates(children);
   setproducthandles(getremo);




//setselectedproducts(textarray.join(', '));

//console.log(selectedproducts);
}, []);




const handleapro = async() => {

  setshoplink('https://'+getshopdata+'/products/team-store/?id='+customerid);   
//console.log(uniquurl);
//return;
      try {
          const response = await fetch("/api/customer/update/"+pageid,{
              method:"put",
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
              body: 
                JSON.stringify({ 
                  id:pageid,
                  customerid:customerid,
                  isenable:teamcustomer,
                  stlink:uniquurl,
                  storename:storename,
                  products:producthandles.join(', ')
          })
                           
     })
           await console.log(response.json());
           setActive(true);    

          } catch(err){
          console.log(err)
      }
  




}


/*
const removeTag = useCallback((tagv) => () => {
const index = producthandles.indexOf(tagv);
if (index > -1) { 
  producthandles.splice(index, 1); 
}
console.log(producthandles);

setproducthandles(producthandles);

  },
  [],
);
*/

const tagMarkup = producthandles.map((option) => (
  <Tag key={option} onRemove={removeTag(option)} >
    {option}
  </Tag>
));
   
//console.log(newlatestuser);
  return (
    <Frame>
    <Card>
      <Card.Section>
      <Form onSubmit={handleapro}>
            
            <FormLayout>
      <h3 style={{marginBottom:15,fontSize:20}}> <b>{newlatestuser.email} </b>    Team store</h3>
    
        <RadioButton
             label="Enable"
             id="trues"
             name="teamcustomer"
             value="true"
             checked={teamcustomer === 'true'}
             onChange={() => setteamcustomer('true')} 

      /> 
      <RadioButton
             label="Disable"
             id="falses"
             name="teamcustomer"
             value="false"
             checked={teamcustomer === 'false'}
             onChange={() => setteamcustomer('false')} 

      />
     <Grid>
  <Grid.Cell columnSpan={{xs: 10, sm: 10, md: 10, lg: 10, xl: 10}}>
  <TextField
   value={storename}
   label="Store Name"
   type="text"
   onChange={handleStoreName}
   autoComplete="off"
 
  />



  </Grid.Cell>
</Grid>
 <Button onClick={toggleResourcePicker}>
                        Select product
                      </Button>
                      {showResourcePicker && (
                  <ResourcePicker
                      resourceType="Product"
                      showVariants={false}
                      selectMultiple={true}
                      onCancel={toggleResourcePicker}
                      onSelection={getselectedproducts}
                      open
                    />
                    )}

{tagMarkup}
<Grid>
  <Grid.Cell columnSpan={{xs: 10, sm: 10, md: 10, lg: 10, xl: 10}}>
  <TextField
   value={storelink ? storelink : shoplink }
   label="Customer Team store link"
   type="text"
 
  />
  </Grid.Cell>
  <Grid.Cell columnSpan={{xs: 2, sm: 2, md: 2, lg: 2, xl: 2}}>
{/**
    <Button style={{marginTop:24,}} icon={DuplicateMinor} accessibilityLabel="Click to copy" />
     */}
    </Grid.Cell>
    </Grid>



   
           <Button primary  submit>Save</Button> 
          
           
           </FormLayout>
           {toastMarkup}
           </Form>

           </Card.Section>
    </Card>
       </Frame>
  );
}
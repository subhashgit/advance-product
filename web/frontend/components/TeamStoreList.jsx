import { useState, useCallback, useEffect } from "react";
import {
  Card,
  ResourceList,
  Avatar,
  ResourceItem,
  Button,
} from '@shopify/polaris';
import { useAuthenticatedFetch, useAppQuery } from "../hooks";
import { useLocation } from "react-router-dom";
export  function TeamStoreList() {

  const customerparam = useLocation().search;
  const customerid = new URLSearchParams(customerparam).get('id');
  const [newlatestuser, setnewlatestuser] = useState('')
  const fetch = useAuthenticatedFetch();
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
   fetchData();      

  },[])
 
const handleapro = async () => {
//  setActive(true);  

      try {
          const response = await fetch("/api/customer/update/"+customerid,{
              method:"put",
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
              body: 
                JSON.stringify({ 
                  id:customerid
          })
             
              
     })
           await console.log(response.json());
          
  
      } catch(err){
          console.log(err)
      }
  

  
  
   }
  
  

//console.log(newlatestuser);
  return (
    <Card>
         <div style={{padding:15,position:'relative'}}>  
          <p style={{marginBottom:15}}> <b>{newlatestuser.first_name} ({newlatestuser.email}) </b>   Request for Team store</p>
           <Button primary size="slim" onClick={handleapro}>Aprove</Button> 
           </div>
       
    </Card>
  );
}
import {
  Page,
  Layout,
  Text,
  Card,
  Grid,
  Badge,
  BlockStack,
  IndexTable,
  Box,
  Button, 
  Popover, 
  ActionList
} from "@shopify/polaris";
import { useState, useCallback } from 'react';
import { redirect } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { authenticate } from "../shopify.server"; 
import db from "../db.server";    

export const loader = async ({ request }) => {

  const products = await db.product.findMany();
  return products;
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const data = {
    ...Object.fromEntries(await request.formData())
  };

  console.log('data');
  console.log(data);
  if(data.action == "delete"){
    const deleteRes = await db.product.delete({
      where: {
        id: parseInt(data.id),
      }
    });
    console.log(deleteRes);
  } else {
    return redirect(`/app/funnels/${data.id}`);
  }


  return null;
};






export default function Index() { 
  console.log('test');
 
  const submit = useSubmit();
 
  
  
  function PopoverWithActionList({id}) {
    console.log(id); 

    const [popoverActive, setPopoverActive] = useState(false);
  
    const togglePopoverActive = useCallback(
      () => setPopoverActive((popoverActive) => !popoverActive),
      [popoverActive],
    );
  
    const handleAction = (action, id) => {

        const data = {
          action: action,
          id: id
        };
        
        
  
        submit(data, { method: "post" });
      
      
      
    };
  
    const activator = (
      <Button onClick={togglePopoverActive} disclosure>
        More actions
      </Button>
    );
  
    
  
    return (
      <div style={{ marginBottom: '0px' }}>
        <Popover
          active={popoverActive}
          activator={activator}
          autofocusTarget="first-node"
          onClose={togglePopoverActive}
        >
          <ActionList
            actionRole="menuitem"
            items={[{ content: 'Edit', onAction: () => handleAction('edit', id) }, { content: 'Remove', onAction: () => handleAction('delete', id) }]}
          />
        </Popover>
      </div>
    );
  }



  const productsDB = useLoaderData();
  const orders = productsDB;
  const resourceName = {
    singular: 'order',
    plural: 'orders',
  };

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1); 

  let hasPrev = false;
  let hasNext;
  if(currentPage == 1){
     hasPrev = false;
  } else {
     hasPrev = true;
  }

  if(orders.length%itemsPerPage == 0){
    if( currentPage == orders.length/itemsPerPage ){
      hasNext = false;
    } else {
      hasNext = true;
    }
  } else {
    if( currentPage == Math.floor(orders.length/itemsPerPage) + 1 ){
      hasNext = false;
    } else {
      hasNext = true;
    }
  }
  
  const currentPageProducts = orders.slice((currentPage - 1) * itemsPerPage, (currentPage - 1) * itemsPerPage + itemsPerPage);

  
  
  const rowMarkup = currentPageProducts.map(
    (
      {id, triggeredTitle, offeredTitle, discount, title},
      index,
    ) => (
      
      <IndexTable.Row
        id={id}
        key={id}
        
        position={index}
      >
        <IndexTable.Cell>{id}</IndexTable.Cell>
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {title}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{triggeredTitle}</IndexTable.Cell>
        <IndexTable.Cell>{offeredTitle}</IndexTable.Cell>
        <IndexTable.Cell>{discount}</IndexTable.Cell>
        <IndexTable.Cell>
          <PopoverWithActionList id={id}/>
        </IndexTable.Cell>
      </IndexTable.Row>
    ),
  );
  
 
  return (
    <Page>
    <BlockStack style={{'marginBottom': "10px", "justify-content": "end"}} align="center">
    <Button style={{marginLeft: "auto"}} url="settings">Create funnel</Button>
    </BlockStack>
    <Box paddingBlockEnd="400">
        <Layout>
        <Layout.Section>
          <Card>
        
        <IndexTable
          resourceName={resourceName}
          itemCount={orders.length}
          headings={[
            {title: 'id'},
            {title: 'Funnel title'},
            {title: 'Triggered title'},
            {title: 'Offered title'},
            {title: 'Discount'},
            {title: 'Actions'}
          ]}
          selectable={false}
          pagination={{
            hasNext: hasNext,
            label: `${currentPage}`,
            hasPrevious: hasPrev,
            onPrevious: () => { 
              setCurrentPage( prevState => prevState - 1 );
            },
            onNext: () => { 
              setCurrentPage( prevState => prevState + 1 );
            },
          }}
        >
          {rowMarkup}
        </IndexTable>
        </Card>
        </Layout.Section>
        </Layout>
    </Box>
    </Page>
  );
}

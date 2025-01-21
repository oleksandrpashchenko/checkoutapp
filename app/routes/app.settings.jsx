import {
  Card,
  Layout,
  Button,
  Grid,
  Divider,
  Page,
  Text,
  TextField,
  InlineGrid,
  PageActions,
  Select,
  BlockStack,
  Banner
} from "@shopify/polaris";

import { useEffect, useState, useCallback } from 'react';
import { useSubmit, useActionData } from "@remix-run/react";
// import { authenticate } from "../shopify.server";
import db from "../db.server";


const Placeholder = ({ height = 'auto' }) => {
  return (
    <div
      style={{
        height: height,
      }} 
    />
  );
}; 

export const action = async ({ request }) => {
  // const { admin } = await authenticate.admin(request);
  const data = {
    ...Object.fromEntries(await request.formData())
  };

  const getTriggered = await prisma.product
  .findMany({
    where: {
      triggeredId: data.triggeredId,
    },
  })

  console.log('find');
  if(getTriggered.length){
    console.log('yes');
    return 'popupFailed';
  }
  console.log(getTriggered);

  const dbState = await db.product.create({
    data: {
      triggeredTitle: data.triggerTitle,
      offeredTitle: data.offerTitle,
      triggeredId: data.triggeredId,
      offeredId: data.offerId,
      discount: parseInt(data.discount),
      title: data.title,
      shop: "firstremixapp"
    }
  });  

  console.log(data);

  return 'popupSuccess';
};



export default function SettingsPage() {
  const submit = useSubmit();
  const [errors, setErrors] = useState({});
  const handleSave = () => {
    console.log('save');

    let validationErrors = {};
    if (!title) validationErrors.title = 'Title is required';
    if (!triggered.title) validationErrors.triggered = 'Trigger product is required';
    if (!offered.title) validationErrors.offered = 'Offered product is required';

    console.log(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Stop form submission
    }



    const data = {
      title: title,
      triggerTitle: triggered.title,
      offerTitle: offered.title,
      triggeredId: triggered.id,
      offerId: offered.id,
      discount: selected
    };

    setTitle('');
    setTriggered({});
    setOffered({});
    
      submit(data, { method: "post" });
      setErrors({})
 

    
  };

  async function selectProduct(type) {

    const products = await window.shopify.resourcePicker({
      type: "product",
      action: "select", // customized action verb, either 'select' or 'add',
    });
    console.log(products[0]);

    if (type == 'trigger') {
      setTriggered({ title: products[0].title, id: products[0].id })
    } else {
      setOffered({ title: products[0].title, id: products[0].id })
    }
  }

  const actionData = useActionData();
  

  const [selected, setSelected] = useState('10');
  const [triggered, setTriggered] = useState({});
  const [offered, setOffered] = useState({});
  const [title, setTitle] = useState('');
  const [popup, setPopup] = useState('');

  useEffect(() => {
    if (actionData) {
      setPopup(actionData);
    }
  }, [actionData]);
  
  const handleSelectChange = useCallback(
    (value) => setSelected(value),
    [],
  );

  const handleTitleChange = useCallback((value) => setTitle(value));

  const options = [
    { label: '10%', value: '10' },
    { label: '20%', value: '20' },
    { label: '30%', value: '30' },
  ];

  console.log(popup);

  return (
    <Page>
      {popup == "popupSuccess" &&
        <Banner
          title="Your shipping label is ready to print."
          tone="success"
          onDismiss={() => {
            setPopup("");
          }}
        />
      }
      {popup == "popupFailed" &&
        <Banner
          title="Triggered product alredy exists"
          tone="critical"
          onDismiss={() => {
            setPopup("");
          }}
        />
      }
      <Layout>


        <Layout.Section>
          <Text variant="heading2xl" as="h3">
            Funnel create
          </Text>
          <Placeholder height="24px" />
          <Divider borderColor="border" />
          <Placeholder height="24px" />

          <Grid>
            <Grid.Cell columnSpan={{ xs: 4, sm: 3, md: 3, lg: 4, xl: 4 }}>
              <BlockStack style={{'height': "100%", "flex-direction": "column", "justify-content": "center"}} align="center">
                <Text variant="headingLg" as="h6">
                  Title
                </Text>
                <Text variant="headingSm" as="p" tone="base" fontWeight="regular">
                  Some text here
                </Text>
              </BlockStack>

            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 8, sm: 3, md: 3, lg: 8, xl: 8 }}>
              <BlockStack align="center">
                <Text tone="critical">{ errors.title ? errors.title : ""}</Text>
                <Card background={ errors.title ? "bg-surface-critical-active" : "bg-surface" } title="Orders" sectioned>
                  <InlineGrid alignItems="center" columns={2}>

                    <TextField
                      value={title}
                      onChange={handleTitleChange}

                      type="text"
                      autoComplete="title"
                    />
                    
                  </InlineGrid>
                </Card>
                
              </BlockStack>
            </Grid.Cell>
          </Grid>
          <Placeholder height="40px" />

          <Grid>
            <Grid.Cell columnSpan={{ xs: 4, sm: 3, md: 3, lg: 4, xl: 4 }}>
            <BlockStack style={{'height': "100%", "flex-direction": "column", "justify-content": "center"}} align="center">
              <Text variant="headingLg" as="h6">
                Trigger
              </Text>
              <Text variant="headingSm" as="p" tone="base" fontWeight="regular">
                Some text here
              </Text>
              </BlockStack>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 8, sm: 3, md: 3, lg: 8, xl: 8 }}>
              <Text tone="critical">{ errors.triggered ? errors.triggered : ""}</Text>
              <Card background={ errors.triggered ? "bg-surface-critical-active" : "bg-surface" } title="Orders" sectioned>
                <InlineGrid alignItems="center" columns={2}>
                  <Text variant="headingSm" as="p" tone="base" fontWeight="regular">
                    {triggered.title ? triggered.title : 'Please select trigger product'}
                  </Text>
                  <BlockStack inlineAlign="end">
                    <Button onClick={() => { selectProduct('trigger') }} variant="primary">
                      {triggered.title ? "Change" : "Select"}
                    </Button>
                  </BlockStack>
                </InlineGrid>
              </Card>


            </Grid.Cell>
          </Grid>
          <Placeholder height="40px" />
          <Grid>
            <Grid.Cell columnSpan={{ xs: 4, sm: 3, md: 3, lg: 4, xl: 4 }}>
            <BlockStack style={{'height': "100%", "flex-direction": "column", "justify-content": "center"}} align="center">
              <Text variant="headingLg" as="h6">
                Offer
              </Text>
              <Text variant="headingSm" as="p" tone="base" fontWeight="regular">
                Some text here
              </Text>
              </BlockStack>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 8, sm: 3, md: 3, lg: 8, xl: 8 }}>
            <Text tone="critical">{ errors.offered ? errors.offered : ""}</Text>
              <Card background={ errors.offered ? "bg-surface-critical-active" : "bg-surface" } title="offers" sectioned>
                <InlineGrid alignItems="center" columns={2}>

                  <Text variant="headingSm" as="p" tone="base" fontWeight="regular">
                    {offered.title ? offered.title : 'Please select offered product'}
                  </Text>
                  <BlockStack inlineAlign="end">
                    <Button onClick={() => { selectProduct('offer') }} variant="primary">{offered.title ? "Change" : "Select"}</Button>
                  </BlockStack>


                </InlineGrid>
              </Card>
            </Grid.Cell>
          </Grid>
          <Placeholder height="40px" />
          <Grid>
            <Grid.Cell columnSpan={{ xs: 4, sm: 3, md: 3, lg: 4, xl: 4 }}>
            <BlockStack style={{'height': "100%", "flex-direction": "column", "justify-content": "center"}} align="center">
              <Text variant="headingLg" as="h6">
                Discount
              </Text>
              <Text variant="headingSm" as="p" tone="base" fontWeight="regular">
                Some text here
              </Text>
              </BlockStack>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 8, sm: 3, md: 3, lg: 8, xl: 8 }}>
              <Card title="Orders" sectioned>
                <Text variant="headingSm" as="p" tone="base" fontWeight="regular">
                  Select your discount
                </Text>
                <Placeholder height="4px" />
                <Select

                  options={options}
                  onChange={handleSelectChange}
                  value={selected}
                />
              </Card>
            </Grid.Cell>
          </Grid>
          <Placeholder height="24px" />
          <Divider borderColor="border" />
          <PageActions
            primaryAction={{
              content: "Save",
              onAction: handleSave
            }}
          />
        </Layout.Section>



      </Layout>
    </Page>
  );
}


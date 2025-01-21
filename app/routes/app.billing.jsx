import {
  IndexTable,
  Page,
  Text,
  Box,
  Badge,
  Layout,
  Card,
} from '@shopify/polaris';
import { useState } from 'react';
import {DeleteIcon} from '@shopify/polaris-icons';
import React from 'react';

export default function IndexTableWithPaginationAndBulkActionsExample() {
  console.log('billing');
  const orders = [
    {
      id: '1020',
      order: '#1020',
      date: 'Jul 20 at 4:34pm',
      customer: 'Jaydon Stanton',
      total: '$969.44',
      paymentStatus: <Badge progress="complete">Paid</Badge>,
      fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
    },
    {
      id: '1019',
      order: '#1019',
      date: 'Jul 20 at 3:46pm',
      customer: 'Ruben Westerfelt',
      total: '$701.19',
      paymentStatus: <Badge progress="partiallyComplete">Partially paid</Badge>,
      fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
    },
    {
      id: '1018',
      order: '#1018',
      date: 'Jul 20 at 3.44pm',
      customer: 'Leo Carder',
      total: '$798.24',
      paymentStatus: <Badge progress="complete">Paid</Badge>,
      fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
    },
    {
      id: '1021',
      order: '#1018',
      date: 'Jul 20 at 3.44pm',
      customer: 'Leo Carder1',
      total: '$798.24',
      paymentStatus: <Badge progress="complete">Paid</Badge>,
      fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
    },
    {
      id: '1022',
      order: '#1018',
      date: 'Jul 20 at 3.44pm',
      customer: 'Leo Carder2',
      total: '$798.24',
      paymentStatus: <Badge progress="complete">Paid</Badge>,
      fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
    },
    {
      id: '1023',
      order: '#1018',
      date: 'Jul 20 at 3.44pm',
      customer: 'Leo Carder3',
      total: '$798.24',
      paymentStatus: <Badge progress="complete">Paid</Badge>,
      fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
    }
  ];
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
    console.log('%');
    if( currentPage == orders.length/itemsPerPage ){
      hasNext = false;
    } else {
      hasNext = true;
    }
  } else {
    console.log('! %');
    console.log(orders.length%itemsPerPage);
    console.log(currentPage + 1);
    if( currentPage == orders.length%itemsPerPage + 1 ){
      hasNext = false;
    } else {
      hasNext = true;
    }
  }
   
  console.log('test');
  console.log((currentPage - 1) * itemsPerPage);
  const currentPageProducts = orders.slice((currentPage - 1) * itemsPerPage, (currentPage - 1) * itemsPerPage + itemsPerPage);

  const rowMarkup = currentPageProducts.map(
     (
      {id, order, date, customer, total, paymentStatus, fulfillmentStatus},
      index,
    ) => (
      <IndexTable.Row
        id={id}
        key={id}
        
        position={index}
      >
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {order}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{date}</IndexTable.Cell>
        <IndexTable.Cell>{customer}</IndexTable.Cell>
        <IndexTable.Cell>
          <Text as="span" alignment="end" numeric>
            {total}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{paymentStatus}</IndexTable.Cell>
        <IndexTable.Cell>{fulfillmentStatus}</IndexTable.Cell>
      </IndexTable.Row>
    ),
  );
  
 
  return (
    <Page>
      { currentPage }
    <Box paddingBlockEnd="400">
        <Layout>
        <Layout.Section>
          <Card>
        <IndexTable
          resourceName={resourceName}
          itemCount={orders.length}
          headings={[
            {title: 'Order'},
            {title: 'Date'},
            {title: 'Customer'},
            {title: 'Total', alignment: 'end'},
            {title: 'Payment status'},
            {title: 'Fulfillment status'},
          ]}
          selectable={false}
          pagination={{
            hasNext: hasNext,
            hasPrevious: hasPrev,
            onPrevious: () => { 
              setCurrentPage( prevState => prevState - 1 );
              console.log('prev ' + currentPage); 
            },
            onNext: () => { 
              setCurrentPage( prevState => prevState + 1 );
              console.log('next ' + currentPage); 
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
import {
  Page,
  Layout,
  Text,
  Card,
  IndexTable,
  Box,
  Button, 
  Popover, 
  ActionList
} from "@shopify/polaris";
import { useState, useMemo, useCallback } from 'react';
import { redirect } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { authenticate } from "../shopify.server"; 
import db from "../db.server";    

export const loader = async ({ request }) => {
  try {
    const products = await db.product.findMany();
    return products;
  } catch (error) {
    console.error(error);
    throw new Response("Error fetching products", { status: 500 });
  }
};

export const action = async ({ request }) => {
  try {
    const { admin } = await authenticate.admin(request);
    const data = Object.fromEntries(await request.formData());

    if (data.action === "delete") {
      await db.product.delete({
        where: { id: parseInt(data.id) },
      });
    } else {
      return redirect(`/app/funnels/${data.id}`);
    }

    return null;
  } catch (error) {
    console.error(error);
    throw new Response("Error processing action", { status: 500 });
  }
};

export default function Index() { 
  const submit = useSubmit();
  const productsDB = useLoaderData();

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1); 
  const totalPages = Math.ceil(productsDB.length / itemsPerPage);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return productsDB.slice(startIndex, startIndex + itemsPerPage);
  }, [productsDB, currentPage]);

  const tableHeadings = [
    { title: 'ID' },
    { title: 'Funnel title' },
    { title: 'Triggered title' },
    { title: 'Offered title' },
    { title: 'Discount' },
    { title: 'Actions' }
  ];

  const PopoverWithActionList = useCallback(({ id }) => {
    const [popoverActive, setPopoverActive] = useState(false);

    const togglePopoverActive = useCallback(
      () => setPopoverActive((popoverActive) => !popoverActive),
      []
    );

    const handleAction = useCallback(
      (action) => {
        submit({ action, id }, { method: "post" });
      },
      [id, submit]
    );

    return (
      <div style={{ marginBottom: '0px' }}>
        <Popover
          active={popoverActive}
          activator={<Button onClick={togglePopoverActive} disclosure>More actions</Button>}
          autofocusTarget="first-node"
          onClose={togglePopoverActive}
        >
          <ActionList
            actionRole="menuitem"
            items={[
              { content: 'Edit', onAction: () => handleAction('edit') },
              { content: 'Remove', onAction: () => handleAction('delete') }
            ]}
          />
        </Popover>
      </div>
    );
  }, [submit]);

  const rowMarkup = paginatedProducts.map(({ id, triggeredTitle, offeredTitle, discount, title }, index) => (
    <IndexTable.Row id={id.toString()} key={`product-row-${id}`} position={index}>
      <IndexTable.Cell>{id}</IndexTable.Cell>
      <IndexTable.Cell>
        <Text variant="bodyMd" fontWeight="bold" as="span">{title}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>{triggeredTitle}</IndexTable.Cell>
      <IndexTable.Cell>{offeredTitle}</IndexTable.Cell>
      <IndexTable.Cell>{discount}</IndexTable.Cell>
      <IndexTable.Cell>
        <PopoverWithActionList id={id} />
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <Page>
      <Box paddingBlockEnd="4" display="flex" justifyContent="end">
        <Button url="settings">Create funnel</Button>
      </Box>
      <Layout>
        <Layout.Section>
          <Card>
            <IndexTable
              resourceName={{ singular: 'product', plural: 'products' }}
              itemCount={productsDB.length}
              headings={tableHeadings}
              selectable={false}
              pagination={{
                hasNext: currentPage < totalPages,
                hasPrevious: currentPage > 1,
                onNext: () => setCurrentPage((prev) => prev + 1),
                onPrevious: () => setCurrentPage((prev) => prev - 1),
              }}
            >
              {rowMarkup}
            </IndexTable>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
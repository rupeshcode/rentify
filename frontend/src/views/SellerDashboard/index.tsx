import { Badge, Button, Card, Group, Table, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import scss from "./sellardashboard.module.scss";
import fetcher from "@/utils/fetcher";
import { useUserStore } from "@/stores/user-store";
import { toast } from "react-toastify";

const SellerDashboard = () => {
  const user = useUserStore.use.user();
  const [propertData, setPropertData] = useState<any>([]);

  useEffect(() => {
    const getPropertyData = async () => {
      const response = await fetcher("/property/get-all", "POST", {
        sellerId: user.id,
      });
      if (response) {
        setPropertData(response);
      }
    };
    getPropertyData();
  }, []);

  return (
    <div className={scss.dashboard}>
      <div className={scss.property_data}>
        {propertData?.length !== 0 ? (
          propertData.map((property: any) => {
            return (
              <Card
                key={property.id}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
              >
                <Group justify="space-between" mt="md" mb="xs">
                  <Text fw={500}>{property.noOfBedroom} bhk Flat</Text>
                  <Badge color="pink">On Rent</Badge>
                </Group>
                <Table>
                  <Table.Tbody>
                    <Table.Tr>
                      <Table.Td>Place:</Table.Td>
                      <Table.Td>{property.place}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>Area:</Table.Td>
                      <Table.Td>{property.area}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>No.of.Bathrooms:</Table.Td>
                      <Table.Td>{property.noOfBathroom}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>No.of.Bedrooms:</Table.Td>
                      <Table.Td>{property.noOfBedroom}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>Near By Places:</Table.Td>
                      <Table.Td>{property.nearbyArea}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>Name of Near By Places:</Table.Td>
                      <Table.Td>{property.nameOfNearByArea}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>Price:</Table.Td>
                      <Table.Td>{property.price}</Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>

                <Button
                  onClick={() => toast.info("Im Working on it")}
                  color="blue"
                  fullWidth
                  mt="md"
                  radius="md"
                >
                  Edit
                </Button>

                <Button
                  onClick={() => toast.info("Im Working on it")}
                  color="red"
                  fullWidth
                  mt="md"
                  radius="md"
                >
                  Delete
                </Button>
              </Card>
            );
          })
        ) : (
          <h1>No Property Found</h1>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;

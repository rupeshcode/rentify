import { Badge, Button, Card, Group, Modal, Table, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import scss from "./sellardashboard.module.scss";
import fetcher from "@/utils/fetcher";
import { useUserStore } from "@/stores/user-store";
import { toast } from "react-toastify";
import { useTempStore } from "@/stores/temp-store";
import { useDisclosure } from "@mantine/hooks";
import AddPropertyForm from "../AddProperty";
import EditPropertyForm from "../EditPropertyData";

const SellerDashboard = () => {
  const user = useUserStore.use.user();
  const propertData = useTempStore.use.propertData();
  const setPropertData = useTempStore.use.setPropertData();
  const [editProperty, setEditProperty] = useState();
  const [
    openedAddProperty,
    { open: openAddPropertyEdit, close: closeAddPropertyEdit },
  ] = useDisclosure(false);
  const deletePropertyData = async (id: any) => {
    console.log("idss", id);

    const condition = window.confirm("Are you sure you want to delete");
    if (!condition) {
      return;
    }
    const response = await fetcher("/property/delete", "POST", {
      id: id,
    });
    console.log("response", response);
    if (response == "Deleted") {
      toast.success("property deleted successfully");
      getPropertyData();
    }
  };
  useEffect(() => {
    getPropertyData();
  }, []);

  const getPropertyData = async () => {
    const response = await fetcher("/property/get-all", "POST", {
      sellerId: user.id,
    });
    if (response) {
      setPropertData(response);
    }
  };

  return (
    <>
      <div className={scss.dashboard}>
        <div className={scss.property_data}>
          {propertData?.length !== 0 ? (
            propertData.map((property: any) => {
              return (
                <Card
                  className={scss.property_card}
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
                  <div className={scss.ButtonWapper}>
                    <Button
                      onClick={() => {
                        setEditProperty(property);
                        openAddPropertyEdit();
                      }}
                      color="blue"
                      fullWidth
                      mt="md"
                      radius="md"
                    >
                      Edit
                    </Button>

                    <Button
                      onClick={() => deletePropertyData(property.id)}
                      color="red"
                      fullWidth
                      mt="md"
                      radius="md"
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              );
            })
          ) : (
            <h1>No Property Found</h1>
          )}
        </div>
      </div>
      <Modal
        title="Edit Property"
        opened={openedAddProperty}
        onClose={closeAddPropertyEdit}
      >
        <EditPropertyForm
          onClose={closeAddPropertyEdit}
          property={editProperty}
        />
      </Modal>
    </>
  );
};

export default SellerDashboard;

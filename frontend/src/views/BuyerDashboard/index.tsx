import {
  Badge,
  Button,
  Card,
  Group,
  Select,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import scss from "./buyerdashboard.module.scss";
import { SubmitHandler, useForm } from "react-hook-form";
import fetcher from "@/utils/fetcher";
import { useRouter } from "next/router";
import { useUserStore } from "@/stores/user-store";

type FilterData = {
  noOfBathroom: string;
  noOfBedroom: string;
};

const BuyerDashboard = () => {
  const router = useRouter();
  const user = useUserStore.use.user();
  const [propertData, setPropertData] = useState<any>([]);
  useEffect(() => {
    const getPropertyData = async () => {
      const response = await fetcher("/property/get-all", "POST", {});
      if (response) {
        setPropertData(response);
      }
    };
    getPropertyData();
  }, []);

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<FilterData>({
    // resolver: yupResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<FilterData> = async (data) => {
    try {
      const response = await fetcher("/property/get-all", "POST", data);
      if (response) {
        setPropertData(response);
      }
      //   toast.success("Registration successful!");
      //   console.log("Response:", response.data);
    } catch (error) {
      //   toast.error("Registration failed!");
      console.error("Error:", error);
    }
  };
  return (
    <div className={scss.dashboard}>
      <div className={scss.filters}>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className={scss.filterContainer}>
            <div className="flex flex-row gap-2">
              <div className={scss.text_input}>
                <Select
                  data={["1", "2", "3", "4", "5"]}
                  label="No of Bathrooms"
                  error={errors.noOfBathroom?.message}
                  onChange={(value: any) => {
                    setValue("noOfBathroom", value);
                  }}
                  value={getValues("noOfBathroom")}
                />
              </div>
              <div className={scss.text_input}>
                <Select
                  data={["1", "2", "3", "4", "5"]}
                  label="No of Bedroom"
                  error={errors.noOfBedroom?.message}
                  onChange={(value: any) => {
                    setValue("noOfBedroom", value);
                  }}
                  value={getValues("noOfBedroom")}
                />
              </div>
            </div>
            <div className="flex flex-row gap-1">
              <div className={scss.button_wrapper}>
                <Button type="submit" fullWidth>
                  Search
                </Button>
              </div>
              {/* <div className={scss.button_wrapper}>
                <Button
                  onClick={() => reset({ noOfBathroom: "", noOfBedroom: "" })}
                  fullWidth
                >
                  Reset
                </Button>
              </div> */}
            </div>
          </div>
        </form>
      </div>
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

                {!user?.id && (
                  <Button
                    color="blue"
                    onClick={() => router.push("/login")}
                    fullWidth
                    mt="md"
                    radius="md"
                  >
                    I'm Interested
                  </Button>
                )}
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

export default BuyerDashboard;

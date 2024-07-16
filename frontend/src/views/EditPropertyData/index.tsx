import React, { useEffect } from "react";
import * as Yup from "yup";
import scss from "./edit-property.module.scss";
import { Button, Card, Select, TextInput } from "@mantine/core";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import fetcher from "@/utils/fetcher";
import { useUserStore } from "@/stores/user-store";
import { useTempStore } from "@/stores/temp-store";

type AddPropery = {
  place: string;
  area: string;
  noOfBathroom: string;
  noOfBedroom: string;
  nearbyArea: string;
  nameOfNearByArea: string;
  price: string;
};

const validationSchema = Yup.object({
  place: Yup.string().required("place is required"),
  area: Yup.string().required("area is required"),
  noOfBathroom: Yup.string().required("noOfBathroom is required"),
  noOfBedroom: Yup.string().required("noOfBedroom is Required"),
  nearbyArea: Yup.string().required("nearbyArea is Required"),
  nameOfNearByArea: Yup.string().required("name of nearbyArea is Required"),
  price: Yup.string().required("price is Required"),
});

const EditPropertyForm = ({ onClose, property }: any) => {
  console.log("property", property);

  const user = useUserStore.use.user();
  const propertData = useTempStore.use.propertData();
  const setPropertData = useTempStore.use.setPropertData();
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<AddPropery>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (property?.id) {
      setValue("place", property.place);
      setValue("area", property.area);
      setValue("noOfBathroom", property.noOfBathroom);
      setValue("noOfBedroom", property.noOfBedroom);
      setValue("nearbyArea", property.nearbyArea);
      setValue("nameOfNearByArea", property.nameOfNearByArea);
      setValue("price", property.price);
    }
  }, []);
  const onSubmit: SubmitHandler<AddPropery> = async (data) => {
    try {
      const response = await fetcher("/property/edit-property", "POST", {
        ...data,
        noOfBathroom: String(data.noOfBathroom),
        noOfBedroom: String(data.noOfBedroom),
        nearbyArea: String(data.nearbyArea),
        id: property.id,
        sellerId: user.id,
      });

      if (response == "edited!") {
        toast.success("Property edited successfully");
        getPropertyData();
        onClose();
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  // useEffect(() => {
  //   getPropertyData();
  // }, []);

  const getPropertyData = async () => {
    const response = await fetcher("/property/get-all", "POST", {
      sellerId: user.id,
    });
    if (response) {
      setPropertData(response);
    }
  };

  const bathroom = watch("noOfBathroom");
  console.log("watch", bathroom);

  return (
    <>
      <Card>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className="container">
            <div className={scss.input_wrapper}>
              <div className={scss.text_input}>
                <TextInput
                  label="Place"
                  placeholder="Enter your place"
                  error={errors.place?.message}
                  {...register("place")}
                />
              </div>
              <div className={scss.text_input}>
                <Select
                  data={["1", "2", "3", "4", "5"]}
                  label="No of Bathrooms"
                  error={errors.noOfBathroom?.message}
                  onChange={(value: any) => {
                    setValue("noOfBathroom", value);
                  }}
                  value={String(bathroom)}
                />
              </div>
              <div className={scss.text_input}>
                <TextInput
                  label="Area"
                  placeholder="Enter your area"
                  error={errors.area?.message}
                  {...register("area")}
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
                  value={String(getValues("noOfBedroom"))}
                />
              </div>
              <div className={scss.text_input}>
                <Select
                  data={[
                    "Hospital",
                    "School",
                    "College",
                    "Airport",
                    "RailWay Station",
                  ]}
                  label="Near by Area"
                  error={errors.nearbyArea?.message}
                  onChange={(value: any) => {
                    setValue("nearbyArea", value);
                  }}
                  value={String(getValues("nearbyArea"))}
                />
              </div>
              <div className={scss.text_input}>
                <TextInput
                  label="Name of near by area"
                  error={errors.nameOfNearByArea?.message}
                  {...register("nameOfNearByArea")}
                />
              </div>
              <div className={scss.text_input}>
                <TextInput
                  label="Price"
                  error={errors.price?.message}
                  {...register("price")}
                  type="price"
                />
              </div>

              <div className={scss.button_wrapper}>
                <Button type="submit" fullWidth>
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Card>
    </>
  );
};

export default EditPropertyForm;

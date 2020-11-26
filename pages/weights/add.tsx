// componentize some of this
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  Grid,
  Heading,
  Input,
  Select,
  Stack,
  useColorModeValue,
} from "@chakra-ui/core";
import { useState } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { getSession } from "next-auth/client";
import { ensureAuthenticated } from "lib/guards/ensureAuthenticated";
import ReactDatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { Confirmation, Layout } from "../../components";
import { FormInputs, FormResult, Participants } from "../../interfaces";

// eslint-disable-next-line import/no-named-as-default
import db from "prisma";
const prisma = db.getInstance().prisma;

type Person = {
  id: number;
  name: string;
  nickName: string;
};

function createArrayWithNumbers(length: number) {
  return Array.from({ length }, (_, k) => k + 1);
}

// When form submitted, verify that no entries duplicated

// When form submitted, verify that no entries duplicated
export const getServerSideProps: GetServerSideProps = async (context) => {
  await ensureAuthenticated(context);
  const session = await getSession(context);

  let people = null;

  people = await prisma.user.findMany({
    // select: { name: true, nickName: true },
    select: {
      id: true,
      name: true,
      // nickName: true,
    },
    orderBy: { name: "asc" },
  });

  return {
    props: { people, session },
  };
};

const CreateWeights: React.FunctionComponent<Participants> = ({
  people,
  session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { handleSubmit, errors, control, watch } = useForm<FormInputs>();
  const [entryCount, setEntryCount] = useState(1);
  const formBorderColor = useColorModeValue("gray.200", "gray.700");
  // const [selected, setSelected] = useState<string[]>([]);

  const startDate = new Date();

  const watched = watch("entries");

  console.log(watched);

  const confirmationCallback = () => {
    setEntryCount(entryCount - 1);
  };

  const getPeople = () => {
    const selected = watched?.map((entry) => entry.name);
    if (selected) {
      const filteredPeople = people.filter(
        (person: { id: number; name: string }) =>
          (selected as any).indexOf(person.name) === -1
      );
      // console.log(filteredPeople);
      return filteredPeople;
    } else {
      return people;
    }
  };

  const onSubmit = async (data: FormResult) => {
    console.log(data);

    try {
      await fetch(`/api/weigh-ins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      await router.push("/weights");
    } catch (e) {
      console.log(e);
    }
  };

  // const [test, setTest] = useState("Roker");
  // let test = "Roker";

  if (!session) {
    return (
      <Layout>
        <Box maxW="min(65ch, 100%)" mx="auto" px={["4", "4", "2", "2"]}>
          <Heading size="md" mt="6" mb="4">
            Unauthorized
          </Heading>
          <Box>You need to be signed in to view this page</Box>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Grid templateColumns={`1fr min(65ch, 100%) 1fr`} border="0px">
        <Grid
          column="2"
          my="4"
          mx={["4", "4", "2", "2"]}
          p="4"
          border="1px"
          borderRadius="10px"
          shadow="sm"
          borderColor={formBorderColor}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              {createArrayWithNumbers(entryCount).map((i) => (
                <Stack spacing={2} key={i}>
                  <FormControl id="person">
                    <Controller
                      name={`entries.[${i}].name`}
                      // as={Select}
                      control={control}
                      placeholder="Select Person"
                      defaultValue=""
                      isInvalid={errors.entries?.[i]?.name ? true : false}
                      errorBorderColor="red.300"
                      rules={{ required: true }}
                      render={({ value, onChange, onBlur }) => (
                        <Select
                          onChange={(e) => onChange(e.target.value)}
                          onBlur={onBlur}
                          value={value}
                          placeholder={value ? value : "Select Person"}
                        >
                          {getPeople().map((p: Person) => {
                            return (
                              <option key={p.id} value={p.name}>
                                {p.name}
                              </option>
                            );
                          })}
                        </Select>
                        // )}
                      )}
                      // onBlur={(e: any) => {
                      //   console.log(e.target.value);
                      //   console.log("change");
                      // }}
                      // onChange={(e: any) => {
                      //   console.log(e.target.value);
                      //   console.log("change");
                      // }}
                    />
                    {/* // {people.map((p: Person) => {
                      //   return (
                      //     <option key={p.id} value={p.name}>
                      //       {p.name}
                      //     </option>
                      //   );
                      // })}
                    // </Controller> */}
                  </FormControl>
                  {errors.entries?.[i]?.name && false && (
                    <Box
                      fontFamily="mono"
                      fontSize="xs"
                      textColor="red.400"
                      pl="1"
                    >
                      Required
                    </Box>
                  )}

                  <FormControl id="person">
                    <Controller
                      name={`entries.[${i}].weight`}
                      control={control}
                      as={Input}
                      placeholder="Weight (lbs)"
                      defaultValue=""
                      isInvalid={errors.entries?.[i]?.weight ? true : false}
                      rules={{ required: true, min: 2 }}
                    />
                    {errors.entries?.[i]?.weight && false && (
                      <Box
                        fontFamily="mono"
                        fontSize="xs"
                        textColor="red.400"
                        pl="1"
                      >
                        Required
                      </Box>
                    )}
                  </FormControl>
                  <Divider display={["block", "none"]} />
                </Stack>
              ))}

              <Stack
                direction={["column", "column", "row", "row"]}
                justifyContent="space"
                alignContent="center"
                display="flex"
              >
                <Stack direction="row" w={["100%"]}>
                  <Button
                    onClick={() => {
                      setEntryCount(entryCount + 1);
                    }}
                    variant="outline"
                    w="100%"
                    size="sm"
                    textColor="pink.400"
                    fontWeight="800"
                    fontSize="md"
                  >
                    +
                  </Button>
                  {entryCount !== 1 && (
                    <Confirmation
                      title="-"
                      action={confirmationCallback}
                      variant="outline"
                      size="sm"
                      textColor="red.400"
                      fontWeight="900"
                      fontSize="md"
                      w="100%"
                    />
                  )}
                </Stack>

                <Box w="100%">
                  <Controller
                    control={control}
                    name="date"
                    defaultValue={startDate}
                    render={({ onChange, onBlur, value }) => (
                      <ReactDatePicker
                        onChange={(date) => {
                          onChange(date);
                        }}
                        onBlur={onBlur}
                        selected={value}
                        dateFormat="yyyy/MM/dd"
                      />
                    )}
                    rules={{ required: true }}
                  />
                  {errors.date && (
                    <Box
                      fontFamily="mono"
                      fontSize="xs"
                      textColor="red.400"
                      pl="1"
                    >
                      Required
                    </Box>
                  )}
                </Box>
                <FormControl
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  p={["1", "0"]}
                  py={["1", "1"]}
                  px={["1", "1"]}
                >
                  <Controller
                    control={control}
                    name="updateCurrentWeight"
                    defaultValue={true}
                    render={({ onChange, onBlur }) => (
                      <Checkbox
                        onBlur={onBlur}
                        onChange={(e) => {
                          onChange(e.target.checked);
                        }}
                        my={["1", "1"]}
                        mx={["0", "0"]}
                        defaultIsChecked
                      >
                        Update Profile Weight
                      </Checkbox>
                    )}
                  />
                </FormControl>
              </Stack>
            </Stack>
            <Box display="flex">
              <Button
                colorScheme="blue"
                type="submit"
                mx="auto"
                borderRadius="24px"
                mt="4"
                w={["100%", "50%"]}
              >
                Submit
              </Button>
            </Box>
          </form>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default CreateWeights;

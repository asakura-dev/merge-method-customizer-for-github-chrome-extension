import { Button } from "@chakra-ui/button";
import { Image } from "@chakra-ui/image";
import { Input } from "@chakra-ui/input";
import {
  VStack,
  HStack,
  Heading,
  Spacer,
  Grid,
  GridItem,
  Text,
  Box,
} from "@chakra-ui/layout";
import DeleteImage from "../assets/Delete.png";
import { useState } from "react";
import { MergeMethodRule, MergeMethodRuleData } from "./MergeMethodRule";

export type RepositoryRuleData = {
  repositoryUrl: string;
  mergeMethodRules: MergeMethodRuleData[];
};

export const RepositoryRule = ({
  data,
  onChange,
  onDelete,
}: {
  data: RepositoryRuleData;
  onChange: (repositoryRule: RepositoryRuleData) => void;
  onDelete: () => void;
}) => {
  const [isHoverDeleteButton, setIsHoverDeleteButton] = useState(false);

  return (
    <Box
      p="16px"
      border="2px solid #727070"
      borderRadius="4px"
      borderColor={isHoverDeleteButton ? "#E53E3E" : "#D9D9D9"}
    >
      <VStack alignItems="stretch">
        <HStack>
          <Heading as="h2" size="xs">
            Repository URL
          </Heading>
          <Text fontSize="12px">
            Wildcards * may be used to set multiple repository
          </Text>
          <Spacer />
          <Button
            w="14px"
            minW="14px"
            h="20px"
            variant="unstyled"
            onMouseOver={() => setIsHoverDeleteButton(true)}
            onMouseLeave={() => setIsHoverDeleteButton(false)}
            onMouseOut={() => setIsHoverDeleteButton(false)}
            onClick={onDelete}
          >
            <Image
              w="14px"
              minW="14px"
              src={DeleteImage}
              alt="Delete Repository Setting"
            />
          </Button>
        </HStack>
        <HStack w="100%">
          <Input
            size="sm"
            placeholder="e.g. https://github.com/asakura-dev/*"
            value={data.repositoryUrl}
            onChange={(e) =>
              onChange({ ...data, repositoryUrl: e.target.value })
            }
          />
        </HStack>
        <Spacer h="8px" />
        <Grid
          templateRows="2, repeat(1, 1fr)"
          templateColumns="1fr 12px 1fr 0px 1fr 24px"
          gap={"4px"}
        >
          <GridItem rowSpan={1} colSpan={4}>
            <HStack>
              <Heading as="h2" size="xs">
                Branch
              </Heading>
              <Text fontSize="12px">Wildcards * may be used.</Text>
            </HStack>
          </GridItem>
          <GridItem rowSpan={1} colSpan={2}>
            <Heading as="h2" size="xs">
              Merge Method
            </Heading>
          </GridItem>
          <GridItem rowSpan={1} colSpan={1}>
            <Heading
              as="h3"
              fontSize="12px"
              color="#717171"
              fontWeight="normal"
            >
              Base
            </Heading>
          </GridItem>
          <GridItem rowSpan={1} colSpan={1}></GridItem>
          <GridItem rowSpan={1} colSpan={1}>
            <Heading
              as="h3"
              fontSize="12px"
              color="#717171"
              fontWeight="normal"
            >
              Compare
            </Heading>
          </GridItem>
          <GridItem rowSpan={1} colSpan={3}></GridItem>
          {data.mergeMethodRules.map((rule, index) => (
            <MergeMethodRule
              key={index}
              data={rule}
              onChange={(mergeMethod) => {
                const newMergeMethodRules = [...data.mergeMethodRules];
                newMergeMethodRules[index] = mergeMethod;
                onChange({ ...data, mergeMethodRules: newMergeMethodRules });
              }}
              onDelete={() => {
                const newMergeMethodRules = [...data.mergeMethodRules];
                newMergeMethodRules.splice(index, 1);
                onChange({ ...data, mergeMethodRules: newMergeMethodRules });
              }}
            />
          ))}
        </Grid>
        <HStack>
          <Spacer />
          <Button
            size="xs"
            variant="outline"
            borderRadius="4px"
            fontWeight="normal"
            onClick={() => {
              onChange({
                ...data,
                mergeMethodRules: [
                  ...data.mergeMethodRules,
                  {
                    baseBranch: "",
                    compareBranchh: "",
                    method: "CREATE_MERGE_COMMIT",
                  },
                ],
              });
            }}
          >
            + Add Rule
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

import { useState } from "react";
import { Button } from "@chakra-ui/button";
import { Image } from "@chakra-ui/image";
import { Input } from "@chakra-ui/input";
import { VStack, HStack, Heading, Spacer, Text, Box } from "@chakra-ui/layout";
import { v4 as uuidv4 } from "uuid";
import { DndContext } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { MergeMethodRule, MergeMethodRuleData } from "./MergeMethodRule";
import DeleteImage from "../assets/Delete.png";

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
        <VStack gap="4px">
          <HStack gap="4px">
            <HStack w="288px">
              <Heading as="h2" size="xs">
                Branch
              </Heading>
              <Text fontSize="12px">Wildcards * may be used.</Text>
            </HStack>
            <Box w="160px">
              <Heading as="h2" size="xs">
                Merge Method
              </Heading>
            </Box>
          </HStack>
          <HStack gap="8px">
            <HStack w="284px" gap="4px">
              <Box w="16px"></Box>
              <Heading
                as="h3"
                fontSize="12px"
                color="#717171"
                fontWeight="normal"
                w="123px"
              >
                Base
              </Heading>
              <Box w="10px" flexShrink={0}></Box>
              <Heading
                as="h3"
                fontSize="12px"
                color="#717171"
                fontWeight="normal"
                w="123px"
              >
                Compare
              </Heading>
            </HStack>
            <Box w="160px"></Box>
          </HStack>
          <DndContext
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={(event) => {
              const { active, over } = event;
              if (over == null) {
                return;
              }
              if (active.id !== over.id) {
                const oldIndex = data.mergeMethodRules.findIndex(
                  (item) => item.id === active.id
                );
                const newIndex = data.mergeMethodRules.findIndex(
                  (item) => item.id === over.id
                );
                onChange({
                  ...data,
                  mergeMethodRules: arrayMove(
                    data.mergeMethodRules,
                    oldIndex,
                    newIndex
                  ),
                });
              }
            }}
          >
            <SortableContext items={data.mergeMethodRules}>
              {data.mergeMethodRules.map((rule, index) => (
                <MergeMethodRule
                  key={rule.id}
                  data={rule}
                  onChange={(mergeMethod) => {
                    console.log({ mergeMethod });
                    const newMergeMethodRules = [...data.mergeMethodRules];
                    newMergeMethodRules[index] = mergeMethod;
                    onChange({
                      ...data,
                      mergeMethodRules: newMergeMethodRules,
                    });
                  }}
                  onDelete={() => {
                    const newMergeMethodRules = [...data.mergeMethodRules];
                    newMergeMethodRules.splice(index, 1);
                    onChange({
                      ...data,
                      mergeMethodRules: newMergeMethodRules,
                    });
                  }}
                />
              ))}
            </SortableContext>
          </DndContext>
        </VStack>
        <HStack>
          <Text fontSize="12px">
            Rules positioned higher in the list take precedence.
          </Text>
          <Spacer />
          <Button
            size="xs"
            variant="outline"
            borderRadius="4px"
            fontWeight="normal"
            onClick={() => {
              const id = uuidv4();
              onChange({
                ...data,
                mergeMethodRules: [
                  ...data.mergeMethodRules,
                  {
                    id,
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

import { Button } from "@chakra-ui/button";
import { Image } from "@chakra-ui/image";
import { Input } from "@chakra-ui/input";
import { Center, HStack } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ArrowImage from "../assets/Arrow.png";
import RemoveImage from "../assets/Remove.png";
import DraghandleImage from "../assets/Draghandle.png";

export type Method =
  | "CREATE_MERGE_COMMIT"
  | "SQUASH_AND_MERGE"
  | "REBASE_AND_MERGE";

const METHODS = {
  CREATE_MERGE_COMMIT: "CREATE_MERGE_COMMIT",
  SQUASH_AND_MERGE: "SQUASH_AND_MERGE",
  REBASE_AND_MERGE: "REBASE_AND_MERGE",
} as const;

export type MergeMethodRuleData = {
  id: string;
  baseBranch: string;
  compareBranchh: string;
  method: Method;
};

export const MergeMethodRule = ({
  data,
  onChange,
  onDelete,
}: {
  data: MergeMethodRuleData;
  onChange: (mergeMethod: MergeMethodRuleData) => void;
  onDelete: () => void;
}) => {
  const {
    setActivatorNodeRef,
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: data.id,
  });
  return (
    <HStack
      gap="8px"
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <HStack w="284px" gap="4px">
        <Center
          w="16px"
          flexShrink={0}
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          cursor={isDragging ? "grabbing" : "grab"}
        >
          <Image src={DraghandleImage} alt="Sort" />
        </Center>
        <Input
          size="sm"
          placeholder="e.g. develop"
          value={data.baseBranch}
          onChange={(e) => onChange({ ...data, baseBranch: e.target.value })}
        />
        <Center h="30px" flexShrink={0}>
          <Image src={ArrowImage} alt="arrow" />
        </Center>
        <Input
          size="sm"
          placeholder="e.g. feature/*"
          value={data.compareBranchh}
          onChange={(e) =>
            onChange({
              ...data,
              compareBranchh: e.target.value,
            })
          }
        />
      </HStack>
      <HStack w="160px" gap="4px">
        <Select
          defaultValue={METHODS.CREATE_MERGE_COMMIT}
          value={data.method}
          size="sm"
          fontSize="12px"
          onChange={(e) => {
            onChange({ ...data, method: e.target.value as Method });
          }}
        >
          <option value={METHODS.CREATE_MERGE_COMMIT}>Merge commit</option>
          <option value={METHODS.SQUASH_AND_MERGE}>Squash and Merge</option>
          <option value={METHODS.REBASE_AND_MERGE}>Rebase and Merge</option>
        </Select>
        <Center h="30px">
          <Button
            w="20px"
            minW="20px"
            h="20px"
            variant="unstyled"
            onClick={onDelete}
          >
            <Image w="20px" minW="20px" src={RemoveImage} alt="Remove" />
          </Button>
        </Center>
      </HStack>
    </HStack>
  );
};

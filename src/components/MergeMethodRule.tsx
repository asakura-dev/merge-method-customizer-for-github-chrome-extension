import { Button } from "@chakra-ui/button";
import { Image } from "@chakra-ui/image";
import { Input } from "@chakra-ui/input";
import { GridItem, Center } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
import ArrowImage from "../assets/Arrow.png";
import RemoveImage from "../assets/Remove.png";

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
  return (
    <>
      <GridItem rowSpan={1} colSpan={1}>
        <Input
          size="sm"
          placeholder="e.g. develop"
          value={data.baseBranch}
          onChange={(e) => onChange({ ...data, baseBranch: e.target.value })}
        />
      </GridItem>
      <GridItem rowSpan={1} colSpan={1}>
        <Center h="30px">
          <Image src={ArrowImage} alt="arrow" />
        </Center>
      </GridItem>
      <GridItem rowSpan={1} colSpan={1}>
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
      </GridItem>
      <GridItem rowSpan={1} colSpan={1}></GridItem>
      <GridItem rowSpan={1} colSpan={1}>
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
      </GridItem>
      <GridItem rowSpan={1} colSpan={1}>
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
      </GridItem>
    </>
  );
};

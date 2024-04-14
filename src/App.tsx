import { Button } from "@chakra-ui/button";
import {
  Box,
  Center,
  HStack,
  Heading,
  Spacer,
  VStack,
} from "@chakra-ui/layout";
import {
  RepositoryRule,
  RepositoryRuleData,
} from "./components/RepositoryRule";
import { useEffect, useState } from "react";
import debounce from "debounce";
import { Spinner } from "@chakra-ui/spinner";
import { REPOSITORY_HOSTS } from "./constant/constant";

const initialRepositoryRuleData: RepositoryRuleData = {
  repositoryUrl: "",
  mergeMethodRules: [
    { baseBranch: "", compareBranchh: "", method: "CREATE_MERGE_COMMIT" },
  ],
};
const saveRepositoryRulesToStorage = debounce(
  (repositoryRules: RepositoryRuleData[], onSaved: () => void = () => {}) => {
    chrome.storage.sync.set({ repositoryRules }).then(onSaved);
  },
  250
);

function App() {
  const [repositoryRules, setRepositoryRules] = useState<RepositoryRuleData[]>(
    []
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get("repositoryRules", (data) => {
      if (data.repositoryRules) {
        setRepositoryRules(data.repositoryRules);
      } else {
        setRepositoryRules([{ ...initialRepositoryRuleData }]);
      }
    });
  }, []);

  const saveRepositoryRules = (repositoryRules: RepositoryRuleData[]) => {
    setIsSaving(true);
    saveRepositoryRulesToStorage(repositoryRules, () => {
      setIsSaving(false);
      REPOSITORY_HOSTS.forEach((url) => {
        chrome.tabs.query({ url }, (tabs) => {
          tabs.forEach((tab) => {
            chrome.tabs.sendMessage(tab.id!, { type: "rule-changed" });
          });
        });
      });
    });
  };

  return (
    <Box w="520px" minH="300px" p="16px">
      <HStack>
        <Heading as="h1" size="sm">
          Merge Method Customizer for Github
        </Heading>
        {isSaving && <Spinner w="16px" h="16px" />}
      </HStack>
      <Spacer h="16px" />
      <VStack alignItems="stretch">
        {repositoryRules.map((repositoryRule, index) => (
          <RepositoryRule
            key={index}
            data={repositoryRule}
            onChange={(repositoryRule) => {
              const newRepositoryRules = [...repositoryRules];
              newRepositoryRules[index] = repositoryRule;
              setRepositoryRules(newRepositoryRules);
              saveRepositoryRules(newRepositoryRules);
            }}
            onDelete={() => {
              const newRepositoryRules = [...repositoryRules];
              newRepositoryRules.splice(index, 1);
              setRepositoryRules(newRepositoryRules);
              saveRepositoryRules(newRepositoryRules);
            }}
          />
        ))}
        <Center>
          <Button
            size="sm"
            variant="outline"
            borderRadius="4px"
            fontWeight="normal"
            onClick={() => {
              const newRepositoryRules = [
                ...repositoryRules,
                { ...initialRepositoryRuleData },
              ];
              setRepositoryRules(newRepositoryRules);
              saveRepositoryRules(newRepositoryRules);
            }}
          >
            + Add Repository
          </Button>
        </Center>
      </VStack>
    </Box>
  );
}

export default App;

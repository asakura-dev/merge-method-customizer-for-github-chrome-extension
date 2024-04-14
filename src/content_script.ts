import { isMatchText } from "./utils/isMatchText";
import { RepositoryRuleData } from "./components/RepositoryRule";
import { Method } from "./components/MergeMethodRule";

const insertMergeMethodChangedText = (methodText: string) => {
  const oldMergeMethodChangedText = document.querySelector(
    "#merge-method-changed-text"
  );
  if (oldMergeMethodChangedText) {
    oldMergeMethodChangedText.remove();
  }
  const mergeMethodChangedText = document.createElement("div");
  mergeMethodChangedText.id = "merge-method-changed-text";
  mergeMethodChangedText.textContent = `Merge method set to "${methodText}" by the Merge Method Customizer.`;
  mergeMethodChangedText.style.fontSize = "12px";
  mergeMethodChangedText.style.marginTop = "8px";
  const altMergeOptions = document.querySelector(".alt-merge-options");
  if (!altMergeOptions) {
    return;
  }
  altMergeOptions.insertAdjacentElement("afterend", mergeMethodChangedText);
};

const changeMergeMethod = (method: Method) => {
  if (!document.querySelector(".js-merge-method-menu-button")) {
    return;
  }
  const VALUES = {
    CREATE_MERGE_COMMIT: "merge",
    SQUASH_AND_MERGE: "squash",
    REBASE_AND_MERGE: "rebase",
  } as const;
  const elem = document.querySelector(
    `.select-menu-item[value="${VALUES[method]}"]`
  ) as HTMLElement | null;
  if (!elem) {
    console.log("Merge method not found");
    return;
  }
  elem.click();
  insertMergeMethodChangedText(VALUES[method]);
};

const checkAndChangeMergeMethod = () => {
  const isPullRequestPage = location.pathname.match(/\/pull\/\d+$/);
  if (!isPullRequestPage) {
    return;
  }
  const baseBranchName = document.querySelector(".base-ref")?.textContent;
  const compareBranchName = document.querySelector(".head-ref")?.textContent;
  if (!baseBranchName || !compareBranchName) {
    return;
  }

  chrome.storage.sync.get("repositoryRules", (result) => {
    const repositoryRules: RepositoryRuleData[] = result.repositoryRules || [];
    const currentUrl = location.href.replace(/\/pull\/\d+/, "");
    const matchRepositoryRule = repositoryRules.find(
      (rule) =>
        rule.repositoryUrl !== "" &&
        (currentUrl === rule.repositoryUrl ||
          isMatchText(currentUrl, rule.repositoryUrl))
    );
    if (!matchRepositoryRule) {
      return;
    }

    const matchedMergeMethodRule = matchRepositoryRule.mergeMethodRules.find(
      (rule) =>
        rule.baseBranch !== "" &&
        rule.compareBranchh !== "" &&
        isMatchText(baseBranchName, rule.baseBranch) &&
        isMatchText(compareBranchName, rule.compareBranchh)
    );
    if (!matchedMergeMethodRule) {
      return;
    }
    setTimeout(() => {
      changeMergeMethod(matchedMergeMethodRule.method);
    }, 500);
    setTimeout(() => {
      changeMergeMethod(matchedMergeMethodRule.method);
    }, 2000);
  });
};

if (document.readyState === "complete") {
  checkAndChangeMergeMethod();
} else {
  document.addEventListener("DOMContentLoaded", () => {
    checkAndChangeMergeMethod();
  });
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type !== "page-rendered" && msg.type !== "rule-changed") {
    return true;
  }
  checkAndChangeMergeMethod();
  return true;
});

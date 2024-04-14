import { REPOSITORY_HOSTS } from "./constant/constant";
import { isMatchText } from "./utils/isMatchText";

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status !== "complete") {
    return;
  }
  if (tab.url && REPOSITORY_HOSTS.some((url) => isMatchText(tab.url!, url))) {
    chrome.tabs.sendMessage(tabId, { type: "page-rendered" });
  }
});

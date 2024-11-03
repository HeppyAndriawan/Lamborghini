const isGithubActions = process.env.GITHUB_ACTIONS;
export const baseurl = isGithubActions
  ? "./"
  : process.env.NODE_ENV === "development"
  ? "/"
  : "./";
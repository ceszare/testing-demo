import { memoizeFunction, mergeStyleSets } from "@fluentui/react";

export const getClassNames = memoizeFunction(() => {
  return mergeStyleSets({
    root: {
      position: "relative",
      height: "100%",
      selectors: {
        "& .ms-DetailsRow-cell": {
          display: "flex",
          alignItems: "center"
        },
        // this class name is appended to align the file icon with its content
        "& .pi-DetailsViewEx-fileIconHeader": {
          margin: "0 9px"
        }
      }
    }
  });
});

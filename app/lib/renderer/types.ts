import * as React from "react";

export type RendererProps = {
  children(): React.ReactNode;
  fallback?: React.ReactNode;
};

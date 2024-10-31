import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "Create Giverve Stack" }];
};

export default function Index() {
  return <main></main>;
}

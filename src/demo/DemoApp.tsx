import { DemoProvider } from "./store/DemoContext";
import { DemoLayout } from "./layout/DemoLayout";

/** Entry point for the /demo routes: state provider + responsive shell. */
export function DemoApp() {
  return (
    <DemoProvider>
      <DemoLayout />
    </DemoProvider>
  );
}

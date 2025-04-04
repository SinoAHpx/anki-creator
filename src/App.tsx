import { Dictionary } from "./components/Dictionary";
import { Sidebar } from "./components/Sidebar";

function App() {
  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="relative flex-1">
          <Dictionary />
        </div>
      </div>
    </div>
  );
}

export default App;

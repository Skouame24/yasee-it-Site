import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/accueil" component={Home} />
      <Route path="/services" component={Home} />
      <Route path="/diagnostic" component={Home} />
      <Route path="/audit" component={Home} />
      <Route path="/strategie" component={Home} />
      <Route path="/resilience" component={Home} />
      <Route path="/rssi-externalise" component={Home} />
      <Route path="/tests-intrusion" component={Home} />
      <Route path="/formation" component={Home} />
      <Route path="/a-propos" component={Home} />
      <Route path="/contact" component={Home} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

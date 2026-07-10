import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { RootLayout } from "@/components/layout/RootLayout";

import Home from "@/pages/Home";
import Projects from "@/pages/Projects";
import Plans from "@/pages/Plans";
import Media from "@/pages/Media";
import Contact from "@/pages/Contact";
import Cv from "@/pages/Cv";

const queryClient = new QueryClient();

function Router() {
  return (
    <RootLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/projets" component={Projects} />
        <Route path="/plans" component={Plans} />
        <Route path="/mediatheque" component={Media} />
        <Route path="/contact" component={Contact} />
        <Route path="/cv" component={Cv} />
        <Route component={NotFound} />
      </Switch>
    </RootLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

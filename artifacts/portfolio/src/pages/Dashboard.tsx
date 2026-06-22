import { useGetProjectStats, useListMessages, useGetStats } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, PenTool, LayoutGrid, HardHat, Mail, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetStats();
  const { data: projectStats, isLoading: projectStatsLoading } = useGetProjectStats();
  const { data: messages, isLoading: messagesLoading } = useListMessages();

  return (
    <div className="min-h-screen py-8 px-4 container mx-auto bg-background/50">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Tableau de Bord</h1>
          <p className="text-muted-foreground">Vue d'ensemble de votre portfolio et contacts.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Projets", value: stats?.projectsCompleted || 0, icon: Building, color: "text-primary" },
          { title: "Chantiers", value: stats?.sitesSupervised || 0, icon: HardHat, color: "text-accent" },
          { title: "Plans", value: stats?.plansCreated || 0, icon: PenTool, color: "text-emerald-500" },
          { title: "Messages", value: messages?.length || 0, icon: Mail, color: "text-purple-500" },
        ].map((item, i) => (
          <Card key={i} className="bg-card border-border">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{item.title}</p>
                {statsLoading ? <Skeleton className="h-8 w-16" /> : <h3 className="text-3xl font-bold">{item.value}</h3>}
              </div>
              <div className={`p-4 rounded-full bg-background border border-border ${item.color}`}>
                <item.icon className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Charts */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><LayoutGrid className="w-5 h-5 text-primary" /> Projets par Type</CardTitle>
            </CardHeader>
            <CardContent>
              {projectStatsLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : projectStats?.byType?.length ? (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={projectStats.byType} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                      <XAxis dataKey="type" stroke="#9CA3AF" tick={{fill: '#9CA3AF'}} axisLine={false} tickLine={false} />
                      <YAxis stroke="#9CA3AF" tick={{fill: '#9CA3AF'}} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                        cursor={{fill: '#374151', opacity: 0.4}}
                      />
                      <Bar dataKey="count" fill="#1E40AF" radius={[4, 4, 0, 0]} maxBarSize={60} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">Pas assez de données</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Messages */}
        <div className="lg:col-span-1">
          <Card className="bg-card border-border h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Mail className="w-5 h-5 text-accent" /> Messages Récents</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {messagesLoading ? (
                  [1,2,3].map(i => <div key={i} className="p-4"><Skeleton className="h-4 w-3/4 mb-2" /><Skeleton className="h-3 w-1/2" /></div>)
                ) : messages?.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">Aucun message</div>
                ) : (
                  messages?.slice(0, 5).map(msg => (
                    <div key={msg.id} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-sm">{msg.name}</h4>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(msg.createdAt), "dd MMM", { locale: fr })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{msg.email}</p>
                      <p className="text-sm mt-2 line-clamp-2">{msg.message}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

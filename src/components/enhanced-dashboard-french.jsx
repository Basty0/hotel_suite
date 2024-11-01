"use client";

import * as React from "react";
import {
  TrendingUp,
  ArrowUpRight,
  DollarSign,
  Home,
  Package,
  Calendar,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { getDashboardStats } from "@/api/authApi";
import { Skeleton } from "@/components/ui/skeleton";

const formatDateFr = (dateString) => {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

const colorPalette = {
  primary: "hsl(346.8, 77.2%, 49.8%)",
  secondary: "hsl(240, 4.8%, 95.9%)",
  accent: "hsl(240, 4.8%, 95.9%)",
  muted: "hsl(240, 4.8%, 95.9%)",
  destructive: "hsl(0, 84.2%, 60.2%)",
  chart1: "hsl(12, 76%, 61%)",
  chart2: "hsl(173, 58%, 39%)",
  chart3: "hsl(197, 37%, 24%)",
  chart4: "hsl(43, 74%, 66%)",
  chart5: "hsl(27, 87%, 67%)",
};

export function EnhancedDashboardFrench() {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = "votre_token_ici"; // Remplacez par la méthode appropriée pour obtenir le token
        const response = await getDashboardStats(token);
        setData(response.data);
      } catch (err) {
        setError("Erreur lors du chargement des données");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <DashboardSkeleton />;
  if (error) return <ErrorDisplay message={error} />;
  if (!data) return null;

  const reservationsParStatut = Object.entries(
    data.reservations_par_statut
  ).map(([name, value]) => ({ name, value }));
  const reservationsParJour = Object.entries(data.reservations_par_jour).map(
    ([date, value]) => ({ date: formatDateFr(date), value })
  );
  const achatsParPeriode = Object.entries(data.achats_par_periode).map(
    ([date, value]) => ({ date: formatDateFr(date), value })
  );

  const totalReservations = reservationsParStatut.reduce(
    (acc, curr) => acc + curr.value,
    0
  );

  const metricCards = [
    {
      title: "Chiffre d'affaires total",
      value: `${data.chiffre_affaires_total.toLocaleString()} €`,
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
      trend: 5.2,
    },
    {
      title: "Nombre de chambres",
      value: data.nombre_chambres,
      icon: <Home className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Nombre de produits",
      value: data.nombre_produits,
      icon: <Package className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Réservations aujourd'hui",
      value: data.reservations_aujourd_hui,
      icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
      trend: 3.8,
    },
  ];

  return (
    <div className="p-6 space-y-6 ">
      <h1 className="text-3xl font-bold text-foreground">Tableau de Bord</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((card, index) => (
          <MetricCard key={index} {...card} index={index} />
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Réservations par statut</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                réservé: { label: "Réservé", color: colorPalette.primary },
                validé: { label: "Validé", color: colorPalette.success },
                occupé: { label: "Occupé", color: colorPalette.accent },
              }}
              className="mx-auto aspect-square h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reservationsParStatut}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill={colorPalette.primary}
                    strokeWidth={5}
                  >
                    {reservationsParStatut.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          Object.values(colorPalette)[
                            index % Object.values(colorPalette).length
                          ]
                        }
                      />
                    ))}
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-3xl font-bold"
                              >
                                {totalReservations}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-muted-foreground"
                              >
                                Réservations
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Réservations par période</CardTitle>
            <CardDescription>Derniers 5 jours</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                reservations: {
                  label: "Réservations",
                  color: colorPalette.secondary,
                },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={reservationsParJour}>
                  <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickMargin={10}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={colorPalette.secondary}
                    strokeWidth={2}
                    dot={{ fill: colorPalette.secondary, strokeWidth: 2 }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Tendance à la hausse de 5.2% ce mois-ci{" "}
              <TrendingUp className="h-4 w-4 text-success" />
            </div>
            <div className="leading-none text-muted-foreground">
              Affichage des réservations pour les 5 derniers jours
            </div>
          </CardFooter>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Achats par période</CardTitle>
            <CardDescription>Derniers 5 jours</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                achats: { label: "Achats", color: colorPalette.accent },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={achatsParPeriode}>
                  <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickMargin={10}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar
                    dataKey="value"
                    fill={colorPalette.accent}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Tendance à la hausse de 3.8% ce mois-ci{" "}
              <TrendingUp className="h-4 w-4 text-success" />
            </div>
            <div className="leading-none text-muted-foreground">
              Affichage des achats pour les 5 derniers jours
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, trend, index }) {
  const cardStyles = [
    { bg: "bg-yellow-100", text: "text-yellow-800" },
    { bg: "bg-rose-100", text: "text-rose-800" },
    { bg: "bg-green-100", text: "text-green-800" },
    { bg: "bg-blue-100", text: "text-blue-800" },
  ];

  const style = cardStyles[index % cardStyles.length];

  return (
    <Card className={`${style.bg} border shadow-none`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={`text-sm font-medium ${style.text}`}>
          {title}
        </CardTitle>
        {React.cloneElement(icon, { className: `h-4 w-4 ${style.text}` })}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${style.text}`}>{value}</div>
        {trend && (
          <p className={`text-xs ${style.text} opacity-80`}>
            <span
              className={`${
                trend > 0 ? "text-success" : "text-destructive"
              } flex items-center`}
            >
              {trend}%{" "}
              {trend > 0 ? (
                <ArrowUpRight className="h-4 w-4 ml-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 ml-1" />
              )}
            </span>
            par rapport au mois dernier
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6 ">
      <Skeleton className="h-9 w-64" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ErrorDisplay({ message }) {
  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="text-danger">Erreur</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{message}</p>
        </CardContent>
      </Card>
    </div>
  );
}

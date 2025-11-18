# Shadcn UI Components

This directory contains shadcn/ui components that have been added to the project.

## Available Components

### Table
```tsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/UI/table"

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Charts
```tsx
import { AreaChartComponent, BarChartComponent, LineChartComponent, PieChartComponent } from "@/components/UI/charts"

const chartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
}

<AreaChartComponent 
  data={data} 
  dataKey="sales" 
  xAxisKey="month" 
  config={chartConfig} 
/>
```

### Card
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/UI/card"

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
  <CardFooter>
    Footer content
  </CardFooter>
</Card>
```

### Button
```tsx
import { Button } from "@/components/UI/button"

<Button variant="default" size="default">Click me</Button>
<Button variant="outline" size="sm">Outline</Button>
<Button variant="destructive">Delete</Button>
```

### Badge
```tsx
import { Badge } from "@/components/UI/badge"

<Badge variant="default">New</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
```

### Dialog
```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/UI/dialog"

<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

### Tabs
```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/UI/tabs"

<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account content</TabsContent>
  <TabsContent value="password">Password content</TabsContent>
</Tabs>
```

### Other Components
- **Input**: Form input component
- **Skeleton**: Loading skeleton component
- **Separator**: Visual separator component
- **Avatar**: User avatar component

## Usage

All components can be imported from the index file:

```tsx
import { Table, Card, Button, Badge } from "@/components/UI"
```

Or individually:

```tsx
import { Table } from "@/components/UI/table"
import { Card } from "@/components/UI/card"
```


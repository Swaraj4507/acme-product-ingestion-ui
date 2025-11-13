import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Package, Webhook, ArrowRight } from "lucide-react";

export const DashboardPage = () => {
  return (
    <div className="container mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your product inventory and webhook configurations
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/upload" className="group">
          <Card className="h-full transition-all hover:shadow-lg hover:border-primary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              <CardTitle className="mt-4">Upload Products</CardTitle>
              <CardDescription>
                Upload CSV files to import products in bulk with real-time progress tracking
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link to="/products" className="group">
          <Card className="h-full transition-all hover:shadow-lg hover:border-primary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              <CardTitle className="mt-4">Manage Products</CardTitle>
              <CardDescription>
                View, create, update, and delete products with advanced search and filtering
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link to="/webhooks" className="group">
          <Card className="h-full transition-all hover:shadow-lg hover:border-primary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Webhook className="h-6 w-6 text-primary" />
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              <CardTitle className="mt-4">Webhooks</CardTitle>
              <CardDescription>
                Configure and manage webhook endpoints for real-time event notifications
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
};


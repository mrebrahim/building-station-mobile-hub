import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Database, AlertCircle, CheckCircle, Clock, Package, Folder } from "lucide-react";
import { useSyncLogs, useCategories, useProducts } from "@/hooks/useWooCommerceData";
import { useDataRefresh } from "@/hooks/useDataRefresh";
import { toast } from "sonner";

export default function SyncDashboard() {
  const [isSyncing, setIsSyncing] = useState(false);
  const { data: syncLogs, isLoading: logsLoading, refetch: refetchLogs } = useSyncLogs(20);
  const { data: categories } = useCategories();
  const { data: products } = useProducts();
  const { triggerWooCommerceSync } = useDataRefresh();

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      toast.info("🔄 بدء المزامنة اليدوية...", { duration: 5000 });
      
      const result = await triggerWooCommerceSync();
      
      if (result.success) {
        const message = `✅ تمت المزامنة بنجاح!\n📂 الفئات: ${result.categories.synced}/${result.categories.total}\n📦 المنتجات: ${result.products.synced}/${result.products.total}`;
        
        if (result.errors && result.errors.length > 0) {
          toast.warning(`⚠️ ${message}\n❌ ${result.errors.length} خطأ`, { duration: 8000 });
        } else {
          toast.success(message, { duration: 5000 });
        }
      } else {
        toast.error(`❌ فشلت المزامنة: ${result.error}`, { duration: 8000 });
      }
      
      // Refresh logs
      await refetchLogs();
    } catch (error) {
      console.error('Manual sync error:', error);
      toast.error(`❌ حدث خطأ: ${error.message}`, { duration: 8000 });
    } finally {
      setIsSyncing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />نجح</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800 border-red-200"><AlertCircle className="w-3 h-3 mr-1" />خطأ</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200"><Clock className="w-3 h-3 mr-1" />جاري التنفيذ</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const lastSync = syncLogs?.[0];
  const successfulSyncs = syncLogs?.filter(log => log.status === 'success').length || 0;
  const errorSyncs = syncLogs?.filter(log => log.status === 'error').length || 0;

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">لوحة تحكم المزامنة</h1>
            <p className="text-muted-foreground">مراقبة وإدارة مزامنة بيانات WooCommerce</p>
          </div>
          <Button 
            onClick={handleManualSync} 
            disabled={isSyncing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'جاري المزامنة...' : 'مزامنة يدوية'}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الفئات</CardTitle>
              <Folder className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories?.length || 0}</div>
              <p className="text-xs text-muted-foreground">فئة محفوظة</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المنتجات</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products?.length || 0}</div>
              <p className="text-xs text-muted-foreground">منتج محفوظ</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المزامنة الناجحة</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{successfulSyncs}</div>
              <p className="text-xs text-muted-foreground">عملية ناجحة</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">أخطاء المزامنة</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{errorSyncs}</div>
              <p className="text-xs text-muted-foreground">عملية فاشلة</p>
            </CardContent>
          </Card>
        </div>

        {/* Last Sync Status */}
        {lastSync && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                آخر عملية مزامنة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">الحالة:</span>
                    {getStatusBadge(lastSync.status)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">التوقيت:</span>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(lastSync.started_at)}
                    </span>
                  </div>
                  {lastSync.message && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">الرسالة:</span>
                      <span className="text-sm text-muted-foreground">{lastSync.message}</span>
                    </div>
                  )}
                </div>
                <div className="text-right space-y-1">
                  <div className="text-sm">
                    <span className="font-medium">الفئات:</span> {lastSync.categories_count || 0}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">المنتجات:</span> {lastSync.products_count || 0}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sync Logs */}
        <Card>
          <CardHeader>
            <CardTitle>سجل المزامنة</CardTitle>
            <CardDescription>تاريخ عمليات المزامنة الأخيرة</CardDescription>
          </CardHeader>
          <CardContent>
            {logsLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span className="mr-2">جاري التحميل...</span>
              </div>
            ) : syncLogs && syncLogs.length > 0 ? (
              <div className="space-y-4">
                {syncLogs.map((log) => (
                  <div key={log.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(log.status)}
                        <span className="text-sm font-medium">{log.sync_type}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(log.started_at)}
                      </span>
                    </div>
                    
                    {log.message && (
                      <p className="text-sm text-muted-foreground">{log.message}</p>
                    )}
                    
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>الفئات: {log.categories_count || 0}</span>
                      <span>المنتجات: {log.products_count || 0}</span>
                      {log.completed_at && (
                        <span>
                          المدة: {Math.round((new Date(log.completed_at).getTime() - new Date(log.started_at).getTime()) / 1000)}ث
                        </span>
                      )}
                    </div>
                    
                    {log.errors && (
                      <details className="text-xs">
                        <summary className="cursor-pointer text-red-600">عرض الأخطاء ({Array.isArray(log.errors) ? log.errors.length : 1})</summary>
                        <pre className="mt-2 p-2 bg-red-50 rounded text-red-800 overflow-auto">
                          {JSON.stringify(log.errors, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                لا توجد سجلات مزامنة
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
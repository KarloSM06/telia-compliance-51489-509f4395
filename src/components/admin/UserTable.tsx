import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { RoleBadge } from "./RoleBadge";
import { LoadingState } from "./LoadingState";
import { EmptyState } from "./EmptyState";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  role: 'admin' | 'client';
  permissions_count: number;
}

interface UserTableProps {
  users: User[];
  onEditPermissions: (user: User) => void;
  loading: boolean;
}

export function UserTable({ users, onEditPermissions, loading }: UserTableProps) {
  return (
    <section className="relative py-12 bg-gradient-to-b from-background via-primary/2 to-background">
      <div className="container mx-auto px-6 lg:px-8">
        <AnimatedSection delay={300}>
          <Card className={cn(
            "border border-primary/10",
            "bg-gradient-to-br from-card/80 via-card/50 to-card/30",
            "backdrop-blur-md",
            "hover:shadow-xl hover:border-primary/30",
            "transition-all duration-500"
          )}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                    Användare
                  </CardTitle>
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-primary/50 via-primary/20 to-transparent rounded-full" />
                </div>
                <Badge variant="outline">{users.length} användare</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <LoadingState />
              ) : users.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="rounded-lg border border-primary/10 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow className="hover:bg-transparent border-primary/10">
                        <TableHead className="font-semibold">Email</TableHead>
                        <TableHead className="font-semibold">Roll</TableHead>
                        <TableHead className="font-semibold">Aktiva Rättigheter</TableHead>
                        <TableHead className="font-semibold">Senast Inloggad</TableHead>
                        <TableHead className="font-semibold">Skapad</TableHead>
                        <TableHead className="text-right font-semibold">Åtgärder</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow 
                          key={user.id}
                          className={cn(
                            "hover:bg-primary/5 transition-colors",
                            "border-primary/10"
                          )}
                        >
                          <TableCell className="font-medium">{user.email}</TableCell>
                          <TableCell><RoleBadge role={user.role} /></TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono">
                              {user.permissions_count} / 11
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {user.last_sign_in_at
                              ? format(new Date(user.last_sign_in_at), 'PPp', { locale: sv })
                              : <Badge variant="secondary">Aldrig</Badge>}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {format(new Date(user.created_at), 'PP', { locale: sv })}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEditPermissions(user)}
                              className="hover:bg-primary/10 hover:text-primary transition-colors"
                            >
                              <Settings className="h-4 w-4 mr-2" />
                              Redigera
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </section>
  );
}

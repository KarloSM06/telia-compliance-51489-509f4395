import { Home, Settings, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { useSidebar } from "@/components/ui/animated-sidebar";
import { cn } from "@/lib/utils";

export function ProfileSection() {
  const { user, signOut } = useAuth();
  const { role, isAdmin } = useUserRole();
  const { open } = useSidebar();
  const navigate = useNavigate();

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const getRoleLabel = () => {
    if (isAdmin) return "Admin";
    return "Användare";
  };

  return (
    <div className="border-t border-sidebar-border pt-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div 
            className={cn(
              "flex items-center gap-3 cursor-pointer rounded-md p-2 -m-2 transition-all duration-300",
              "hover:bg-gradient-to-r hover:from-[hsl(222,47%,25%)]/10 hover:to-[hsl(222,47%,35%)]/5",
              "group"
            )}
          >
            <div className="relative">
              <Avatar className={cn(
                "h-10 w-10 flex-shrink-0 transition-all duration-300",
                "ring-2 ring-[hsl(222,47%,25%)]/20",
                "group-hover:ring-[hsl(222,47%,35%)]/60 group-hover:scale-105"
              )}>
                <AvatarFallback className={cn(
                  "font-semibold transition-colors duration-300",
                  "bg-gradient-to-br from-[hsl(222,47%,25%)] to-[hsl(222,47%,35%)]",
                  "text-white"
                )}>
                  {getInitials(user?.email || "")}
                </AvatarFallback>
              </Avatar>
              
              {/* Status indicator */}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-sidebar-background" />
            </div>

            <motion.div 
              animate={{
                display: open ? "block" : "none",
                opacity: open ? 1 : 0
              }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-hidden"
            >
              <p className="text-sm font-semibold truncate text-sidebar-foreground">
                {user?.email?.split("@")[0] || "Användare"}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-xs text-sidebar-foreground/60 truncate">
                  {user?.email}
                </p>
                {role && (
                  <span className={cn(
                    "text-[0.625rem] px-1.5 py-0.5 rounded-full font-medium",
                    "bg-gradient-to-r from-[hsl(222,47%,25%)] to-[hsl(222,47%,35%)]",
                    "text-white"
                  )}>
                    {getRoleLabel()}
                  </span>
                )}
              </div>
            </motion.div>

            <motion.div
              animate={{
                display: open ? "block" : "none",
                opacity: open ? 1 : 0,
                rotate: 0
              }}
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <Settings className="h-4 w-4 text-sidebar-foreground/40" />
            </motion.div>
          </div>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="end" 
          className={cn(
            "w-56 backdrop-blur-sm",
            "bg-gradient-to-br from-background to-background/95",
            "border-[hsl(222,47%,25%)]/20"
          )}
        >
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">Mitt konto</p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
              {role && (
                <span className={cn(
                  "text-[0.625rem] px-2 py-1 rounded-full font-medium w-fit",
                  "bg-gradient-to-r from-[hsl(222,47%,25%)] to-[hsl(222,47%,35%)]",
                  "text-white"
                )}>
                  {getRoleLabel()}
                </span>
              )}
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => navigate("/")}
            className="cursor-pointer"
          >
            <Home className="mr-2 h-4 w-4" />
            Hem
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => navigate("/dashboard/settings")}
            className="cursor-pointer"
          >
            <Settings className="mr-2 h-4 w-4" />
            Inställningar
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={signOut} 
            className="text-destructive cursor-pointer focus:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logga ut
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

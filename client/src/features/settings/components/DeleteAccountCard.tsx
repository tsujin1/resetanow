import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "@/features/auth/services/authService";
import { Loader2, Trash2 } from "lucide-react";
import { AuthContext } from "@/shared/context/AuthContext";
import { useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function DeleteAccountCard() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useContext(AuthContext)!;
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    if (!password) {
      toast.error("Password is required", {
        description: "Please enter your password to confirm account deletion.",
      });
      return;
    }

    setIsDeleting(true);
    toast.dismiss();

    try {
      await authService.deleteAccount(password);

      // Logout and clear user data
      logout();

      // Show success message
      toast.success("Account deleted successfully", {
        description: "Your account has been permanently deleted.",
      });

      // Navigate to login page
      navigate("/login");
    } catch (error) {
      console.error("Failed to delete account:", error);
      toast.error("Failed to delete account", {
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while deleting your account.",
      });
      setIsDeleting(false);
      setPassword(""); // Clear password on error
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset password when dialog closes
      setPassword("");
    }
  };

  return (
    <div className="mt-12 border-t border-slate-200 pt-8">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Danger Zone</h2>
          <p className="text-sm text-slate-600">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
        </div>
        <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              disabled={isDeleting}
              className="w-full sm:w-auto"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Account
                </>
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove all your data from our servers. All your
                patients, prescriptions, and medical certificates will be
                permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="delete-password">
                  Enter your password to confirm
                </Label>
                <Input
                  id="delete-password"
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isDeleting}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && password && !isDeleting) {
                      handleDeleteAccount();
                    }
                  }}
                  autoFocus
                />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                disabled={isDeleting || !password}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Deleting...
                  </>
                ) : (
                  "Yes, delete my account"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}



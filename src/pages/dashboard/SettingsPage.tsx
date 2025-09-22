// src/pages/dashboard/SettingsPage.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { config } from "@/config";

function SettingsPage() {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Dialog states
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);

  // Form inputs
  const [newEmail, setNewEmail] = useState("");
  const [passwordForEmail, setPasswordForEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const getToken = () => {
    // Retrieves the auth token from localStorage.
    return localStorage.getItem("authToken");
  };

  // Fetch current email (dummy fetch example)
  useEffect(() => {
    // Replace with API call to fetch current user info
    setEmail("***@smartlan.co.ke");
  }, []);

  const token = getToken(); // your JWT from login

  // Handle email update
  const handleEmailUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${config.API_URL}/user/change-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          new_email: newEmail,
          password: passwordForEmail,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setEmail(newEmail);
        setOpenEmailDialog(false);
        setNewEmail("");
        setPasswordForEmail("");
      } else {
        toast.error(data.error || "Failed to update email");
      }
    } catch (err) {
      toast.error("Error connecting to server");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle password update
  const handlePasswordUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${config.API_URL}/user/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setOpenPasswordDialog(false);
        setCurrentPassword("");
        setNewPassword("");
      } else {
        toast.error(data.error || "Failed to update password");
      }
    } catch (err) {
      toast.error("Error connecting to server");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800">Settings</h1>

      {/* Email Card */}
      <Card>
        <CardHeader>
          <CardTitle>Email</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <span>{email}</span>
          <Button
            onClick={() => setOpenEmailDialog(true)}
            className="bg-[#004d66]"
          >
            Change Email
          </Button>
        </CardContent>
      </Card>

      {/* Password Card */}
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <span>********</span>
          <Button
            onClick={() => setOpenPasswordDialog(true)}
            className="bg-[#004d66]"
          >
            Change Password
          </Button>
        </CardContent>
      </Card>

      {/* Email Dialog */}
      <Dialog open={openEmailDialog} onOpenChange={setOpenEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newEmail">New Email</Label>
              <Input
                id="newEmail"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Current Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordForEmail}
                  onChange={(e) => setPasswordForEmail(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleEmailUpdate}
              disabled={loading}
              className="bg-[#004d66]"
            >
              {loading ? (
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
              ) : null}
              Update Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Dialog */}
      <Dialog open={openPasswordDialog} onOpenChange={setOpenPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                   required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>
               
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handlePasswordUpdate}
              disabled={loading}
              className="bg-[#004d66]"
            >
              {loading ? (
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
              ) : null}
              Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SettingsPage;

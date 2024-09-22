"use client";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useState } from "react";
import { ModeToggle } from "@/components/dark-mode-toggle";
import { supabase } from "@/utils/client";
import { Session } from "@supabase/supabase-js";
import useAuthSession from "@/hooks/useAuthSession";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUpMode, setIsSignUpMode] = useState(true);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [actionAfterDialog, setActionAfterDialog] = useState<() => void>(
    () => () => {}
  );

  const { session } = useAuthSession() as {
    session: Session | null;
    loading: boolean;
  };

  const router = useRouter();

  const toggleDrawer = () => {
    setIsSignUpMode(false);
    setIsOpen(!isOpen);
  };

  const handleAuth = async () => {
    setLoading(true);
    setError(null);

    let result;
    if (isSignUpMode) {
      result = await supabase.auth.signUp({
        email: email,
        password: password,
      });
    } else {
      result = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
    }

    const { error } = result;

    if (error) {
      setError(error.message);
      setAlertMessage(error.message);
      setActionAfterDialog(() => () => setShowAlertDialog(false));
      setShowAlertDialog(true);
    } else {
      setAlertMessage(
        isSignUpMode ? "Sign up successful!" : "Login successful!"
      );
      setActionAfterDialog(() => () => {
        setShowAlertDialog(false);
        setIsOpen(false);
        router.push("/");
      });
      setShowAlertDialog(true);
    }

    setLoading(false);
  };

  const toggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
    setEmail("");
    setPassword("");
    setError(null);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setError(error.message);
      setAlertMessage(error.message);
      setActionAfterDialog(() => () => setShowAlertDialog(false));
      setShowAlertDialog(true);
    } else {
      setAlertMessage("Logged out successfully!");
      setActionAfterDialog(() => () => {
        setShowAlertDialog(false);
        router.push("/");
      });
      setShowAlertDialog(true);
    }
  };

  const handleDialogClose = () => {
    setShowAlertDialog(false);
    if (actionAfterDialog) {
      actionAfterDialog();
    }
  };

  return (
    <div className="w-full flex justify-between items-center">
      <ModeToggle />
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        ResSpec
      </h3>

      {!session ? (
        <>
          <Button variant="link" onClick={toggleDrawer}>
            Login
          </Button>

          <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>
                  {isSignUpMode
                    ? "Create your account"
                    : "Login to your account"}
                </DrawerTitle>
                <DrawerDescription>
                  {isSignUpMode
                    ? "Sign up with your email and password."
                    : "Login with your email and password."}
                </DrawerDescription>
              </DrawerHeader>
              <div className="p-4">
                <div className="mb-4">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-red-500">{error}</p>}
              </div>
              <DrawerFooter>
                <Button onClick={handleAuth} disabled={loading}>
                  {loading
                    ? "Submitting..."
                    : isSignUpMode
                    ? "Sign Up"
                    : "Login"}
                </Button>
                <Button variant="outline" onClick={toggleDrawer}>
                  Cancel
                </Button>
                <Button variant="link" onClick={toggleMode}>
                  {isSignUpMode
                    ? "Already have an account? Login"
                    : "Don't have an account? Sign Up"}
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </>
      ) : (
        <div className="flex items-center">
          <p className="text-sm text-muted-foreground">
            Welcome, {session.user.email}
          </p>
          <Button variant="link" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      )}

      <AlertDialog open={showAlertDialog} onOpenChange={handleDialogClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertMessage}</AlertDialogTitle>
            <AlertDialogDescription>
              {alertMessage.includes("successful")
                ? "You will be redirected shortly."
                : "Please try again."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDialogClose}>
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

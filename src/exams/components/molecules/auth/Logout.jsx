import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useLoggedOutMutation } from "@/features/auth/authApi";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Logout = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleOpen = (event) => {
        event.preventDefault();
        setOpen(true)
    };

    const token = useSelector(state => state?.auth?.token)

    const [logout, { error }] = useLoggedOutMutation();

    const handleLogout = async () => {
        try {
            await logout(token);
            setOpen(false);
            navigate("/");
        } catch (err) {
            toast.error(error?.data?.message || "Something went wrong");
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen} >
            <AlertDialogTrigger onClick={handleOpen} className="w-full !p-0" >
                <Button className="w-full !p-0 text-base">
                    Logout
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="w-[95%] mx-auto">
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to log out from your account? This will end your current session.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>
                        Yes
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
export default Logout;
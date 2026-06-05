import { useNavigate, useRouteError } from "react-router-dom";
import { Button } from "./components/ui/button";

export default function ErrorPage() {
    const error = useRouteError();
    const navigate = useNavigate();

    return (
        <div className='h-svh'>
            <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
                <h1 className='text-[7rem] font-bold leading-tight'>Oops!</h1>
                <p className='font-medium'>Sorry, an unexpected error has occurred.</p>
                <p className='text-center text-muted-foreground'>
                    <i>{error.statusText || error.message}</i>
                </p>
                <div className='mt-6 flex gap-4'>
                    <Button variant='outline' onClick={() => navigate(-1)}>
                        Go Back
                    </Button>
                    <Button onClick={() => navigate('/')}>Back to Home</Button>
                </div>
            </div>
        </div>
    );
}

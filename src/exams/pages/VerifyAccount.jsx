import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useResendVerifyAccountMutation, useVerifyAccountMutation } from '@/features/categories/categoriesApi';
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import Loading from '../components/atoms/Loading';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const VerifyAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { control, handleSubmit, formState: { errors }, setValue } = useForm();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const email = queryParams.get("email");

  const [verifyAccount, { data, isLoading, error }] = useVerifyAccountMutation();
  const [resendVerifyAccount, { data: reesendData, isLoading: resendLoading, error: resendError }] = useResendVerifyAccountMutation();

  useEffect(() => {
    if (email && token) {
      verifyAccount({ email, token });
    }
  }, [email, token]);

  useEffect(() => {
    if (data?.status_code === 200) {
      toast.success(data?.data);
      navigate("/login");
    } else if (error) {
      toast.error(error?.data?.message);
    }
  }, [data, error]);

  const resendEmailVerification = async (formData) => {
    await resendVerifyAccount(formData);
    if (reesendData?.status_code === 200) {
      toast.success(reesendData?.data);
      navigate("/login");
    } else if (resendError) {
      toast.error(resendError?.data?.message);
    }
  };

  const onSubmit = (data) => {
    resendEmailVerification(data);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='flex justify-center items-center'>
      <div className='w-full max-w-2xl bg-white p-5 rounded-md xl:p-10 shadow'>
        <h1 className='text-xl mb-1 font-semibold'>Verify Account</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-5">
          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address"
              }
            }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter your email"
                className="flex-grow"
              />
            )}
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
          <Button type="submit" className='!py-6' disabled={resendLoading}>
            {resendLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Resend Verification"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default VerifyAccount;

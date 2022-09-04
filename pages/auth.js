import { getSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AuthForm from '../components/auth/auth-form';

function AuthPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getSession().then((session) => {
      if (!session) {
        setIsLoading(false);
        return;
      }
      router.replace('/');
    })
  }, [router]);

  if(isLoading){
    return (
      <p>Loading...</p>
    );
  }

  return <AuthForm />;
}

export default AuthPage;

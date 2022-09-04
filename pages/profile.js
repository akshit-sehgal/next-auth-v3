import { getSession } from 'next-auth/client';
import UserProfile from '../components/profile/user-profile';

function ProfilePage() {
  return <UserProfile />;
}
export const getServerSideProps = async (ctx) => {
  // Server Side Route Guard
  const session = await getSession({ req: ctx.req });
  if(!session){
    return { 
      redirect:{
        destination: '/auth',
        premanent: false
      }
    };
  }

  return {
    props:{session}
  };
};
export default ProfilePage;

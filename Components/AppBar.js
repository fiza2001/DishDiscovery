import { auth, signIn, signOut } from "@/auth";
import Link from "next/link";


export default async function AppBar() {
  const session = await auth();
  return (
    <div className="auth-status">
      {session?.user ? (
        <div>
            {session.user.name && session.user.image &&
            <img src={session.user.image} alt={session.user.name}/>
            }
          <p>{session.user.name}</p>
          <Link href="api/auth/signout" style={{color:'black'}}>Sign Out</Link>
        </div>
      ) : (
        <Link href="/api/auth/signin" style={{color:'black'}}>Sign In</Link>
      )}
    </div>
  );
}

import DeployButton from "../components/DeployButton";
import AuthButton from "../components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import ConnectSupabaseSteps from "@/components/tutorial/ConnectSupabaseSteps";
import SignUpUserSteps from "@/components/tutorial/SignUpUserSteps";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

export default async function Index() {
  return (
    <div className="flex-1 w-full flex flex-col gap-16 items-center">
      <nav className="w-full flex justify-center border-b border-gray-300 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center text-sm p-4">
          <p>Logo</p>
          <AuthButton />
        </div>
      </nav>

      <div className="flex-1 flex flex-col gap-16 max-w-4xl p-4 w-full">
        <main className="flex-1 flex flex-col gap-4 h-full w-full">
          <h1 className="font-bold text-4xl tracking-tight antialiased">
            Understand your web traffic effortlessly
          </h1>
          <h2 className="text-xl mb-4 text-gray-500">
            The free and open source alternative to Vercel Analytics
          </h2>
          <Button>Click Me</Button>
        </main>
      </div>

      <footer className="w-full border-t border-gray-300 p-8 flex justify-center text-center text-xs">
        <p>
          Powered by{" "}
          <a
            href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            Supabase
          </a>
        </p>
      </footer>
    </div>
  );
}

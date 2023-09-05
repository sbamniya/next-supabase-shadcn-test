import Autocomplete from "@/components/AutoComplete";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import LogoutButton from "../components/LogoutButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SkillList from "@/components/SkillList";

export const dynamic = "force-dynamic";

export default async function Index() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("skills")
    .select()
    .order("sequence_number", {
      ascending: true,
    });

  return (
    <div className="w-full flex flex-col items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm text-foreground">
          <div />
          <div>
            {user ? (
              <div className="flex items-center gap-4">
                Hey, {user.email}!
                <LogoutButton />
              </div>
            ) : (
              <Link
                href="/login"
                className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
      <br />
      {error && <p>Failed to fetch skills</p>}
      {!error && (
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Skills</CardTitle>
            <CardDescription>
              Type in below input to see suggestions or add new skill
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Autocomplete items={data || []} />
            <br />
            <SkillList skills={data || []} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

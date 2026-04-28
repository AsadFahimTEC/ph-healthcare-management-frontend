import Hero from "@/components/modules/Home/Hero";
import PublicFooter from "@/components/modules/Home/PublicFooter";
import PublicNavbar from "@/components/modules/Home/PublicNavbar";
import Steps from "@/components/modules/Home/Steps";
import TopDoctors from "@/components/modules/Home/TopDoctors";


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-grow">
        <Hero />
        <Steps />
        <TopDoctors />
      </main>
      <PublicFooter />
    </div>
  );
}
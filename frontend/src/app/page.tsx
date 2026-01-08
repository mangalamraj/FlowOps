import Header from "@/components/home/header";
import TableContainer from "@/components/home/tableContainer";

export default function Home() {
  return (
    <div className="container flex flex-col px-2 mt-4 md:w-full md:mx-auto gap-4 md:gap-8">
      <Header />
      <TableContainer />
    </div>
  );
}

import Navbar from "../components/Navbar";
import RecordingForm from "../components/RecordingForm";
import TimeHeader from "../components/TimeHeader";
import ModelButton from "../components/ModelButton";

function Home() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-9 w-full max-w-[1100px] mx-auto mt-6 md:mt-15 p-4 md:p-0 font-mitr">
        <div className="bg-[#f7d9d9] text-black p-4 md:p-6 border-2 border-black rounded-lg w-full md:w-auto flex-2">
          <RecordingForm />
        </div>
        <div className="bg-[#f7d9d9] text-black p-4 md:p-6 border-2 border-black rounded-lg w-full md:w-auto flex-1 text-center">
          <div className="bg-[#faeeee] mb-5 border-2 rounded-lg">
            <TimeHeader />
          </div>
          <ModelButton />
        </div>
      </div>
    </>
  );
}
export default Home;

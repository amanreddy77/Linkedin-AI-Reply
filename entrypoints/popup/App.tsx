
import './App.css';

function App() {

  return (
    <>
       <div className='flex flex-col items-center p-[30px] gap-3'> <img src="/wxt.svg" alt="" className='h-8 w-8 bg-black rounded-full ' />
       <h1 className='text-lg font-bold'>Linkedin AI reply</h1></div>
       <div className='pl-[30px] pr-[30px] '>
        <p className='text-base font-semibold text-slate- mb-2 text-center'>Hello, Linkedin AI reply</p>
        <p className='text-sm text-center'>LinkedIn AI Reply is a Chrome extension designed to boost your messaging efficiency. By leveraging AI to suggest relevant responses as you type, it helps you communicate faster and more effectively—allowing you to focus on meaningful interactions instead of time-consuming typing.</p>
        <div className="mt-6 flex justify-center items-center">
  <button className="bg-blue-600 text-white py-3 px-6 w-52 rounded-lg font-semibold shadow-md transition-transform transform hover:bg-blue-700 hover:-translate-y-1 focus:ring-4 focus:ring-green-600 focus:outline-none">
    Let's Go! </button> </div> </div>
    </>
  );
}

export default App;
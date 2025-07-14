import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Topic from "./Pages/Topic";
import QuestionList from "./Pages/QuestionList.jsx";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/:company" element={<Topic/>}/>
          <Route path="/:company/:topicName" element={<QuestionList/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App